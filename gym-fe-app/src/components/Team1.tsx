import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import teamMembers from "../data/team";
import { TEAM_PATH } from "../constants/PathConstants";
import CoachService from "../services/CoachService";
import { ICoach } from "../models/Coach";

const Team1 = () => {
  const [teamList, setTeamList] = useState<ICoach[]>([])

  useEffect(()=>{
    CoachService.getAllCoaches()
    .then((response)=>{
      setTeamList(response.data.data)
    })
    .catch((e)=>{
      console.log(e)
    })
  },[])

  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center customTeam">
      {teamList.length>0 && teamList.map((member,index) => (
        <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-20">
          <div
            key={index}
            className="col-11 mx-auto d-flex flex-column justify-content-between pb-20 align-items-center text-align-center"
            data-aos="fade-up"
            data-aos-delay={`${index* 100}`}
            onClick={() => {
              navigate(TEAM_PATH + "#" + member.name.replace(/\s+/g, ""));
            }}
            style={{
              height: "100%",
              border: "1px solid lightgrey",
              borderRadius: 15,
              overflow: "hidden",
            }}
          >
            <img
              src={member.image}
              alt={member.name + " " + member.surname}
              className="lazy-img team-img w-100"
            />
            <h5 className="tx-dark fs-20 mb-5">{member.name + " " + member.surname}</h5>
            {/* <div className="tx-dark opacity-75">{member.role}</div> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Team1;
