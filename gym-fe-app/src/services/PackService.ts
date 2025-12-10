import http from "../http-common";
import {
  IConnection,
  IConnectionPers,
  IConnectionResponse,
} from "../models/Connection";
import {
  IExercise,
  IExerciseResponse,
  IPackDetail,
  IPackDetailResponse,
  IPackPreviewResponse,
} from "../models/Pack";

const getPacksPreview = (discipline: string) => {
  return http.get<IPackPreviewResponse>("tutorial/courses/" + discipline + "/");
};

const getPacksPreviewByUser = () => {
  return http.get<any>("tutorial/my-courses/");
};

const getPacksPersByUser = (id:string) => {
  return http.get<any>("personal/my-course/?scheda=" + id);
};

const getPackDetailByIdLevel = (idLevel: number) => {
  return http.get<any>("tutorial/my-courses/" + idLevel + "/");
};

const getPackDetailByIdLevelForCoach = (idPack:any, idLevel: number) => {
  return http.get<any>("tutorial/form/" + idPack + "/" + idLevel + "/");
};

const getPackDetail = (title: string) => {
  return http.get<IPackDetailResponse>("tutorial/course/" + title + "/");
};

const createNewPack = (pack: IPackDetail) => {
  if (pack.image.trim() === "") {
    pack.image = "default";
  }
  pack.levels.forEach((level) => {
    if (level.goals_video.trim() === "") {
      level.goals_video = "default";
    }
    if (level.requirements_video.trim() === "") {
      level.requirements_video = "default";
    }
  });
  return http.post<any>("tutorial/course-insert/", pack);
};

const editPack = (packEdited: string, pack: IPackDetail) => {
  if (pack.image.trim() === "") {
    pack.image = "default";
  }
  pack.levels.forEach((level) => {
    if (level.goals_video.trim() === "") {
      level.goals_video = "default";
    }
    if (level.requirements_video.trim() === "") {
      level.requirements_video = "default";
    }
  });
  return http.put<any>("/tutorial/course-update/" + packEdited + "/", pack);
};

const editLevel = (level: any) => {
  if (level.goals_video.trim() === "") {
    level.goals_video = "default";
  }
  if (level.requirements_video.trim() === "") {
    level.requirements_video = "default";
  }
  return http.put<any>("/tutorial/course/level/update/", level);
};

const createNewLevel = (level: any) => {
  if (level.goals_video.trim() === "") {
    level.goals_video = "default";
  }
  if (level.requirements_video.trim() === "") {
    level.requirements_video = "default";
  }
  return http.post<any>("/tutorial/course/level/insert/", level);
};

const deleteLevel = (levelToDelete: any) => {
  // manca chiamata api
  return http.delete<any>("/tutorial/course/level/delete/");
};

const deletePack = (packEdited: string) => {
  return http.delete<any>("/tutorial/course/" + packEdited + "/");
};

const getExercises = () => {
  return http.get<IExerciseResponse>("exercise/");
};

const createNewExercise = (exercise: IExercise) => {
  return http.post<any>("exercise/", exercise);
};

const editExercise = (exercise: IExercise) => {
  return http.put<any>("exercise/" + exercise.id + "/", exercise);
};

const deleteExercise = (exercise: IExercise) => {
  return http.delete<any>("exercise/" + exercise.id + "/");
};

const getConnections = () => {
  return http.get<IConnectionResponse>("tutorial/form/");
};

const createNewConnection = (connection: IConnection) => {
  return http.post<any>("tutorial/form/", connection);
};

const editConnection = (connection: IConnection, idForm: string) => {
  return http.put<any>("tutorial/form/" + idForm + "/", connection);
};

const sendSurvey = (data: any) => {
  let dataSurvey = {
    survey: data,
  };
  return http.post<any>("survey/send/", dataSurvey);
};

const getUsersForSchedePers = () => {
  return http.get<any>("coach/list/email/bought/pers/");
};

// const createNewConnectionPers = (connection: IConnectionPers) => {
  
// };

const saveConnectionPers = (connection: IConnectionPers) => {
  if(connection.id === "")
  {
      return http.post<any>("personal/form/", connection);
  }
  else
  {
    return http.put<any>("personal/form/" + connection.id + "/", connection);
  }
};

const getConnectionPers = (email: string) => {
  if(email==="")
  return http.get<any>("personal/all-forms/");
  else
  return http.get<any>("personal/all-forms/?user_email="+email );
};


const getSchedulePerson = (id: string) => {
  return http.get<any>("personal/form/"+id +"/");
};

const deleteSchedulePerson = (id: string) => {
  return http.delete<any>("personal/form/"+id +"/");
};

const sendSchedaPersonalizzata = (id:string) => {

  return http.put<any>("/personal/form/publish/" +id +"/");
}

const PackService = {
  getPacksPreview,
  getPackDetail,
  createNewPack,
  editPack,
  editLevel,
  createNewLevel,
  deleteLevel,
  deletePack,
  getExercises,
  createNewExercise,
  editExercise,
  deleteExercise,
  getConnections,
  createNewConnection,
  getPacksPreviewByUser,
  getPacksPersByUser,
  getPackDetailByIdLevel,
  editConnection,
  getPackDetailByIdLevelForCoach,
  sendSurvey,
  getUsersForSchedePers,
  // createNewConnectionPers,
  sendSchedaPersonalizzata,
  getConnectionPers,
  getSchedulePerson,
  deleteSchedulePerson,
  saveConnectionPers
};

export default PackService;
