import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import './Sidebar.css';
import { Link } from 'react-scroll';

export default props => {
  return (
    <div className='outer'>
    <Menu right width={'50%'}>
      <Link to="About" spy={true} smooth={true} offset={-30} duration={500}>About</Link> 
      <Link to="Sponsors" spy={true} smooth={true} offset={-30} duration={500}>Sponsors</Link>
      <Link to="Schedule" spy={true} smooth={true} offset={0} duration={500}>Schedule</Link>
      <Link to="Collaborators" spy={true} smooth={true} offset={-30} duration={500}>Collaborators</Link>
      <Link to="FAQ" spy={true} smooth={true} offset={-30} duration={500}>FAQ</Link>
    </Menu>
    </div>

  );
};