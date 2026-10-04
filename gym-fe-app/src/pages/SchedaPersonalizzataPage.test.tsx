import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SchedaPersonalizzataPage from "./SchedaPersonalizzataPage";
import PackService from "../services/PackService";
import { formQuestions as mockQuestions, LS_USER } from "../constants/TypeConstants";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: { subType: "coaching" } }),
}));
jest.mock("../components/DefaultHeader", () => () => null);
jest.mock("../components/Footer", () => ({ Footer: () => null }));
jest.mock("../components/Seo", () => ({ Seo: () => null }));
jest.mock("../services/PackService", () => ({ __esModule: true, default: { sendSurvey: jest.fn() } }));
jest.mock("../components/SignCard", () => ({ SignCard: (p: any) => p.show ? <>
  <button onClick={() => p.onAuthenticated("cliente@example.test")}>Login stesso account</button>
  <button onClick={() => p.onAuthenticated("altro@example.test")}>Login altro account</button>
</> : null }));
jest.mock("../components/FormUserCard", () => ({ FormUserCard: (p: any) => <>
  <pre data-testid="answers">{JSON.stringify(p.userForm)}</pre>
  <button onClick={() => mockQuestions.forEach((q, i) => p.handleSelectOption(q.question,
    i === 9 || i === 10 ? "no" : i === 18 ? "Casa" : q.obbligatory ? "risposta" : ""))}>Compila</button>
  <button onClick={p.sendForm}>Invia</button>
</> }));
const send = PackService.sendSurvey as jest.Mock;
beforeEach(() => { jest.clearAllMocks(); localStorage.setItem(LS_USER, "cliente@example.test"); });
const answers = () => screen.getByTestId("answers").textContent;

test("failed save keeps question order and answers; retry sends sorted data and navigates only on success", async () => {
  send.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({ data: {} });
  render(<SchedaPersonalizzataPage />);
  fireEvent.click(screen.getByText("Compila"));
  const before = answers();
  fireEvent.click(screen.getByText("Invia"));
  await screen.findByText(/Invio non riuscito/);
  expect(answers()).toBe(before);
  expect(mockNavigate).not.toHaveBeenCalled();
  const payload = send.mock.calls[0][0];
  expect(payload.map((q: any) => q.order)).toEqual(payload.map((q: any) => q.order).sort((a: number,b: number) => a-b));
  fireEvent.click(screen.getByText("Invia"));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/payment", { state: { subType: "coaching" } }));
  expect(send.mock.calls[1][0]).toEqual(payload);
});

test("401 offers reauthentication and preserves answers for the same account", async () => {
  send.mockRejectedValueOnce({ response: { status: 401 } }).mockResolvedValueOnce({ data: {} });
  render(<SchedaPersonalizzataPage />);
  fireEvent.click(screen.getByText("Compila"));
  const before = answers();
  fireEvent.click(screen.getByText("Invia"));
  fireEvent.click(await screen.findByText("Accedi di nuovo"));
  fireEvent.click(screen.getByText("Login stesso account"));
  expect(answers()).toBe(before);
  fireEvent.click(screen.getByText("Invia"));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1));
});

test("switching accounts never submits the previous account's answers", async () => {
  send.mockRejectedValueOnce({ response: { status: 401 } });
  render(<SchedaPersonalizzataPage />);
  fireEvent.click(screen.getByText("Compila"));
  fireEvent.click(screen.getByText("Invia"));
  fireEvent.click(await screen.findByText("Accedi di nuovo"));
  fireEvent.click(screen.getByText("Login altro account"));
  expect(JSON.parse(answers()!).every((q: any) => q.answer === "")).toBe(true);
  expect(mockNavigate).not.toHaveBeenCalled();
});
