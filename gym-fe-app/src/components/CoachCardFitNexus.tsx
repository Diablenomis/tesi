import { useEffect, useState } from "react";
import { pageDescriptions } from "../constants/TypeConstants";

export const CoachCardFitNexus: React.FC = () => {
  const [dimension, setDimension] = useState<number>(window.innerWidth);
  let descTest: { main: string; secondary: string[] }[] = pageDescriptions.fitNexus;

  useEffect(() => {
    setDimension(window.innerWidth);
    window.addEventListener("resize", updateDimension);
  }, []);

  const updateDimension = () => {
    setDimension(window.innerWidth);
  };

  return (
    <div className="col-12 row m-0 p-0 panel little-card text-align-center zoom-in">
      <div className="col-4 m-0 row pack-card-body padding-pack-card bg-gray">
        <div className="no-pm col">
          <div className="col-12 no-pm coach-card-image coach-card-fit-nexus-background-mock pointer"></div>
        </div>
      </div>
      <div className="col-8 text-align-left pt-3">
        <div className="col-12 m-0 p-0 pt-2">
          <div className="col-11 m-auto p-0 text-align-center info-card-title mt-3">
            {descTest &&
              descTest.map((element, index) => {
                if (dimension < 1180 && dimension > 670) {
                  if (index < 2) {
                    return (
                      <div className="mb-4" key={index}>
                        <span className="main-text-info-card">
                          {element.main}
                        </span>
                        {element.secondary.length > 0 && (
                          <div className="default-info-title text-align-left mt-2">
                            {element.secondary &&
                              element.secondary.map((secElement, ind) => (
                                <li key={ind}>{secElement}</li>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                } else if (dimension >= 1180) {
                  if (index < 3) {
                    return (
                      <div className="mb-4">
                        <span className="main-text-info-card">
                          {element.main}
                        </span>
                        {element.secondary.length > 0 && (
                          <div className="default-info-title text-align-left mt-2">
                            {element.secondary &&
                              element.secondary.map((secElement, indi) => (
                                <li key={indi}>{secElement}</li>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                } else {
                  if (index === 0) {
                    return (
                      <div className="mb-4">
                        <span className="main-text-info-card">
                          {element.main}
                        </span>
                        {element.secondary.length > 0 && (
                          <div className="default-info-title text-align-left mt-2">
                            {element.secondary &&
                              element.secondary.map((secElement, indi) => (
                                <li key={indi}>{secElement}</li>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                }
              })}
          </div>
        </div>
      </div>
      <div className="col-12 ">
        <div className="col-12 m-0 p-0 pt-2">
          <div className="col-11 m-auto p-0 text-align-center info-card-title mt-3">
            {descTest &&
              descTest.map((element, index) => {
                if (dimension < 1180 && dimension > 670) {
                  if (index >= 2) {
                    return (
                      <div className="mb-4" key={index}>
                        <span className="main-text-info-card">
                          {element.main}
                        </span>
                        {element.secondary.length > 0 && (
                          <div className="default-info-title text-align-left mt-2">
                            {element.secondary &&
                              element.secondary.map((secElement, indi) => (
                                <li key={indi}>{secElement}</li>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                } else if (dimension >= 1180) {
                  if (index >= 3) {
                    return (
                      <div className="mb-4">
                        <span className="main-text-info-card">
                          {element.main}
                        </span>
                        {element.secondary.length > 0 && (
                          <div className="default-info-title text-align-left mt-2">
                            {element.secondary &&
                              element.secondary.map((secElement, indi) => (
                                <li key={indi}>{secElement}</li>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                } else {
                  if (index > 0) {
                    return (
                      <div className="mb-4">
                        <span className="main-text-info-card">
                          {element.main}
                        </span>
                        {element.secondary.length > 0 && (
                          <div className="default-info-title text-align-left mt-2">
                            {element.secondary &&
                              element.secondary.map((secElement, indi) => (
                                <li key={indi}>{secElement}</li>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                }
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
