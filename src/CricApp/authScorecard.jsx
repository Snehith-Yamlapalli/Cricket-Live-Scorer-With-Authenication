import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import firebase from './firebase';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import { auth } from '../components/firebase';
import { setDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../components/firebase';

export default function Scorecard() {
  const navigate = useNavigate();
  const userId = auth.currentUser.uid;
  const firebaserealtimedb = firebase.database()
  const location = useLocation();
  const { innings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag: incomingTag, bowlerballs: newBowlerBalls, teamruns: newteamruns, thisover: standbyover } = location.state || {};

  var [strikerruns, setstrikerruns] = useState(0)
  var [strikerballs, setstrikerballs] = useState(0)
  var [strikerfours, setstrikerfours] = useState(0)
  var [strikersixes, setstrikersixes] = useState(0)

  const [nonstrikerruns, setnonstrikerruns] = useState(0)
  const [nonstrikerballs, setnonstrikerballs] = useState(0)
  const [nonstrikerfours, setnonstrikerfours] = useState(0)
  const [nonstrikersixes, setnonstrikersixes] = useState(0)

  const [bowlerballs, setbowerballs] = useState(newBowlerBalls ?? 0)
  const [bowlerovers, setbowlerovers] = useState(0)
  const [bowlerruns, setbowlerruns] = useState(0)
  const [bowlerwickets, setbowlerwickets] = useState(0)

  const [teamruns, setteamruns] = useState(newteamruns ?? 0)
  const [teamwickets, setteamwickets] = useState(0)
  const [Teamovers, setTeamovers] = useState(0)
  const [tag, settag] = useState(incomingTag ?? true)
  const [targetruns, settargetruns] = useState()
  const [thisover, sethisover] = useState(standbyover ?? [])
  const [selected, setSelected] = useState([]);

  const OPTIONS = [
    { key: 'Wd', label: 'Wide' },
    { key: 'W', label: 'Wicket' },
    { key: 'NB', label: 'No Ball' },
    { key: 'LB', label: 'Leg Byes' },
    { key: 'BYE', label: 'Byes' },
  ];

  const ALLOWED_PAIRS = new Set([
    ['Wd', 'W'].sort().join('|'),
    ['NB', 'BYE'].sort().join('|'),
    ['NB', 'LB'].sort().join('|'),
    ['NB', 'W'].sort().join('|'),
    ['BYE', 'W'].sort().join('|'),
    ['LB', 'W'].sort().join('|'),
  ]);

  const Key = `Innings${innings}`
  const matchid = hostteam + 'vs' + visitteam

  function swapbatsman() {
    settag(prev => !prev)
  }
  function updatescore(val) {
    if (selected.length > 0) {
      addextras(selected, val);
    }
    else {
      const updatedOver = [...thisover, String(val)];
      sethisover(updatedOver);
      const prevBowlerBalls = bowlerballs
      const newBowlerBalls = prevBowlerBalls + 1

      if (val % 2 === 1) {
        settag(prev => !prev)
      }

      if (tag) {
        setstrikerruns(r => r + val)
        if (val === 4) setstrikerfours(f => f + 1)
        if (val === 6) setstrikersixes(s => s + 1)
        setstrikerballs(b => b + 1)
      } else {
        setnonstrikerruns(r => r + val)
        if (val === 4) setnonstrikerfours(f => f + 1)
        if (val === 6) setnonstrikersixes(s => s + 1)
        setnonstrikerballs(b => b + 1)
      }

      setteamruns(r => r + val)
      setteamwickets(w => w + (val === 'W' ? 1 : 0))
      const fullOvers = Math.floor(newBowlerBalls / 6)
      const nextBowlerOvers = fullOvers

      setbowerballs(newBowlerBalls)
      setbowlerovers(nextBowlerOvers)
      setbowlerruns(r => r + val)

      {
        (async () => {
          try {
            await setDoc(
              doc(db, "Users", userId, "CricketMatch", matchid, "Innings", Key),
              {
                Totalteamruns: teamruns + val,
                Totalteamwickets: teamwickets + (selected.includes("W") ? 1 : 0),
                Totalteamovers: Teamovers + (newBowlerBalls === 6 ? 1 : 0)
              }
            );

            await setDoc(
              doc(db, "Users", userId, "CricketMatch", matchid, "Innings", Key, "Over", bowler, "BowlerOvers", bowlerovers.toString()),
              { updatedOver }
            );

            await setDoc(
              doc(db, "Users", userId, "CricketMatch", matchid, "Innings", Key, "batsmen", striker),
              {
                runs: strikerruns + (tag ? (val !== 'W' ? val : 0) : 0),
                balls: strikerballs + (tag ? 1 : 0),
                fours: strikerfours + (tag && val === 4 ? 1 : 0),
                sixes: strikersixes + (tag && val === 6 ? 1 : 0)
              }
            );

            // 4) Non-striker
            await setDoc(
              doc(db, "Users", userId, "CricketMatch", matchid, "Innings", Key, "batsmen", nonstriker),
              {
                runs: nonstrikerruns + (!tag ? (val !== 'W' ? val : 0) : 0),
                balls: nonstrikerballs + (!tag ? 1 : 0),
                fours: nonstrikerfours + (!tag && val === 4 ? 1 : 0),
                sixes: nonstrikersixes + (!tag && val === 6 ? 1 : 0)
              }
            );

            // 5) Bowler aggregate (note correct “bowlers” collection)
            await setDoc(
              doc(db, "Users", userId, "CricketMatch", matchid, "Innings", Key, "bowlers", bowler),
              {
                runs: bowlerruns + (val !== 'W' ? val : 0),
                overs: bowlerovers + (newBowlerBalls === 6 ? 1 : 0),
                balls: newBowlerBalls === 6 ? 0 : newBowlerBalls,
                wickets: bowlerwickets,
              }
            );

            alert("All updates succeeded");
          } catch (err) {
            alert("Update failed:", err);
          }
        })();
      }
      if (newBowlerBalls === 6) {
        const prevteamovers = Teamovers;
        const newteamovers = prevteamovers + 1
        setTeamovers(newteamovers)
        if (val % 2 === 0)
          navigate('/newbowler', {
            state: { innings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag, newteamovers, teamruns }
          })
        else
          navigate('/newbowler', {
            state: { innings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag: !tag, newteamovers, teamruns }
          })
      }
    }
  }

  const updateextraruns = (key) => {
    const willSelect = !selected.includes(key);
    const next = willSelect
      ? [...selected, key]
      : selected.filter(k => k !== key);

    if (next.length <= 1) {
      setSelected(next);
      return;
    }
    if (next.length === 2) {
      const [a, b] = next.slice().sort();
      if (ALLOWED_PAIRS.has(`${a}|${b}`)) {
        setSelected(next);
        return;
      }
      setSelected([key]);
      return;
    }
    setSelected([key]);
  };
  ////////////////////////////////////////////////////////////////////////////////
  function addextras(selected, runs) {
    if (runs % 2 === 1) settag(prev => !prev)
    let ballcount = true
    let runcount = false
    const prevBowlerBalls = bowlerballs
    let newBowlerBalls = prevBowlerBalls
    let val = runs

    // counting balls
    if (selected.includes('Wd') || selected.includes('NB')) { val = runs + 1; ballcount = false }
    else newBowlerBalls = prevBowlerBalls + 1


    // cpnting runs
    if (selected.includes('LB') || selected.includes('NB') || selected.includes('W')) runcount = true
    sethisover(prev => [...prev, `${runs}${[...selected].join('')}`]);


    if (selected.includes('W') && newBowlerBalls !== 6) {
      const extraString = selected.join('');               // e.g. "Wd" or "NoBallByes"
      const entry = `${runs}${extraString}`;         // e.g. "4Wd" or "1NoBallByes"
      const newOver = [...thisover, entry];            // append to the over array
      sethisover(newOver);
      (async () => {
        try {
          await setDoc(doc(db, "Users", userId, "CricketMatch", matchid, "Innings", Key, "Over", bowler, "BowlerOvers", bowlerovers.toString()), newOver);
        } catch (err) {
          console.error(err);
        }
      })();
    }
    else if (newBowlerBalls === 6 && !selected.includes('W')) {
      const prevteamovers = Teamovers;
      const newteamovers = prevteamovers
      if (val % 2 === 0)
        navigate('/newbowler', {
          state: { innings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag, newteamovers, teamruns }
        })
      else
        navigate('/newbowler', {
          state: { innings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag: !tag, newteamovers, teamruns }
        })
    } else if (selected.includes('W') && newBowlerBalls === 6) {
      const extraString = selected.join('');               // e.g. "Wd" or "NoBallByes"
      const entry = `${runs}${extraString}`;         // e.g. "4Wd" or "1NoBallByes"
      const newOver = [...thisover, entry];            // append to the over array
      sethisover(newOver);

      (async () => {
        try {
          await setDoc(doc(db, "Users", userId, "CricketMatch", matchid, "Innings", Key, "Over", bowler, "BowlerOvers", bowlerovers.toString()), newOver);
        } catch (err) {
          console.error(err);
        }
      })();

      const prevteamovers = Teamovers;
      const newteamovers = prevteamovers + 1
      if (val % 2 === 0)
        navigate('/NBB', {
          state: { innings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag, newteamovers, teamruns, bowlerovers }
        })
      else
        navigate('/NBB', {
          state: { innings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag: !tag, newteamovers, teamruns, bowlerovers }
        })
    }
    setSelected([])
  }


  return (
    <div className="container-fluid">
      <div className='row justify-content-center'>

        <div className='shadow-lg p-3 mb-3 rounded col-md-9' style={{ backgroundColor: 'rgb(182, 172, 171)' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ marginRight: '30px' }}>{innings === 1 ? hostteam : visitteam}</h3>
            <h3>{teamruns}</h3><h2>-</h2><h3>{teamwickets}</h3><h2>(</h2><h3>{Teamovers}</h3><h1>.</h1><h3>{bowlerballs}</h3><h2>)</h2>
            <h3 style={{ marginLeft: '130px' }}>{'Innings '}{innings}</h3>

            {innings === 1 && (
              <h3 style={{ marginLeft: '60px' }}>CRR:&nbsp;
                {(() => {
                  const ballsBowled = Teamovers * 6 + bowlerballs;
                  if (ballsBowled === 0) return '0.00';
                  const oversBowled = ballsBowled / 6;
                  return (teamruns / oversBowled).toFixed(2);
                })()}
              </h3>
            )}
            {innings === 2 && (
              <h3 style={{ marginLeft: '60px' }}>
                target {targetruns + 1}
              </h3>
            )}
            <h3 style={{ marginLeft: '30px' }}>Total Over:{overs}</h3>
            <div className="d-flex justify-content-center align-items-center ml-3">
              <h2 style={{ marginLeft: '50px' }}>{hostteam}</h2>
              <h3 style={{ marginLeft: ' 10px' }}>vs</h3>
              <h2 style={{ marginLeft: ' 10px' }}>{visitteam}</h2>
            </div>


          </div>

        </div>

        <div className='shadow-lg p-3 mb-3 bg-white rounded col-md-7'>
          <table className="table">
            <thead>
              <tr>
                <th>Batsman</th>
                <th>R</th>
                <th>B</th>
                <th>4s</th>
                <th>6s</th>
                <th>SR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ backgroundColor: tag ? 'chartreuse' : 'transparent', fontWeight: 'bold' }}>
                  {striker}
                </td>
                <td>{strikerruns}</td>
                <td>{strikerballs}</td>
                <td>{strikerfours}</td>
                <td>{strikersixes}</td>
                <td>{strikerballs ? ((strikerruns / strikerballs) * 100).toFixed(2) : '0.00'}</td>
              </tr>
              <tr>
                <td style={{ backgroundColor: !tag ? 'chartreuse' : 'transparent', fontWeight: 'bold' }}>
                  {nonstriker}</td>
                <td>{nonstrikerruns}</td>
                <td>{nonstrikerballs}</td>
                <td>{nonstrikerfours}</td>
                <td>{nonstrikersixes}</td>
                <td>{nonstrikerballs ? ((nonstrikerruns / nonstrikerballs) * 100).toFixed(2) : '0.00'}</td>
              </tr>
            </tbody>
          </table>

          <table className="table">
            <thead>
              <tr>
                <th>Bowler</th>
                <th>O</th>
                <th>M</th>
                <th>R</th>
                <th>W</th>
                <th>E</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{bowler}</td>
                <td>{bowlerovers}{'.'}{bowlerballs}</td>
                <td>{bowlerruns}</td>
                <td>{bowlerwickets}</td>
                <td>{(bowlerballs || bowlerovers) > 0 ? (bowlerruns / (bowlerovers + bowlerballs / 6)).toFixed(2) : '0.00'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='shadow-lg p-3 mb-3 rounded col-md-7' style={{ backgroundColor: 'chartreuse' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'chartreuse' }}>
            <h5 style={{ marginRight: '10px' }}>This Over:</h5>
            <div style={{ display: 'flex', gap: '10px', fontSize: '20px' }}>
              {thisover.map((b, idx) => (
                <span key={idx} className="badge bg-success">{b}</span>
              ))}
            </div>
          </div>

        </div>
        <div className='shadow-lg p-3 mb-3 rounded col-md-7' style={{ backgroundColor: 'rgb(182, 172, 171)' }}>
          <Stack direction="row" spacing={4}>
            {OPTIONS.map(opt => (
              <FormControlLabel
                key={opt.key}
                control={
                  <Checkbox
                    checked={selected.includes(opt.key)}
                    onChange={() => updateextraruns(opt.key)}
                  />
                }
                label={opt.label}
              />
            ))}
          </Stack> <br />
          <input type="button" className="btn btn-primary me-2" value="0" onClick={() => updatescore(0)} />
          <input type="button" className="btn btn-primary me-2" value="1" onClick={() => updatescore(1)} />
          <input type="button" className="btn btn-primary me-2" value="2" onClick={() => updatescore(2)} />
          <input type="button" className="btn btn-primary me-2" value="3" onClick={() => updatescore(3)} />
          <input type="button" className="btn btn-primary me-2" value="4" onClick={() => updatescore(4)} />
          <input type="button" className="btn btn-primary me-2" value="6" onClick={() => updatescore(6)} />
          <input type="button" className='btn btn-primary me-2' value="SwapBatsman" onClick={() => swapbatsman()} />
        </div>
      </div>
    </div>
  );
}
