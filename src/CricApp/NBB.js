import React, { useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NBB() {
  const location = useLocation();
  const navigate = useNavigate();
  const { innings, hostteam, visitteam, overs, striker, nonstriker, oldbowler, tag, newteamovers, teamruns} = location.state || {};
  const [newstriker, setnewstriker] = useState()
  const [newnonstriker, setnewnonstriker] = useState()
  const [bowler, setnewbowler] = useState('');
  const newBowlerBalls = 0
  const newteamruns = teamruns

   useEffect(() => {
          if (newteamovers === overs) {
              const newinnings = 2
              alert('innnigs over')
              const newteamruns = teamruns
              navigate('/BBL', {
                  state: { innings: newinnings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag, newteamruns }
              })
          }
      },);

  function Startmatch() {
    if (tag) 
    { 
      const stcandidate = newstriker?.trim();
      if (!newstriker?.trim()) {
        alert('Please enter the new striker name');
        return;
      }
      navigate('/scorecard', {
        state: { innings, hostteam, visitteam, overs, striker: stcandidate, nonstriker, bowler, tag: !tag, bowlerballs: newBowlerBalls, teamruns: newteamruns }
      });
    }
    else {
      const nstcandidate = newnonstriker?.trim();
      if (!newnonstriker?.trim()) {
        alert('Please enter the new non-striker name');
        return;
      }
      navigate('/scorecard', {
        state: { innings, hostteam, visitteam, overs, striker, nonstriker: nstcandidate, bowler, tag: !tag, bowlerballs: newBowlerBalls, teamruns 
        }
      });
    }
  }

  return (
     <div className="col-md-6 mt-4 mx-auto">
  <div style={{ backgroundColor: 'rgb(182, 172, 171)' }} className="p-4 rounded shadow">
    <div className="text-center mb-3">
      <h1>New Batsman</h1>
      <h3>{innings === 1 ? hostteam : visitteam}</h3>
    </div>

    <input type="text" className="form-control mb-2" placeholder="Striker name"
      value={tag ? newstriker : (striker || '')}
      readOnly={!tag} required={tag}
      onChange={(e) => setnewstriker(e.target.value)} />

    <input type="text" className="form-control mb-4" placeholder="Non-striker name"
      value={tag ? (nonstriker || '') : newnonstriker}
      readOnly={tag} required={!tag}
      onChange={(e) => setnewnonstriker(e.target.value)} />

    <div className="text-center mb-3">
      <h1>Bowler</h1>
      <h3>{innings === 2 ? hostteam : visitteam}</h3>
    </div>

    <input type="text" className="form-control mb-3" placeholder="Bowler name"
      value={bowler}
      onChange={(e) => setnewbowler(e.target.value)} required />

    <input type="button" className="btn btn-primary w-100" value="Done" onClick={Startmatch} />
  </div>
</div>

  );
}

