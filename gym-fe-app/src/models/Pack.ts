import { ICoach } from "./Coach";
import { IWeek } from "./Connection";

export interface IPackPreview {
  title: string;
  title_description: string;
  description: string;
  discipline: string;
  icon: string;
  image: string;
  coaches: ICoach[];
}

export interface IPackPers {
  weeks: IWeek[];
}

export interface IPackDetail {
  description: string;
  icon: string;
  image: string;
  levels: IPackLevel[];
  title: string;
  title_description: string;
  discipline: string;
}

export interface IPackDetailCreate {
  description: string;
  icon: string;
  image: string;
  levels: IPackLevelCreate[];
  title: string;
  title_description: string;
  discipline: string;
}

export interface IPackLevel {
  coaches: ICoach[];
  description: string;
  gender: string;
  goals: string;
  goals_video: string;
  level: string;
  price: string;
  requirements: string;
  requirements_video: string;
  required_items: string;
  frequency: string;
  duration: string;
  form?: any;
}

export interface IPackLevelUser {
  coaches: ICoach[];
  description: string;
  gender: string;
  goals: string;
  goals_video: string;
  level: string;
  price: string;
  requirements: string;
  requirements_video: string;
  required_items: string;
  frequency: string;
  duration: string;
  form: any[];
}

export interface IPackLevelCreate {
  coaches: any[];
  description: string;
  gender: string;
  goals: string;
  goals_video: string;
  level: string;
  price: string;
  requirements: string;
  requirements_video: string;
  required_items: string;
  frequency: string;
  duration: string;
  id?: number;
}

export interface IPackCart {
  title: string;
  description: string;
  coaches: ICoach[];
  category: string;
  price: string;
  level: string;
}

export interface IPackPreviewResponse {
  data: IPackPreview[];
}

export interface IPackDetailResponse {
  data: IPackDetail;
}

export interface IExerciseResponse {
  data: IExercise[];
}

export interface IExercise {
  id: number;
  name: string;
  gender: string;
  type: string;
  video: string;
  coaches: ICoach[];
}
