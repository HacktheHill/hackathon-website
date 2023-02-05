import { Link } from "react-scroll";
import "./NavBar.css";
import logo from "/Logos/hackthehill-logo.svg";

function Navbar({ pageScroll }) {
	return (
		<>
			<nav className="navbar" data-scrolled={pageScroll > 50}>
				<Link
					className="link logo"
					activeClass="active"
					to="Hero"
					spy={true}
					smooth={true}
					offset={0}
					duration={500}
					href="#Hero">
					<img alt="Logo" src={logo}></img>
				</Link>
				<ul>
					<li>
						<Link
							className="link"
							activeClass="active"
							to="about"
							spy={true}
							smooth={true}
							offset={-160}
							duration={500}
							href="#About">
							About
						</Link>
					</li>
					<li>
						<Link
							className="link"
							activeClass="active"
							to="Sponsors"
							spy={true}
							smooth={true}
							offset={-160}
							duration={500}
							href="#Sponsors">
							Sponsors
						</Link>
					</li>
					<li>
						<Link
							className="link"
							activeClass="active"
							to="Schedule"
							spy={true}
							smooth={true}
							offset={-80}
							duration={500}
							href="#Schedule">
							The Hacker Series
						</Link>
					</li>
					<li>
						<Link
							className="link"
							activeClass="active"
							to="Collaborators"
							spy={true}
							smooth={true}
							offset={-130}
							duration={500}
							href="#Collaborators">
							Collaborators
						</Link>
					</li>
					<li>
						<Link
							className="link"
							activeClass="active"
							to="FAQ"
							spy={true}
							smooth={true}
							offset={-130}
							duration={500}
							href="#FAQ">
							FAQ
						</Link>
					</li>
				</ul>
			</nav>
		</>
	);
}

export default Navbar;
