import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import teamMembers from "../data/team";
import { ICoach } from "../models/Coach";
import CoachService from "../services/CoachService";

const TeamList = () => {
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
  
  return (
    <>
      {teamList.map((member, index) => (
        <div
          key={index}
          className={
            index % 2 == 0
              ? "col-10 mx-auto mt-40 d-flex row align-items-start"
              : "col-10 mx-auto mt-40 d-flex row align-items-start reverse-row-custom text-align-right"
          }
          data-aos="fade-up"
          data-aos-delay={`${index * 100}`}
          id={member.name.replace(/\s+/g, "")}
          style={{maxWidth:1400, marginBottom:100}}
        >
          
          <img
            src={member.image}
            alt={member.name}
            className="lazy-img teampage-img col-md-4"
          />
          <div
            className={
              "info p-3 col-md-8 " + (index % 2 == 1 ? "right-custom" : null)
            }
          >
            <h3 className="tx-dark fs-30 mb-5">{member.name}</h3>
            <div className="tx-dark fs-20 opacity-75">{member.top_discipline_name!== "nutrizionista"?"Coach": "Nutrizionista"}</div>
            <div className="tx-dark fs-20 opacity-75" style={{whiteSpace:"pre-wrap"}}>{member.coach_exp}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TeamList;
