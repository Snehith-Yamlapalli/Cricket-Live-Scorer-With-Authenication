import { React, useEffect, useState } from 'react';
import firebase from './firebase';

export default function History() {
    const realtimefirebasedb = firebase.database();
    const [teamsData, setTeamsData] = useState([]);

    useEffect(() => {
        realtimefirebasedb.ref('DBteams').once('value').then(snapshot => {
            const allTeams = snapshot.val();
            const fetches = allTeams.map(team => {
                return realtimefirebasedb
                    .ref(`${team}/dbplayerslist`)
                    .once('value')
                    .then(playerSnapshot => {
                        const playersObj = playerSnapshot.val() || {};
                        const players = Object.values(playersObj);
                        return { teamName: team, players };
                    });
            });
            Promise.all(fetches).then(allTeamData => {
                setTeamsData(allTeamData);
            });
        });
    }, []);

    return (
        <div>
            <div className='row justify-content-center'>
                <div className='col-md-10'>
                    <h1>Previous Teams</h1>
                    <table className='table table-dark'>
                        <thead>
                            <tr>
                                <th>Team Name</th>
                                <th>Players</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamsData.map((team, index) => (
                                <tr key={index}>
                                    <td>{team.teamName}</td>
                                    <td>
                                        {team.players.map((player, i) => (
                                            <span key={i} style={{ marginRight: '10px' }}>
                                                {player}{' ,'}
                                            </span>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
