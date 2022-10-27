import './NavBar.css';

function Navbar() {
  return (
    <div className="Navbar">
        <img alt='Logo' src="Logos\hthlogo_icon_ver.svg"></img>
        <div className='Items'>
          <div className='Item'><a>Team</a></div>
          <div className='Item'><a>FAQ</a></div>
          <div className='Item'><a>About</a></div> 
        </div>
        
    </div>
  );
}

export default Navbar;