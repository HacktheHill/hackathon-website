import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import './Sidebar.css';

export default props => {
  return (
    <div className='outer'>
    <Menu right width={'50%'}>
      
      <a className="menu-item" href="">
        About
      </a>
      <a className="menu-item" href="">
        Team
      </a>
      <a className="menu-item" href="">
        FAQ
      </a>
    </Menu>
    </div>

  );
};