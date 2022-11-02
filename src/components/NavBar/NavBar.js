import './NavBar.css';
import { Link } from 'react-scroll';

function Navbar() {
  return (
    <div className="Navbar">
        <img alt='Logo' src="Logos\hthlogo_icon_ver.svg"></img>
        <div className='Items'>
          <div className='Item'><Link to="FAQ" spy={true} smooth={true} offset={-30} duration={500}>FAQ</Link></div>
          <div className='Item'><Link to="Collaborators" spy={true} smooth={true} offset={-30} duration={500}>Collaborators</Link></div>
          <div className='Item'><Link to="Schedule" spy={true} smooth={true} offset={0} duration={500}>Schedule</Link></div>
          <div className='Item'><Link to="Sponsors" spy={true} smooth={true} offset={-30} duration={500}>Sponsors</Link></div>
          <div className='Item'><Link to="About" spy={true} smooth={true} offset={-30} duration={500}>About</Link></div> 
        </div>
        
    </div>
  );
}

export default Navbar;