export interface ICoach {
  name: string;
  surname: string;
  number: string;
  email: string;
  weight: string;
  height: string;
  gender: string;
  bday: string;
  top_discipline_name: string;
  training_exp: string;
  coach_exp: string;
  skills: string;
  image: string;
  video: string;
  max_coaching: number;
  number_students: number;
}

export interface ICoachResponse {
  data: {
    count: number;
    next: any;
    previous: any;
    results: ICoach[];
  };
}
