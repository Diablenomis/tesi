import { IExercise } from "./Pack";

export interface IConnection {
  id: string;
  scheda_tutorial: {
    title: string;
    level: string;
    gender: string;
  };
  weeks: IWeek[];
}

// export interface IConnection {
//   id: string;
//   scheda_tutorial: {
//     title: string;
//     level: string;
//     gender: string;
//   };
//   weeks: IWeek[];
// }


export interface IConnectionPers {
  id: string;
  user_email: string;
  weeks: IWeek[];
  name: string;
}

export interface IWeek {
  name: string;
  number: number;
  days: IDay[];
}

export interface ISection {
  name: string;
  order: number;
  exercises: IExerciseConnection[];
}

export interface IDay {
  name: string;
  number: number;
  sections: ISection[];
}

export interface IExerciseConnection {
  exe?: IExercise;
  order: number;
  repetitions: string;
  series: number;
  stop: number;
  load: string;
  intensity: number;
  description: string;
  super_series?: ISuperSerie[];
}

export interface ISuperSerie {
  exe: IExercise;
  order: number;
  repetitions: string;
  stop: number;
  load: string;
  intensity: number;
  description: string;
}

export interface IConnectionResponse {
  data: IConnection[];
}
