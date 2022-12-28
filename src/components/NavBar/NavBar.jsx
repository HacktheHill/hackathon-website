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
				>
					<img alt="Logo" src={logo}></img>
				</Link>
				<ul>
					<li>
						<Link
							className="link"
							activeClass="active"
							to="About"
							spy={true}
							smooth={true}
							offset={-160}
							duration={500}
						>
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
						>
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
						>
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
							offset={-160}
							duration={500}
						>
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
							offset={-160}
							duration={500}
						>
							FAQ
						</Link>
					</li>
				</ul>
			</nav>
		</>
	);
}

export default Navbar;
