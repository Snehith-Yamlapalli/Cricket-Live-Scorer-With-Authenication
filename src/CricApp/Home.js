import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import firebase from './firebase';

export default function Home() {

  const firebaserealtimedb = firebase.database()
  const navigate = useNavigate();
  const [hostteam, setHostteam] = useState('');
  const [visitteam, setVisitteam] = useState('');
  const [overs, setOvers] = useState('');
  const [tossWinner, setTossWinner] = useState('');
  const [tossLooser,setTossLooser] = useState('')
  const [tossDecision, setTossDecision] = useState('');
  const innings = 1;

  function Startmatch() 
  {
    const parsedOver = parseInt(overs, 20);
    if (parsedOver < 1 || parsedOver > 20) {
      alert('Number of overs must be between 1 and 20');
      return;
    }
    const firstBattingTeam  = tossDecision === 'Batting'
    ? tossWinner
    : (tossWinner === hostteam ? visitteam : hostteam);

    const secondBattingTeam = firstBattingTeam === hostteam
    ? visitteam
    : hostteam;
    const updates = {
      INFO: {
        MatchBetween: `${firstBattingTeam} vs ${secondBattingTeam}`,
        TossWinner: tossWinner,
        TossLooser:tossLooser,
        ChooseTo: tossDecision,   
        NoOfOvers: parsedOver
      }
    };
    const matchid = firstBattingTeam + 'vs' + secondBattingTeam
    firebaserealtimedb
      .ref(matchid)
      .update(updates)

    if (!hostteam || !visitteam || !overs || !tossWinner || !tossDecision) {
      alert('Please fill all fields and make your toss decision');
      return;
    }

    
    
    navigate('/BBL', {
      state: { innings, hostteam:  firstBattingTeam, visitteam: secondBattingTeam, overs: parsedOver }
    });
  }

  return (
    <div>
      <div className="row justify-content-center">
        <div className="shadow-lg p-3 mb-5 rounded col-md-6" style={{backgroundColor:'rgb(182, 172, 171)'}}>
          <h2>Teams</h2>
          <input type="text" placeholder="Host Team" className="form-control mb-2" value={hostteam} onChange={e => setHostteam(e.target.value)} />
          <input type="text" placeholder="Visiting Team" className="form-control mb-3" value={visitteam} onChange={e => setVisitteam(e.target.value)} />

          <h2>Toss Winner</h2>
          <div className="form-check"><input type="radio" className="form-check-input" id="host-toss" name="tossWinner" value={hostteam} checked={tossWinner === hostteam} onChange={e => { setTossWinner(e.target.value);setTossLooser(visitteam); setTossDecision(''); }} disabled={!hostteam} /><label className="form-check-label" htmlFor="host-toss">{hostteam || 'Host Team'}</label></div>
          <div className="form-check"><input type="radio" className="form-check-input" id="visit-toss" name="tossWinner" value={visitteam} checked={tossWinner === visitteam} onChange={e => { setTossWinner(e.target.value);setTossLooser(hostteam); setTossDecision(''); }} disabled={!visitteam} /><label className="form-check-label" htmlFor="visit-toss">{visitteam || 'Visiting Team'}</label></div>

          <h2 className="mt-3">Choose to</h2>
          {tossWinner ? (
            <>
              <div className="form-check"><input type="radio" className="form-check-input" id="batting" name="tossDecision" value="Batting" checked={tossDecision === 'Batting'} onChange={e => setTossDecision(e.target.value)} /><label className="form-check-label" htmlFor="batting">Batting</label></div>
              <div className="form-check"><input type="radio" className="form-check-input" id="bowling" name="tossDecision" value="Bowling" checked={tossDecision === 'Bowling'} onChange={e => setTossDecision(e.target.value)} /><label className="form-check-label" htmlFor="bowling">Bowling</label></div>
            </>
          ) : (
            <p className="text-muted">Select toss winner first</p>
          )}

          <h2 className="mt-3">Overs</h2>
          <input type="number" placeholder="1–10" className="form-control col-md-2" value={overs} onChange={e => setOvers(e.target.value)} min="1" max="20" />

          <button className="btn btn-primary btn-lg mt-4" onClick={Startmatch} disabled={!hostteam || !visitteam || !overs || !tossWinner || !tossDecision}>
            Start Match
          </button>
        </div>
      </div>
    </div>
  );
}
