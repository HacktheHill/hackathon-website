import './NavBar.css';

function Navbar() {
  return (
    <div className="Navbar">
        <img alt='Logo' src="Logos\hthlogo_icon_ver.svg"></img>
        <div className='Items'>
          <div className='Item'><a href='https://www.google.ca/'>Collaborators</a></div>
          <div className='Item'><a href='https://www.google.ca/'>FAQ</a></div>
          <div className='Item'><a href='https://www.google.ca/'>Sponsors</a></div>
          <div className='Item'><a href='https://www.google.ca/'>About</a></div> 
        </div>
        
    </div>
  );
}

export default Navbar;