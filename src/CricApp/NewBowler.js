import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NewBowler() {
    const location = useLocation();
    const navigate = useNavigate();
    const { innings, hostteam, visitteam, overs, striker, nonstriker, oldbowler, tag, newteamovers, teamruns } = location.state || {};
    const [bowler, setnewbowler] = useState('');
    useEffect(() => {

        if (newteamovers === overs && innings===1) {
            const newinnings = 2
            alert('innnigs over')
            const newteamruns = teamruns
            navigate('/BBL', {
                state: { innings: newinnings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag, newteamruns }
            })
        }else if(newteamovers === overs && innings===2)
        {
            alert('Match over!!')
            navigate('/Over',{state:{hostteam,visitteam}})
        }
    },);

    function Startmatch() {
        if (!bowler.trim()) {
            alert('Please enter a bowler name!');
            return;
        }
        navigate('/scorecard', {
            state: { innings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag: !tag }
        });
    }
    return (
        <div className='row justify-content-center'>
             <div className="d-flex justify-content-center align-items-center ml-3">
              <h1 style={{ marginLeft: '50px' }}>{hostteam}</h1>
              <h3 style={{ marginLeft: ' 10px' }}>vs</h3>
              <h1 style={{ marginLeft: ' 10px' }}>{visitteam}</h1>
            </div>

            <div className="col-md-4 mb-3 p-3 mt-2 rounded" style={{backgroundColor:'rgb(182, 172, 171)'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '150px' }}>
                    <div><h1>Batting Team</h1></div>
                    <div><h3>{innings === 1 ? hostteam : visitteam}</h3></div>
                </div>
                <input type="text" className='form-control mt-3' placeholder='Striker name' value={striker || ''} readOnly />
                <input type="text" className='form-control mt-3 mb-3' placeholder='Non-striker name' value={nonstriker || ''} readOnly />
                <div style={{ display: 'flex', alignItems: 'center', gap: '150px' }}>
                    <div><h1>New Bowler</h1></div>
                    <div><h3>{innings === 2 ? hostteam : visitteam}</h3></div>
                </div>
                <input type="text" className='form-control mt-3' placeholder='Bowler name' value={bowler} onChange={(e) => setnewbowler(e.target.value)} required />
                <input type="button" className="btn btn-primary mt-3" value="Done" onClick={Startmatch} />
            </div>
        </div>
    );
}
