import { React,useEffect,useState } from 'react';
import { MatchDetailCard } from '../components/MatchDetailCard.js';
import { MatchSmallCard } from '../components/MatchSmallCard.js';



export const TeamPage = () => {

  const [team,setTeam] = useState({matchList : []});

  useEffect(
    () => {
      const fetchMatches = async () =>{
        const response = await fetch('http://localhost:8080/team/Chennai%20Super%20Kings');
        const data = await response.json();
        setTeam(data);
      };
      fetchMatches();      
    },[]
  );

  return (
    <div className="TeamPage">
      <h1>{team.teamName}</h1>
      <MatchDetailCard match={team.matchList[0]}/>
      {team.matchList.slice(1).map(match => <MatchSmallCard match={match}/>)}
    </div>
  );
}
