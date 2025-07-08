import firebase from "./firebase";
import { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";

export default function Over() {

  const navigate = useNavigate();
  const { hostteam, visitteam } = useLocation().state || {};
  const firebaserealtimedb = firebase.database();
  const [fbruns, setfbruns] = useState(0);
  const [sbruns, setsbruns] = useState(0);

  const matchid = `${hostteam}vs${visitteam}`;
  
  useEffect(() => {
    // First innings runs
    firebaserealtimedb
      .ref(`${matchid}/Innings1/Totalteamruns`)
      .once("value")
      .then(snap => setfbruns(snap.val() ?? 0))
      .catch(console.error);

    // Second innings runs
    firebaserealtimedb
      .ref(`${matchid}/Innings2/Totalteamruns`)
      .once("value")
      .then(snap => setsbruns(snap.val() ?? 0))
      .catch(console.error);
  }, [firebaserealtimedb, matchid]);

  if (!hostteam || !visitteam) {
  // either redirect back or render a loading/error
  return navigate("/Home");
}
  let result;
  if (fbruns === sbruns) {
    result = "Match Drawn";
  } else if (fbruns > sbruns) {
    result = `${hostteam} is Winner`;
  } else {
    result = `${visitteam} is Winner`;
  }
  function scores()
  {
     navigate(`/livescoreCard/${matchid}`)
  }
  function GotoHome()
  {
    navigate('/Home')
  }

  return (
    <div id='teams' className='row justify-content-center '>
      <div className='shadow-lg p-3 mb-3 rounded col-md-7' style={{ backgroundColor: 'rgb(182, 172, 171)', marginTop: '120px',height:'250px' }}>
        <div className="text-center mt-5">
          <h2>{hostteam}{'   '}vs{'   '}{visitteam}</h2>
          <h2>{result}</h2>
         <input type="button" className="btn btn-primary" value="Scorecard" onClick={scores}/> <br />
         <input type="button" className="btn btn-primary" value='HomePage' onClick={GotoHome} />
    </div>
    </div>
    </div>

  );
}
