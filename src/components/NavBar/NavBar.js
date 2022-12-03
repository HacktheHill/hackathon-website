import "./NavBar.css";
import { Link } from "react-scroll";
import MLH from "../../assets/Logos/mlhbadge.svg";

function Navbar({ pageScroll }) {
	return (
		<nav className="navbar" data-scrolled={pageScroll > 100}>
			<ul>
				<li className="logo">
					<Link
						className="link"
						activeClass="active"
						to="Hero"
						spy={true}
						smooth={true}
						offset={0}
						duration={500}
					>
						<img alt="Logo" src="Logos\hthlogo_icon_ver.svg"></img>
					</Link>
				</li>
				<li>
					<Link
						className="link"
						activeClass="active"
						to="About"
						spy={true}
						smooth={true}
						offset={-120}
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
						offset={-120}
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
						offset={-120}
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
						offset={-120}
						duration={500}
					>
						FAQ
					</Link>
				</li>
				<li className="mlh">
					<Link
						className="link"
						activeClass="active"
						to="https://mlh.io/seasons/2023/events"
						smooth={true}
						duration={1000}
					>
						<img alt="MLH" src={MLH}></img>
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;
