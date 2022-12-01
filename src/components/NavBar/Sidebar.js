import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import './Sidebar.css';
import { Link } from 'react-scroll';
import 'boxicons';
import { useState } from 'react';

export default props => {
  const [isMenuOpen, handleMenu] = useState(false);
  const handleCloseMenu = () => {
    handleMenu(false);
  };
  const handleStateChange = (state) => {
    handleMenu(state.isOpen);
  };
  return (
    <div className='outer'>
    <Menu right width={'100%'} isOpen={isMenuOpen} onStateChange={handleStateChange}>
      <Link to="About" spy={true} smooth={true} offset={-30} duration={500} onClick={() => handleCloseMenu()}>About</Link> 
      <Link to="Sponsors" spy={true} smooth={true} offset={-30} duration={500} onClick={() => handleCloseMenu()}>Sponsors</Link>
      <Link to="Schedule" spy={true} smooth={true} offset={0} duration={500} onClick={() => handleCloseMenu()}>The Hacker Series</Link>
      <Link to="Collaborators" spy={true} smooth={true} offset={-30} duration={500} onClick={() => handleCloseMenu()}>Collaborators</Link>
      <Link to="FAQ" spy={true} smooth={true} offset={-30} duration={500} onClick={() => handleCloseMenu()}>FAQ</Link>
      <div className='row'>
        <a href="https://www.facebook.com/canadascapitalhackathon" target="_blank">
          <box-icon size='sm' color='white' animation='tada-hover' type="logo" name="facebook-square"/>
        </a>
        <a href="https://twitter.com/hackthehiII" target="_blank">
          <box-icon size='sm' color='white' animation='tada-hover' name="twitter" type="logo" />
        </a>
        <a href="https://www.instagram.com/hackthehill/" target="_blank">
          <box-icon size='sm' color='white' animation='tada-hover' name="instagram" type="logo" />
        </a>
        <a href="https://www.tiktok.com/@hackthehill" target="_blank">
          <box-icon size='sm' color='white' animation='tada-hover' name="tiktok" type="logo" />
        </a>
        <a href="https://www.linkedin.com/company/hackthehill/" target="_blank">
          <box-icon size='sm' color='white' animation='tada-hover' name='linkedin' type='logo' ></box-icon>
        </a>
        <a href="https://www.medium.com/@hackthehill" target="_blank">
          <box-icon size='sm' color='white' animation='tada-hover' name='medium' type='logo' ></box-icon>
        </a> 
      </div>   
    </Menu>
    </div>

  );
};
