import { faFacebook, faInstagram, faLinkedin, faMedium, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import React, { useState, useCallback } from "react";
import reactBurgerMenu from "react-burger-menu";
import { Link } from "react-scroll";
import "./Sidebar.css";
const { slide: Menu } = reactBurgerMenu;

export default function Sidebar() {
	const [menuOpen, setMenuOpen] = useState(false);

	const handleCloseMenu = useCallback(() => {
		setMenuOpen(false);
	}, []);

	const handleStateChange = useCallback(state => {
		setMenuOpen(state.isOpen);
	}, []);

	return (
		<div className="Sidebar">
			<Menu right width={"100%"} isOpen={menuOpen} onStateChange={handleStateChange}>
				<Link
					to="About"
					spy={true}
					smooth={true}
					offset={-30}
					duration={500}
					onClick={handleCloseMenu}
					href="#About"
				>
					About
				</Link>
				<Link
					to="Sponsors"
					spy={true}
					smooth={true}
					offset={-30}
					duration={500}
					onClick={handleCloseMenu}
					href="#Sponsors"
				>
					Sponsors
				</Link>
				<Link
					to="Schedule"
					spy={true}
					smooth={true}
					offset={0}
					duration={500}
					onClick={handleCloseMenu}
					href="#Schedule"
				>
					The Hacker Series
				</Link>
				<Link
					to="Collaborators"
					spy={true}
					smooth={true}
					offset={-30}
					duration={500}
					onClick={handleCloseMenu}
					href="#Collaborators"
				>
					Collaborators
				</Link>
				<Link
					to="FAQ"
					spy={true}
					smooth={true}
					offset={-30}
					duration={500}
					onClick={handleCloseMenu}
					href="#FAQ"
				>
					FAQ
				</Link>
				<div className="MediaLinks">
					<a
						href="https://www.facebook.com/canadascapitalhackathon"
						target="_blank"
						rel="noreferrer"
						aria-label="Facebook"
					>
						<Icon icon={faFacebook} />
					</a>
					<a href="https://twitter.com/hackthehill_" target="_blank" rel="noreferrer" aria-label="Twitter">
						<Icon icon={faTwitter} />
					</a>
					<a
						href="https://www.instagram.com/hackthehill/"
						target="_blank"
						rel="noreferrer"
						aria-label="Instagram"
					>
						<Icon icon={faInstagram} />
					</a>
					<a href="https://www.tiktok.com/@hackthehill" target="_blank" rel="noreferrer" aria-label="TikTok">
						<Icon icon={faTiktok} />
					</a>
					<a
						href="https://www.linkedin.com/company/hackthehill/"
						target="_blank"
						rel="noreferrer"
						aria-label="LinkedIn"
					>
						<Icon icon={faLinkedin} />
					</a>
				</div>
			</Menu>
		</div>
	);
}
