import {
  ICart,
  ICodScontoSer,
  IPaymentPack,
  IProductSer,
} from "../models/Cart";
import { ICoach } from "../models/Coach";
import {
  IConnection,
  IConnectionPers,
  IDay,
  IExerciseConnection,
  ISection,
  ISuperSerie,
  IWeek,
} from "../models/Connection";
import {
  IPackDetail,
  IPackPreview,
  IPackLevel,
  IPackDetailCreate,
  IPackLevelCreate,
  IExercise,
} from "../models/Pack";
import {
  IRecivedFeedback,
  ILoginEmail,
  ILoginUser,
  ILoginUsername,
  ISignUser,
  IUser,
} from "../models/User";

export const initialIPaymentPack: IPaymentPack = {
  payment_method_id: "",
  products: [],
};

export const initialIProductSer: IProductSer = {
  title: "",
  level: "",
  gender: "",
};
export const initialUser: IUser = {
  id: 0,
  name: "",
  email: "",
  password: "",
  token: "",
};

export const initialLoginUser: ILoginUser = {
  email: "",
  password: "",
  username: "",
};
export const initialLoginUsername: ILoginUsername = {
  password: "",
  username: "",
};
export const initialLoginEmail: ILoginEmail = {
  email: "",
  password: "",
};

export const initialRecivedFeedback: IRecivedFeedback = {
  token: "",  
  critici: "",
  forti: "",
  ese_differenti: "",
  tempistiche_ok: "",
  altro: "",
};

export const initialSignUser: ISignUser = {
  name: "",
  surname: "",
  gender: "",
  bday: "",
  email: "",
  password: "",
  username: "",
};

export const initialCoach: ICoach = {
  name: "",
  surname: "",
  number: "",
  email: "",
  bday: "",
  coach_exp: "",
  height: "",
  weight: "",
  gender: "",
  skills: "",
  top_discipline_name: "",
  training_exp: "",
  image: "",
  video: "",
  max_coaching: 0,
  number_students: 0,
};

export const initialCart: ICart = {
  id: 0,
  userId: 0,
  packs: [],
  totalPrice: 0,
};

export const initialPackPreview: IPackPreview = {
  title: "",
  title_description: "",
  description: "",
  discipline: "",
  icon: "",
  image: "",
  coaches: [],
};

export const initialPackLevel: IPackLevel = {
  coaches: [],
  gender: "",
  description: "",
  goals: "",
  goals_video: "",
  level: "",
  price: "",
  requirements: "",
  requirements_video: "",
  required_items: "",
  frequency: "",
  duration: "",
};

export const initialPackDetail: IPackDetail = {
  description: "",
  icon: "",
  image: "",
  levels: [],
  title: "",
  title_description: "",
  discipline: "",
};

export const initialPackLevelCreate: IPackLevelCreate = {
  coaches: [],
  gender: "",
  description: "",
  goals: "",
  goals_video: "",
  level: "",
  price: "",
  requirements: "",
  requirements_video: "",
  required_items: "",
  frequency: "",
  duration: "",
};

export const initialPackDetailCreate: IPackDetailCreate = {
  description: "",
  icon: "",
  image: "",
  levels: [],
  title: "",
  title_description: "",
  discipline: "",
};

export const initialExerciseCreate: IExercise = {
  id: 0,
  name: "",
  gender: "",
  type: "",
  video: "",
  coaches: [],
};

export const initialConnection: IConnection = {
  id: "",

  scheda_tutorial: {
    title: "",
    level: "",
    gender: "",
  },
  weeks: [],
};

export const initialConnectionPers: IConnectionPers = {
  id: "",
  name: "",
  user_email: "",
  weeks: [],
};

export const initialWeek: IWeek = {
  name: "",
  number: 0,
  days: [],
};

export const initialDay: IDay = {
  name: "",
  number: 0,
  sections: [],
};

export const initialSection: ISection = {
  name: "",
  order: 0,
  exercises: [],
};

export const initialExercise: IExerciseConnection = {
  exe: initialExerciseCreate,
  order: 0,
  repetitions: "0",
  series: 0,
  stop: 0,
  load: "",
  intensity: 0,
  description: "",
  super_series: [],
};

export const initialSuperSerie: ISuperSerie = {
  exe: initialExerciseCreate,
  order: 0,
  repetitions: "0",
  stop: 0,
  description: "",
  intensity: 0,
  load: "",
};

export const initialExerciseSS: IExerciseConnection = {
  exe: initialExerciseCreate,
  order: 0,
  repetitions: "0",
  series: 0,
  stop: 0,
  load: "",
  intensity: 0,
  description: "",
  super_series: [initialSuperSerie, initialSuperSerie],
};
