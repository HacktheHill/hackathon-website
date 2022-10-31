import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import './Sidebar.css';

export default props => {
  return (
    <div className='outer'>
    <Menu right width={'50%'}>
      
      <a className="menu-item" href='https://www.google.ca/'>
        About
      </a>
      <a className="menu-item" href='https://www.google.ca/'>
        Sponsors
      </a>
      <a className="menu-item" href='https://www.google.ca/'>
        Collaborators
      </a>
      <a className="menu-item" href='https://www.google.ca/'>
        FAQ
      </a>
    </Menu>
    </div>

  );
};