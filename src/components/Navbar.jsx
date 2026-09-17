import { NavLink } from 'react-router';
import Logout from './auth/Logout';

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Photoshare</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><NavLink to="/profiles">Users</NavLink></li>
          <li><Logout /></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;