import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { auth } from './components/firebase';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login';
import Profile from './components/Profile';
import Register from './components/Register';
import ProfileLayout from './components/PriofileLayout';

import Home from './CricApp/Home'
import BBL from './CricApp/BBL'
import Scorecard from './CricApp/Scorecard'
import NewBatsman from './CricApp/NewBatsman'
import NewBowler from './CricApp/NewBowler'
import Over from './CricApp/Over'
import History from './CricApp/History'
import NBB from './CricApp/NBB'
import { firebase } from './CricApp/firebase';
import LiveScore from './CricApp/LiveScore';


function App() {
  const [user, setuser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setuser(user)
    })
  })
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to='/Profile' /> : <Login />} />
          <Route path='/Register' element={<Register />}></Route>
          <Route path='/Profile' element={<Profile />}></Route>
          <Route element={<ProfileLayout />}>
            <Route path="/Home" element={<Home />} />
            <Route path="/BBL" element={<BBL />} />
            <Route path="/NBB" element={<NBB />} />
            <Route path="/Over" element={<Over />} />
            <Route path="/scorecard" element={<Scorecard />} />
            <Route path="/NewBowler" element={<NewBowler />} />
            <Route path="/NewBatsman" element={<NewBatsman />} />
            <Route path="/livescore/:matchId" element={<LiveScore />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
