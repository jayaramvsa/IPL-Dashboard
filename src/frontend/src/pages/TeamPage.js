import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MatchDetailCard } from '../components/MatchDetailCard.js';
import { MatchSmallCard } from '../components/MatchSmallCard.js';
import './TeamPage.scss';
import { PieChart } from 'react-minimal-pie-chart';
import { Link } from 'react-router-dom';


export const TeamPage = () => {

  const [team, setTeam] = useState({ matchList: [] });
  const { teamName } = useParams();
  useEffect(
    () => {
      const fetchTeam = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_ROOT_URL}/team/${teamName}`);
        const data = await response.json();
        setTeam(data);
      };
      fetchTeam();
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
      {team.matchList.slice(1).map(match => <MatchSmallCard key={match.id} teamName={team.teamName} match={match} />)}
      <div className="more-link">
        <Link to={`/teams/${teamName}/matches/${process.env.REACT_APP_DATA_END_YEAR}`}>More ></Link>
      </div>
    </div>
  );
}
