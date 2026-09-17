import { useNavigate } from 'react-router';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return <a onClick={handleLogout}>Log Out</a>;
};

export default Logout;