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
       <div className="container-fluid">
  <div className="row bg-warning p-3 mb-3 align-items-center justify-content-between">
    
    <div className="col-6 col-md-auto">
      <h2 className="mb-0">Welcome</h2>
      <p className="mb-0" style={{ fontSize: '14px' }}>Email: {userDetails.email}</p>
    </div>

    <div className="col-12 col-md-auto text-center mt-3 mt-md-0">
      <h1 className="mb-0">Cric App</h1>
    </div>

    <div className="col-12 col-md-auto text-end mt-3 mt-md-0">
      <button className="btn btn-primary" onClick={logout}>
        Logout
      </button>
    </div>

  </div>
</div>

      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Home;
