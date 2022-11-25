import './NavBar.css';
import { Link } from 'react-scroll';
import MLH from '../../assets/Logos/mlhbadge.svg';
function Navbar() {
  return (
    <div className="Navbar">
        <img className='logo' alt='Logo' src="Logos\hthlogo_icon_ver.svg"></img>
        <div className='Items'>
          <a target="_blank" href="https://mlh.io/seasons/2023/events"><img className='mlh' alt="MLH" src={MLH}></img></a>
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