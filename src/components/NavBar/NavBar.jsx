import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { t, locale } from "../../i18n";
import "./NavBar.css";
import logo from "/Logos/hackthehill-logo.svg";
import { useStore } from "@nanostores/react";

function Navbar({ pageScroll }) {
	const languages = {
		en: "EN",
		fr: "FR",
	};

	return (
		<>
			<nav className="navbar" data-scrolled={pageScroll > 50} aria-label={t("navbar.aria_label")}>
				<div className="navbar-leftside">
					<Link
						className="link logo"
						activeClass="active"
						to="Hero"
						spy={true}
						smooth={true}
						offset={0}
						duration={500}
						href="#Hero"
					>
						<img alt="Logo" src={logo}></img>
					</Link>
					<ul>
						<li className="excluded">
							<div className="language-selector">
								{Object.keys(languages).map(language => (
									<button
										className="link language-button"
										key={language}
										style={{ fontWeight: locale.get() === language ? "bold" : "normal" }}
										type="submit"
										onClick={() => locale.set(language)}
									>
										{languages[language]}
									</button>
								))}
								<p>&nbsp;</p>
							</div>
						</li>
					</ul>
				</div>
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
							href="#About"
						>
							{t("navbar.links.about")}
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
							href="#Sponsors"
						>
							{t("navbar.links.sponsors")}
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
							href="#Schedule"
						>
							{t("navbar.links.hacker")}
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
							href="#Collaborators"
						>
							{t("navbar.links.collaborators")}
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
							href="#FAQ"
						>
							{t("navbar.links.faq")}
						</Link>
					</li>
				</ul>
			</nav>
		</>
	);
}

export default Navbar;
