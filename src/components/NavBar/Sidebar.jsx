import { faFacebook, faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useState } from "react";
import reactBurgerMenu from "react-burger-menu";
import { Link } from "react-scroll";
import "./Sidebar.module.css";
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
		<div className="sidebar">
			<Menu right width={"100%"} isOpen={menuOpen} onStateChange={handleStateChange}>
				<Link
					to="about"
					spy={true}
					smooth={true}
					offset={-30}
					duration={500}
					onClick={handleCloseMenu}
					href="#about"
				>
					{t("navbar.links.about")}
				</Link>
				<Link
					to="sponsors"
					spy={true}
					smooth={true}
					offset={-30}
					duration={500}
					onClick={handleCloseMenu}
					href="#sponsors"
				>
					{t("navbar.links.sponsors")}
				</Link>
				<Link
					to="schedule"
					spy={true}
					smooth={true}
					offset={0}
					duration={500}
					onClick={handleCloseMenu}
					href="#schedule"
				>
					{t("navbar.links.hacker")}
				</Link>
				<Link
					to="collaborators"
					spy={true}
					smooth={true}
					offset={-30}
					duration={500}
					onClick={handleCloseMenu}
					href="#collaborators"
				>
					{t("navbar.links.collaborators")}
				</Link>
				<Link
					to="faq"
					spy={true}
					smooth={true}
					offset={-30}
					duration={500}
					onClick={handleCloseMenu}
					href="#faq"
				>
					{t("navbar.links.faq")}
				</Link>
				<div className="media-links">
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
