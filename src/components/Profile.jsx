import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserDetails(user);
      } else {
        // If no user is logged in, redirect to login
        navigate('/');
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [navigate]);

  const logout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      {userDetails ? (
        <div className="col-md-12 bg-warning d-flex p-3 mb-3 " style={{ gap: '250px' }}>
          <h2>Welcome</h2>
          <div>
            <p style={{ position: 'absolute', left: '20px', top: '50px' }}>Email: {userDetails.email}</p>
          </div>
          <h1>Cric App</h1>
          <button className="btn btn-primary" onClick={logout} style={{ marginLeft: '350px' }}>
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Home;
