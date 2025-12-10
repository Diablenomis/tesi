import { pageDescriptions } from "../constants/TypeConstants";

export const CoachingInfoCard: React.FC = () => {
  let descTest: { main: string; secondary: string[] }[] =
    pageDescriptions.coaching;
  return (
    <div className="panel big-card col-12 m-auto p-0 relative zoom-in">
      <div className="col-lg-7 col-md-9 col-sm-10 col-10 m-auto text-align-center info-card-title mt-3 default-info-title">
        Coaching online
      </div>
      <div className="col-12 m-0 p-0 padding-page mb-3 mt-3">
        <div className="col-11 m-auto p-0 text-align-center info-card-title mt-3">
          {descTest &&
            descTest.map((element, indi) => (
              <div className="mb-4" key={indi}>
                <span className="main-text-info-card">{element.main}</span>
                {element.secondary.length > 0 && (
                  <div className="default-info-title text-align-left mt-2">
                    {element.secondary &&
                      element.secondary.map((secElement, ind) => (
                        <li key={ind}>{secElement}</li>
                      ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
      <div className="col-12 m-0 p-0 pt-3 pb-3 info-card-footer">
        <div className="col-12 m-0 p-0 row padding-page">
          <div className="col-4 m-0 text-align-center info-card-sub">
            Telefono
          </div>
          <div className="col-4 m-0 text-align-center info-card-sub">Mail</div>
          <div className="col-4 m-0 text-align-center info-card-sub">
            Instagram
          </div>
        </div>
        <div className="col-12 m-0 p-0 mt-1 row padding-page">
          <div className="col-4 m-0 text-align-center info-card-contact">
            +39 321987654
          </div>
          <div className="col-4 m-0 text-align-center info-card-contact">
            fit.nexus.support@gmail.com
          </div>
          <div className="col-4 m-0 text-align-center info-card-contact">
            @fitNexus.official
          </div>
        </div>
      </div>
    </div>
  );
};
