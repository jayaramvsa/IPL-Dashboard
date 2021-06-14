import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MatchDetailCard } from '../components/MatchDetailCard.js';
import { MatchSmallCard } from '../components/MatchSmallCard.js';
import './TeamPage.scss';
import { PieChart } from 'react-minimal-pie-chart';


export const TeamPage = () => {

  const [team, setTeam] = useState({ matchList: [] });
  const { teamName } = useParams();
  useEffect(
    () => {
      const fetchMatches = async () => {
        const response = await fetch(`http://localhost:8080/team/${teamName}`);
        const data = await response.json();
        setTeam(data);
      };
      fetchMatches();
    }, [teamName]
  );

  if (!team || !team.teamName) {
    return <h1>Team Not Found</h1>
  }

  return (
    <div className="TeamPage">
      <div className="team-name-section">
        <h1 className="team-name">{team.teamName}</h1>
      </div>
      <div className="win-loss-section">
        Wins/Losses
        <PieChart
          data={[
            { title: 'Losses', value: team.totalMatches - team.totalWins, color: '#c21a1a' },
            { title: 'Wins', value: team.totalWins, color: '#4fd84f' },
          ]}
        />
      </div>
      <div className="match-detail-section">
        <h3> Latest Matches</h3>
        <MatchDetailCard teamName={team.teamName} match={team.matchList[0]} />
      </div>
      {team.matchList.slice(1).map(match => <MatchSmallCard teamName={team.teamName} match={match} />)}
      <div className="more-link">
        <a href="#">More</a>
      </div>
    </div>
  );
}
