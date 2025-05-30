// ProfileLayout.jsx
import Profile from './Profile';
import { Outlet } from 'react-router-dom';

const ProfileLayout = () => {
  return (
    <div>
      <Profile />
      <Outlet />
    </div>
  );
};

export default ProfileLayout;
