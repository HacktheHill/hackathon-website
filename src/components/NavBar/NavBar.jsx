import { Link } from "react-scroll";
import "./NavBar.css";
import logo from "/Logos/hackthehill-logo.svg";

function Navbar({ pageScroll }) {
	return (
		<>
			<nav className="navbar" data-scrolled={pageScroll > 50} aria-label="Main Navigation">
				<Link
					className="link logo"
					activeClass="active"
					to="hero"
					spy={true}
					smooth={true}
					offset={0}
					duration={500}
					href="#hero">
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
							href="#about">
							About
						</Link>
					</li>
					<li>
						<Link
							className="link"
							activeClass="active"
							to="sponsors"
							spy={true}
							smooth={true}
							offset={-160}
							duration={500}
							href="#sponsors">
							Sponsors
						</Link>
					</li>
					<li>
						<Link
							className="link"
							activeClass="active"
							to="schedule"
							spy={true}
							smooth={true}
							offset={-80}
							duration={500}
							href="#schedule">
							The Hacker Series
						</Link>
					</li>
					<li>
						<Link
							className="link"
							activeClass="active"
							to="collaborators"
							spy={true}
							smooth={true}
							offset={-130}
							duration={500}
							href="#collaborators">
							Collaborators
						</Link>
					</li>
					<li>
						<Link
							className="link"
							activeClass="active"
							to="faq"
							spy={true}
							smooth={true}
							offset={-130}
							duration={500}
							href="#faq">
							FAQ
						</Link>
					</li>
				</ul>
			</nav>
		</>
	);
}

export default Navbar;
