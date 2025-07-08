import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import firebase from './firebase';
import { useNavigate } from 'react-router-dom';

export default function LiveScore() {
  const navigate = useNavigate();
  const firebaserealtimedb = firebase.database()
  const { matchId } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [strikerruns, setstrikerruns] = useState()
  const [strikerballs, setstrikerballs] = useState()
  const [nonstrikeruns, setnonstrikeruns] = useState()
  const [nonstrikerballs, setnonstrikerballs] = useState()
  const [bowlerballs, setbowlerballs] = useState()
  const [bowlerruns, setbowlerruns] = useState()
  const [bowlerover, setbowlerovers] = useState()
  const [bowlerwickets, setbowlerwickets] = useState()
  const [teamscore, setteamscore] = useState()
  const [teamwickets, setteamwickets] = useState()
  const [teamovers, setteamovers] = useState()

  useEffect(() => {
    if (!matchId) return;

    const dbRef = firebase.database().ref(matchId);
    const listener = dbRef.on('value', snap => {
      setMatchData(snap.val());
    });
    return () => dbRef.off('value', listener);
  }, [matchId]);

  useEffect(() => {
    if (!matchData || !matchData.Current || !matchId) return;

    const { innings, striker, nonstriker, bowler } = matchData.Current;

    firebase.database().ref(`${matchId}/Innings${innings}`)
      .once('value')
      .then(snap => {
        const d = snap.val();
        if (d) {
          const strikerData = d.batsmen?.[striker] || {};
          const nonStrikerData = d.batsmen?.[nonstriker] || {};
          const bowlerData = d.bowlers?.[bowler] || {};

          setteamovers(d.Totalteamovers || 0)
          setteamscore(d.Totalteamruns || 0)
          setteamwickets(d.Totalteamwickets || 0)
          setstrikerruns(strikerData.runs || 0);
          setstrikerballs(strikerData.balls || 0);
          setnonstrikeruns(nonStrikerData.runs || 0);
          setnonstrikerballs(nonStrikerData.balls || 0);
          setbowlerruns(bowlerData.runs || 0);
          setbowlerballs(bowlerData.balls || 0);
          setbowlerovers(bowlerData.overs || 0);
          setbowlerwickets(bowlerData.wickets || 0);
        }
      });
  }, [matchData, matchId]);



  if (!matchData) return <div>Loading live score for {matchId}…</div>;

  const {
    INFO = {},
    Current = {},
    Innings1 = {},
    Innings2 = null
  } = matchData;

  // grab only the Over node from each innings
  const Over1 = Innings1.Over || {};
  const Over2 = (Innings2 && Innings2.Over) || {};
  const current = Innings2?.Current || Innings1?.Current || {};

  function gotoHome() { navigate('/Home'); }
  function gotoScoreCard() { navigate(`/livescoreCard/${matchId}`); }

  return (

    <div className="container my-4 position-relative">

  {/* Header & Home Button (unchanged) */}
  <h1 className="mb-3">Match: {INFO.MatchBetween || matchId}</h1>
  <h4><strong>Toss:</strong> {INFO.TossWinner} chose to {INFO.ChooseTo}</h4>
  <h4><strong>Overs per side:</strong> {INFO.NoOfOvers}</h4>

  <hr />

  <hr />

  <div className="text-white p-3 rounded mb-4" style={{ backgroundColor: 'rgb(19, 148, 213)' }}>
    <div className="row justify-content-center">
      <div className="col-12 col-md-3 text-center">
        <h2 className="mb-1">Innings</h2>
        <h3 className="mb-0">{Current.innings}</h3>
      </div>
      <div className="col-12 col-md-3 text-center">
        <h2 className="mb-1">Team</h2>
        <h3 className="mb-0">{Current.teamname}</h3>
      </div>
      <div className="col-12 col-md-3 text-center">
        <h2 className="mb-1">Score</h2>
        <h3 className="mb-0">
          {teamscore}–{teamwickets} ({teamovers}.{bowlerballs})
        </h3>
      </div>
    </div>
  </div>

  {/* Striker / Non‑Striker / Bowler */}
  <div className="row justify-content-center text-center gy-4 mb-4 rounded" style={{ backgroundColor: 'rgb(202, 198, 198)' }}>
    <div className="col-12 col-md-3">
      <h2 className="mb-1">Striker</h2>
      <h3>
        {Current.striker} – {strikerruns} ({strikerballs})
      </h3>
    </div>
    <div className="col-12 col-md-3">
      <h2 className="mb-1">Non‑Striker</h2>
      <h3>
        {Current.nonstriker} – {nonstrikeruns} ({nonstrikerballs})
      </h3>
    </div>
    <div className="col-12 col-md-3">
      <h2 className="mb-1">Bowler</h2>
      <h3>
        {Current.bowler} – {bowlerruns}-{bowlerover}.{bowlerballs}-{bowlerwickets}
      </h3>
    </div>
  </div>

 
    <button className="btn btn-primary m-3" onClick={gotoScoreCard}>Go To Full Score Card</button>
    <button className="btn btn-primary mt-2 mt-md-0" onClick={gotoHome}>
      Home
    </button>
</div>

  );
}
