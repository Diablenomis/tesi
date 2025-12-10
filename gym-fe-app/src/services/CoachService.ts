import http from "../http-common";
import { ICoach, ICoachResponse } from "../models/Coach";

const getAllCoaches = () => {
  return http.get<any>("coach/");
};

const getCoachById = (idCoach: number) => {
  return http.get<ICoach>("coach/" + idCoach + "/");
};

const createNewCoach = (coach: ICoach) => {
  if (coach.image.trim() === "") {
    coach.image = "default";
  }
  if (coach.video.trim() === "") {
    coach.video = "default";
  }
  return http.post<any>("coach/insert/", coach);
};

const modifyNewCoach = (coachEdited: string, coach: ICoach) => {
  if (coach.image.trim() === "") {
    coach.image = "default";
  }
  if (coach.video.trim() === "") {
    coach.video = "default";
  }
  return http.put<any>("coach/update/" + coachEdited + "/", coach);
};

const deleteCoach = (coachEdited: string) => {
  return http.delete<any>("coach/delete/" + coachEdited + "/");
};

const CoachService = {
  getAllCoaches,
  getCoachById,
  createNewCoach,
  modifyNewCoach,
  deleteCoach,
};

export default CoachService;
