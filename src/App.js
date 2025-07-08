import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { auth } from './components/firebase';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import Register from './components/Register';
import ProfileLayout from './components/PriofileLayout';

import Home from './CricApp/Home';
import BBL from './CricApp/BBL';
import Scorecard from './CricApp/Scorecard';
import NewBatsman from './CricApp/NewBatsman';
import NewBowler from './CricApp/NewBowler';
import Over from './CricApp/Over';
import NBB from './CricApp/NBB';
import LiveScore from './CricApp/LiveScore';
import LiveScoreCard from './CricApp/LiveScoreCard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Track Firebase auth loading

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  if (loading) return <p>Loading...</p>; // Optional: replace with spinner

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/Home" /> : <Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Profile" element={user ? <Profile /> : <Navigate to="/" />} />
          {user && (
            <Route element={<ProfileLayout />}>
              <Route path="/Home" element={<Home />} />
              <Route path="/BBL" element={<BBL />} />
              <Route path="/NBB" element={<NBB />} />
              <Route path="/Over" element={<Over />} />
              <Route path="/scorecard" element={<Scorecard />} />
              <Route path="/NewBowler" element={<NewBowler />} />
              <Route path="/NewBatsman" element={<NewBatsman />} />
              <Route path="/livescore/:matchId" element={<LiveScore />} />
              <Route path="/livescoreCard/:matchId" element={<LiveScoreCard />} />
            </Route>
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
