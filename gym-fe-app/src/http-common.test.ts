import axios from "axios";
import http from "./http-common";
import { LS_ACCESS_TOKEN, LS_REFRESH_TOKEN, LS_USER } from "./constants/TypeConstants";

const unauthorized = (config: any) => Promise.reject({ config, response: { status: 401 } });
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(LS_USER, "cliente@example.test");
  localStorage.setItem(LS_ACCESS_TOKEN, "expired");
  localStorage.setItem(LS_REFRESH_TOKEN, "valid-refresh");
});
afterEach(() => jest.restoreAllMocks());

test("awaits refresh, keeps a non-rotating refresh token and returns the retried response", async () => {
  const refresh = jest.spyOn(axios, "post").mockResolvedValue({ data: { access: "fresh" } });
  const adapter = jest.fn((config) => config.headers.Authorization === "Bearer fresh"
    ? Promise.resolve({ config, status: 200, data: "saved", headers: {}, statusText: "OK" })
    : unauthorized(config));
  http.defaults.adapter = adapter;
  expect((await http.post("personal/survey/", { survey: [1] })).data).toBe("saved");
  expect(adapter).toHaveBeenCalledTimes(2);
  expect(adapter.mock.calls[1][0].data).toBe(adapter.mock.calls[0][0].data);
  expect(refresh).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem(LS_REFRESH_TOKEN)).toBe("valid-refresh");
});

test("concurrent 401s share one refresh and store an optional rotated token", async () => {
  let complete: any;
  const refresh = jest.spyOn(axios, "post").mockImplementation(() => new Promise(resolve => { complete = resolve; }));
  http.defaults.adapter = (config: any) => config._retry
    ? Promise.resolve({ config, status: 200, data: config.url, headers: {}, statusText: "OK" })
    : unauthorized(config);
  const requests = Promise.all([http.get("first/"), http.get("second/")]);
  await new Promise(resolve => setTimeout(resolve, 0));
  complete({ data: { access: "fresh", refresh: "rotated" } });
  expect((await requests).map(r => r.data)).toEqual(["first/", "second/"]);
  expect(refresh).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem(LS_REFRESH_TOKEN)).toBe("rotated");
});

test("expired refresh rejects once, clears credentials and does not reload the page", async () => {
  const refresh = jest.spyOn(axios, "post").mockRejectedValue({ response: { status: 401 } });
  const adapter = jest.fn(unauthorized);
  http.defaults.adapter = adapter;
  await expect(http.get("personal/survey/")).rejects.toMatchObject({ response: { status: 401 } });
  expect(refresh).toHaveBeenCalledTimes(1);
  expect(adapter).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem(LS_USER)).toBeNull();
  expect(localStorage.getItem(LS_REFRESH_TOKEN)).toBeNull();
});

test("a failed retry is not refreshed indefinitely", async () => {
  const refresh = jest.spyOn(axios, "post").mockResolvedValue({ data: { access: "fresh" } });
  const adapter = jest.fn(unauthorized);
  http.defaults.adapter = adapter;
  await expect(http.get("personal/survey/")).rejects.toMatchObject({ response: { status: 401 } });
  expect(adapter).toHaveBeenCalledTimes(2);
  expect(refresh).toHaveBeenCalledTimes(1);
});

test.each(["auth/login/", "auth/token/refresh/"])("does not refresh rejected %s", async url => {
  const refresh = jest.spyOn(axios, "post");
  http.defaults.adapter = unauthorized;
  await expect(http.post(url)).rejects.toMatchObject({ response: { status: 401 } });
  expect(refresh).not.toHaveBeenCalled();
});

test("refresh transport failures preserve credentials and propagate without retrying the write", async () => {
  jest.spyOn(axios, "post").mockRejectedValue(new Error("offline"));
  const adapter = jest.fn(unauthorized);
  http.defaults.adapter = adapter;
  await expect(http.post("personal/survey/")).rejects.toThrow("offline");
  expect(adapter).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem(LS_REFRESH_TOKEN)).toBe("valid-refresh");
});

test("missing refresh returns the original 401 without a refresh request", async () => {
  localStorage.removeItem(LS_REFRESH_TOKEN);
  const refresh = jest.spyOn(axios, "post");
  http.defaults.adapter = unauthorized;
  await expect(http.get("personal/survey/")).rejects.toMatchObject({ response: { status: 401 } });
  expect(refresh).not.toHaveBeenCalled();
});
