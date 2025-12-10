import LevelEasyIcon from "../assets/images/level-easy-icon.png";
import LevelEasyBlackIcon from "../assets/images/level-easy-icon-black.png";
import LevelBaseIcon from "../assets/images/level-base-icon.png";
import LevelBaseBlackIcon from "../assets/images/level-base-icon-black.png";
import LevelIntermedioIcon from "../assets/images/level-intermedio-icon.png";
import LevelIntermedioBlackIcon from "../assets/images/level-intermedio-icon-black.png";
import LevelAvanzatoIcon from "../assets/images/level-avanzato-icon.png";
import LevelAvanzatoBlackIcon from "../assets/images/level-avanzato-icon-black.png";
import LevelMasterIcon from "../assets/images/level-master-icon.png";
import LevelMasterBlackIcon from "../assets/images/level-master-icon-black.png";

import BodyPettoIcon from "../assets/images/body-part-petto-icon.png";
import BodyPettoBlackIcon from "../assets/images/body-part-petto-black-icon.png";
import BodyAddominaliIcon from "../assets/images/body-part-addominali-icon.png";
import BodyAddominaliBlackIcon from "../assets/images/body-part-addominali-black-icon.png";
import BodyBracciaIcon from "../assets/images/body-part-braccia-icon.png";
import BodyBracciaBlackIcon from "../assets/images/body-part-braccia-black-icon.png";
import BodyGambeIcon from "../assets/images/body-part-gambe-icon.png";
import BodyGambeBlackIcon from "../assets/images/body-part-gambe-black-icon.png";
import BodySchienaIcon from "../assets/images/body-part-schiena-icon.png";
import BodySchienaBlackIcon from "../assets/images/body-part-schiena-black-icon.png";
import BodyCompletoIcon from "../assets/images/body-part-completo-icon.png";
import BodyCompletoBlackIcon from "../assets/images/body-part-completo-black-icon.png";

import DisciplineCalisthenicsIcon from "../assets/images/discipline-calisthenics-icon.png";
import DisciplineCalisthenicsBlackIcon from "../assets/images/discipline-calisthenics-icon-black.png";
import DisciplinePowerliftingIcon from "../assets/images/discipline-powerlifting-icon.png";
import DisciplinePowerliftingBlackIcon from "../assets/images/discipline-powerlifting-icon-black.png";
import DisciplinePostIcon from "../assets/images/discipline-post-icon.png";
import DisciplinePostBlackIcon from "../assets/images/discipline-post-icon-black.png";
import DisciplinePosturaleIcon from "../assets/images/discipline-posturale-icon.png";
import DisciplinePosturaleBlackIcon from "../assets/images/discipline-posturale-icon-black.png";

import CoachIcon from "../assets/images/coach-icon.png";
import CoachBlackIcon from "../assets/images/coach-icon-black.png";
import {
  PACK_BODY_PART_TYPE,
  PACK_DISCIPLINE_TYPE,
  PACK_LEVEL_TYPE,
} from "../constants/TypeConstants";
import { ICoach } from "../models/Coach";

export const getLevelIcon = (levelSelected: string, level: string) => {
  switch (level) {
    case PACK_LEVEL_TYPE[0].key:
      if (levelSelected === level) {
        return LevelEasyIcon;
      } else {
        return LevelEasyBlackIcon;
      }
    case PACK_LEVEL_TYPE[1].key:
      if (levelSelected === level) {
        return LevelBaseIcon;
      } else {
        return LevelBaseBlackIcon;
      }
    case PACK_LEVEL_TYPE[2].key:
      if (levelSelected === level) {
        return LevelIntermedioIcon;
      } else {
        return LevelIntermedioBlackIcon;
      }
    case PACK_LEVEL_TYPE[3].key:
      if (levelSelected === level) {
        return LevelAvanzatoIcon;
      } else {
        return LevelAvanzatoBlackIcon;
      }
    case PACK_LEVEL_TYPE[4].key:
      if (levelSelected === level) {
        return LevelMasterIcon;
      } else {
        return LevelMasterBlackIcon;
      }
    default:
      return LevelEasyIcon;
  }
};

