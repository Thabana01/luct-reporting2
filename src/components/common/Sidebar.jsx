import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMenuItems } from '../../utils/roleBasedAccess';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const menuItems = getMenuItems(user?.role);

  return (
    <div className="col-md-3 col-lg-2 bg-light sidebar">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.icon && <i className={`me-2 ${item.icon}`}></i>}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;