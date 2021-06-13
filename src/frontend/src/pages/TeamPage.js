import { React,useEffect,useState } from 'react';
import{ useParams } from 'react-router-dom';
import { MatchDetailCard } from '../components/MatchDetailCard.js';
import { MatchSmallCard } from '../components/MatchSmallCard.js';



export const TeamPage = () => {

  const [team,setTeam] = useState({matchList : []});
  const { teamName } = useParams();
  useEffect(
    () => {
      const fetchMatches = async () =>{
        const response = await fetch(`http://localhost:8080/team/${teamName}`);
        const data = await response.json();
        setTeam(data);
      };
      fetchMatches();      
    },[teamName]
  );

    if(!team || !team.teamName){
      return <h1>Team Not Found</h1>
    }

  return (
    <div className="TeamPage">
      <h1>{team.teamName}</h1>
      <MatchDetailCard teamName={team.teamName} match={team.matchList[0]}/>
      {team.matchList.slice(1).map(match => <MatchSmallCard teamName={team.teamName} match={match}/>)}
    </div>
  );
}
