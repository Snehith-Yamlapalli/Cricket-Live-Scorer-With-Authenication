import { React, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import firebase from './firebase';
import { auth } from '../components/firebase';

export default function Scorecard() {
  const userId = auth.currentUser.uid;
  const navigate = useNavigate();
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
  const [bowlermaiden, setbowlermaiden] = useState(0)
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
  useEffect(() => {
    if (innings === 2 && teamruns > targetruns + 1) {
      alert('Match Finished');
      navigate('/Over', { state: { hostteam, visitteam } });
    }
  }, [innings, teamruns, targetruns, hostteam, visitteam, navigate]);
  useEffect(() => {
    firebaserealtimedb
      .ref(`${matchid}/${'Innings1'}/Totalteamruns`)
      .once('value')
      .then(snap => {
        const runs = snap.val() ?? 0
        settargetruns(runs)
      })
      .catch(err => console.error(err))
    firebaserealtimedb.ref(`${matchid}/${Key}/batsmen/${striker}`)
      .once('value')
      .then(snap => {
        const d = snap.val()
        if (d) {
          setstrikerruns(d.runs ?? 0)
          setstrikerballs(d.balls ?? 0)
          setstrikerfours(d.fours ?? 0)
          setstrikersixes(d.sixes ?? 0)
        }
      })
    firebaserealtimedb.ref(`${matchid}/${Key}/batsmen/${nonstriker}`)
      .once('value')
      .then(snap => {
        const d = snap.val()
        if (d) {
          setnonstrikerruns(d.runs ?? 0)
          setnonstrikerballs(d.balls ?? 0)
          setnonstrikerfours(d.fours ?? 0)
          setnonstrikersixes(d.sixes ?? 0)
        }
      })
    firebaserealtimedb.ref(`${matchid}/${Key}/bowlers/${bowler}`)
      .once('value')
      .then(snap => {
        const d = snap.val()
        if (d) {
          setbowlerruns(d.runs ?? 0)
          setbowlerovers(d.overs ?? 0)
          setbowlerwickets(d.wickets ?? 0)
          setbowlermaiden(d.maidens ?? 0)
          setbowerballs(d.balls ?? 0)
        }
      })
    firebaserealtimedb.ref(`${matchid}/${Key}`)
      .once('value')
      .then(snap => {
        const d = snap.val()
        if (d) {
          setteamruns(d.Totalteamruns ?? 0)
          setteamwickets(d.Totalteamwickets ?? 0)
          setTeamovers(d.Totalteamovers ?? 0)
        }
      })
  },);

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

      const updates = {
        [`${Key}/Totalteamruns`]: teamruns + (val !== 'W' ? val : 0),
        [`${Key}/Totalteamwickets`]: teamwickets + (val === 'W' ? 1 : 0),
        [`${Key}/Totalteamovers`]: Teamovers + (newBowlerBalls === 6 ? 1 : 0),

        // ✅ New section for current striker & non-striker
        [`Current/`]: {
          innings:innings,
          striker: striker,
          nonstriker: nonstriker,
          bowler:bowler,
          teamname: innings===1?hostteam:visitteam
        },

        [`${Key}/Over/${bowler}/${bowlerovers}`]: updatedOver,

        [`${Key}/batsmen/${striker}`]: {
          runs: strikerruns + (tag ? (val !== 'W' ? val : 0) : 0),
          balls: strikerballs + (tag ? 1 : 0),
          fours: strikerfours + (tag && val === 4 ? 1 : 0),
          sixes: strikersixes + (tag && val === 6 ? 1 : 0)
        },

        [`${Key}/batsmen/${nonstriker}`]: {
          runs: nonstrikerruns + (!tag ? (val !== 'W' ? val : 0) : 0),
          balls: nonstrikerballs + (!tag ? 1 : 0),
          fours: nonstrikerfours + (!tag && val === 4 ? 1 : 0),
          sixes: nonstrikersixes + (!tag && val === 6 ? 1 : 0)
        },

        [`${Key}/bowlers/${bowler}`]: {
          runs: bowlerruns + (val !== 'W' ? val : 0),
          overs: bowlerovers + (newBowlerBalls === 6 ? 1 : 0),
          balls: newBowlerBalls === 6 ? 0 : newBowlerBalls,
          wickets: bowlerwickets,
          maidens: bowlermaiden
        }
      };

      firebaserealtimedb
        .ref(matchid)
        .update(updates)
        .catch(err => console.error(err))

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
    if (selected.includes('NB') || selected.includes('W')) runcount = true
    sethisover(prev => [...prev, `${runs}${[...selected].join('')}`]);
    const updates = {
      [`${Key}/Totalteamruns`]: teamruns + val,
      [`${Key}/Totalteamwickets`]: teamwickets + (selected.includes('W') ? 1 : 0),
      [`${Key}/Totalteamovers`]: Teamovers + (newBowlerBalls === 6 ? 1 : 0),
      [`${Key}/Over/${bowler}/${bowlerovers}`]: selected,
      [`${Key}/batsmen/${striker}`]: {
        runs: strikerruns + ((tag && runcount) ? runs : 0),
        balls: strikerballs + ((tag && (ballcount || selected.includes('NB'))) ? 1 : 0),
        fours: strikerfours + ((tag && runcount) && val === 4 ? 1 : 0),
        sixes: strikersixes + ((tag && runcount) && val === 6 ? 1 : 0)
      },
      [`${Key}/batsmen/${nonstriker}`]: {
        runs: nonstrikerruns + ((!tag && runcount) ? runs : 0),
        balls: nonstrikerballs + ((!tag && (ballcount || selected.includes('NB'))) ? 1 : 0),
        fours: nonstrikerfours + ((!tag && runcount) && val === 4 ? 1 : 0),
        sixes: nonstrikersixes + ((!tag && runcount) && val === 6 ? 1 : 0)
      },
      [`${Key}/bowlers/${bowler}`]: {
        runs: bowlerruns + ((ballcount === false || selected.includes('W')) ? val : 0),
        overs: bowlerovers + (newBowlerBalls === 6 ? 1 : 0),
        balls: (newBowlerBalls >= 6 ? 0 : newBowlerBalls),
        wickets: bowlerwickets + (selected.includes('W') ? 1 : 0),
        maidens: bowlermaiden
      }
    }
    firebaserealtimedb
      .ref(matchid)
      .update(updates)
      .catch(err => console.error(err))


    if (selected.includes('W') && newBowlerBalls !== 6) {
      const extraString = selected.join('');               // e.g. "Wd" or "NoBallByes"
      const entry = `${runs}${extraString}`;         // e.g. "4Wd" or "1NoBallByes"
      const newOver = [...thisover, entry];            // append to the over array
      sethisover(newOver);
      const updates =
        { [`${Key}/Over/${bowler}/${bowlerovers}`]: newOver }

      firebaserealtimedb
        .ref(matchid)
        .update(updates)
        .catch(err => console.error(err))
      navigate('/NewBatsman', {
        state: { innings, hostteam, visitteam, overs, striker, nonstriker, bowler, tag, bowlerballs, teamruns, thisover, selected, runs }
      })
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
      const updates =
        { [`${Key}/Over/${bowler}/${bowlerovers}`]: newOver }

      firebaserealtimedb
        .ref(matchid)
        .update(updates)
        .catch(err => console.error(err))

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
      <div className="row justify-content-center">

        <div className="col-12 col-lg-9 mb-3">
          <div className="p-3 shadow-lg rounded" style={{ backgroundColor: 'rgb(182, 172, 171)' }}>
            <div className="row align-items-center text-center text-md-start gy-2">

              <div className="col-6 col-md-4">
                <h3 className="mb-1" >
                  {innings === 1 ? hostteam : visitteam}
                </h3>
                <h5 className="mb-0" >
                  <strong>{teamruns}–{teamwickets}</strong> &nbsp;
                  ({Teamovers}.{bowlerballs})
                </h5>
              </div>

              {/* Innings / CRR or Target */}
              <div className="col-6 col-md-4">
                <h3 className="mb-1" >
                  Innings {innings}
                </h3>
                {innings === 1 ? (
                  <h5 className="mb-0" >
                    CRR:&nbsp;
                    {(() => {
                      const balls = Teamovers * 6 + bowlerballs;
                      return balls ? (teamruns / (balls / 6)).toFixed(2) : '0.00';
                    })()}
                  </h5>
                ) : (
                  <h5 className="mb-0" >
                    Target: {targetruns + 1}
                  </h5>
                )}
              </div>

              {/* Overs / Teams */}
              <div className="col-12 col-md-4 text-md-end">
                <h4 className="mb-1" >Overs: {overs}</h4>
                <h5>  {hostteam} vs {visitteam} </h5>
              </div>

            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7 mb-3">
          <div className="p-3 shadow-lg rounded" style={{ backgroundColor: '#fff', color: '#000' }}>

            <div className="table-responsive mb-3">
              <table className="table table-sm mb-0">
                <thead >
                  <tr>
                    <th>Batsman</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: striker, runs: strikerruns, balls: strikerballs, fours: strikerfours, sixes: strikersixes },
                    { name: nonstriker, runs: nonstrikerruns, balls: nonstrikerballs, fours: nonstrikerfours, sixes: nonstrikersixes }
                  ].map((p, idx) => (
                    <tr key={idx} className={idx === (tag ? 0 : 1) ? "table-success" : ""}>
                      <td ><h5>{p.name}</h5></td>
                      <td >{p.runs}</td>
                      <td >{p.balls}</td>
                      <td >{p.fours}</td>
                      <td >{p.sixes}</td>
                      <td >
                        {p.balls ? ((p.runs / p.balls) * 100).toFixed(2) : '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-responsive">
              <table className="table table-sm mb-0">
                <thead >
                  <tr>
                    <th>Bowler</th><th>O</th><th>M</th><th>R</th><th>W</th><th>E</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td > <h5> {bowler}</h5></td>
                    <td >{bowlerovers}.{bowlerballs}</td>
                    <td >{bowlermaiden}</td>
                    <td >{bowlerruns}</td>
                    <td >{bowlerwickets}</td>
                    <td >
                      {(bowlerovers * 6 + bowlerballs)
                        ? (bowlerruns / (bowlerovers + bowlerballs / 6)).toFixed(2)
                        : '0.00'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>

        <div className="col-12 col-lg-7 mb-3">
          <div className="p-3 shadow-lg rounded mb-3" style={{ backgroundColor: 'chartreuse', color: '#000' }}>
            <h3 className="mb-2">This Over:</h3>
            <div className="d-flex flex-wrap gap-2">
              {thisover.map((b, i) => (
                <span key={i} className="badge bg-light text-dark"> <h6>{b} </h6></span>
              ))}
            </div>
          </div>


          <div className="p-3 shadow-lg rounded gap-3" style={{ backgroundColor: 'rgb(182, 172, 171)' }}>
            <div className="d-flex flex-wrap gap-3 mb-3 ps-5">
              {OPTIONS.map(opt => (
                <div key={opt.key} className="form-check">
                  <input type="checkbox" id={opt.key} className="form-check-input" checked={selected.includes(opt.key)}
                    onChange={() => updateextraruns(opt.key)} style={{fontSize:'20px'}}
                  />
                  <label htmlFor={opt.key} className="form-check-label" style={{fontSize:'17px'}}>{opt.label}</label>
                </div>
              ))}
            </div>

            {/* Score Buttons */}
            <div className="d-flex flex-wrap gap-3 ps-5">
              {[0, 1, 2, 3, 4, 6].map(val => (
                <button key={val} className="btn btn-primary" onClick={() => updatescore(val)}>{val}</button>
              ))}
              <button className="btn btn-warning" onClick={swapbatsman}>Swap Batsman </button>
            </div>
          </div>
        </div>

      </div>
    </div>

  );
}
