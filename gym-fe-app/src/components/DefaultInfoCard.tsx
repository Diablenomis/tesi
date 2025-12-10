import {
  PROFILE_PATH,
  SCHEDA_PERSONALIZZATA_PATH,
  SCHEDA_TUTORIAL_PATH,
} from "../constants/PathConstants";
import { pageDescriptions } from "../constants/TypeConstants";

interface IDefaultInfoCard {
  type: string;
}

export const DefaultInfoCard: React.FC<IDefaultInfoCard> = ({ type }) => {
  let descTest: { main: string; secondary: string[] }[] = [];
  if (type === SCHEDA_TUTORIAL_PATH) {
    descTest = pageDescriptions.tutorial;
  } else if (type === SCHEDA_PERSONALIZZATA_PATH) {
    descTest = pageDescriptions.personalizzata;
  } else if (type === PROFILE_PATH) {
    descTest = pageDescriptions.personal;
  }
  return (
    <div className="panel big-card col-12 m-auto p-0 relative zoom-in">
      <div className="col-12 m-0 p-0 padding-page mb-3">
        <div className="col-lg-7 col-md-9 col-sm-10 col-10 m-auto text-align-center info-card-title mt-3 default-info-title">
          {type === SCHEDA_TUTORIAL_PATH && "Schede tutorial"}
          {type === SCHEDA_PERSONALIZZATA_PATH && "Schede personalizzate"}
          {type === PROFILE_PATH && "Area personale"}
        </div>
        <div className="col-11 m-auto p-0 text-align-center info-card-title mt-3">
          {descTest &&
            descTest.map((element, index) => (
              <div className="mb-4" key={index}>
                <span className="main-text-info-card">{element.main}</span>
                {element.secondary.length > 0 && (
                  <div className="default-info-title text-align-left mt-2">
                    {element.secondary &&
                      element.secondary.map((secElement, indexSecEle) => (
                        <li key={indexSecEle}>{secElement}</li>
                      ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