export const getDisciplinaIcon = (
  disciplinaSelected: string,
  disciplina: string
) => {
  switch (disciplina) {
    case PACK_DISCIPLINE_TYPE[0].key:
      if (disciplinaSelected === disciplina) {
        return DisciplineCalisthenicsIcon;
      } else {
        return DisciplineCalisthenicsBlackIcon;
      }
    case PACK_DISCIPLINE_TYPE[1].key:
      if (disciplinaSelected === disciplina) {
        return DisciplinePowerliftingIcon;
      } else {
        return DisciplinePowerliftingBlackIcon;
      }
    case PACK_DISCIPLINE_TYPE[2].key:
      if (disciplinaSelected === disciplina) {
        return DisciplinePostIcon;
      } else {
        return DisciplinePostBlackIcon;
      }
    case PACK_DISCIPLINE_TYPE[3].key:
      if (disciplinaSelected === disciplina) {
        return DisciplinePosturaleIcon;
      } else {
        return DisciplinePosturaleBlackIcon;
      }
    default:
      return LevelEasyIcon;
  }
};

export const getBodyPartIcon = (bodyPartSelected: string, bodyPart: string) => {
  switch (bodyPart) {
    case PACK_BODY_PART_TYPE[0].key:
      if (bodyPartSelected === bodyPart) {
        return BodyPettoIcon;
      } else {
        return BodyPettoBlackIcon;
      }
    case PACK_BODY_PART_TYPE[1].key:
      if (bodyPartSelected === bodyPart) {
        return BodyAddominaliIcon;
      } else {
        return BodyAddominaliBlackIcon;
      }
    case PACK_BODY_PART_TYPE[2].key:
      if (bodyPartSelected === bodyPart) {
        return BodyBracciaIcon;
      } else {
        return BodyBracciaBlackIcon;
      }
    case PACK_BODY_PART_TYPE[3].key:
      if (bodyPartSelected === bodyPart) {
        return BodyGambeIcon;
      } else {
        return BodyGambeBlackIcon;
      }
    case PACK_BODY_PART_TYPE[4].key:
      if (bodyPartSelected === bodyPart) {
        return BodySchienaIcon;
      } else {
        return BodySchienaBlackIcon;
      }
    case PACK_BODY_PART_TYPE[5].key:
      if (bodyPartSelected === bodyPart) {
        return BodyCompletoIcon;
      } else {
        return BodyCompletoBlackIcon;
      }
    default:
      return LevelEasyIcon;
  }
};

export const getCoachIcon = (coachSelected: ICoach[], coach: ICoach) => {
  let p = CoachBlackIcon;
  coachSelected.forEach((coachElement) => {
    if (coachElement) {
      if (coachElement.email === coach.email) {
        p = CoachIcon;
      }
    }
  });
  return p;
};

export const getLevelName = (level: string) => {
  let levelName = "";
  PACK_LEVEL_TYPE.forEach((type) => {
    if (type.key === level) {
      levelName = type.name;
    }
  });
  return levelName;
};

export const getDisciplineName = (disciplineKey: string) => {
  let disciplineName = "";
  PACK_DISCIPLINE_TYPE.forEach((type) => {
    if (type.key === disciplineKey) {
      disciplineName = type.name;
    }
  });
  return disciplineName;
};

export const getBodyPartName = (bodyKey: string) => {
  let bodyPartName = "";
  PACK_BODY_PART_TYPE.forEach((type) => {
    if (type.key === bodyKey) {
      bodyPartName = type.name;
    }
  });
  return bodyPartName;
};

export const getGenderName = (genderKey: string) => {
  if (genderKey === "M") {
    return "Maschio";
  } else if (genderKey === "F") {
    return "Femmina";
  } else if (genderKey === "G") {
    return "Neutro";
  }
};

export const getTypeName = (typeKey: string) => {
  return typeKey === "T" ? "Tutorial" : typeKey === "C" ? "Personalizzata" : "";
};
