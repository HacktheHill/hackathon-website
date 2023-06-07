import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { t, locale } from "../../i18n";
import logo from "/Logos/hackthehill-logo.svg";
import { useStore } from "@nanostores/react";
import styles from "./NavBar.module.css";
function Navbar({ pageScroll }) {
	const languages = {
		en: "EN",
		fr: "FR",
	};

	return (
		<>
			<nav className={styles.navbar} data-scrolled={pageScroll > 50} aria-label={t("navbar.aria_label")}>
				<Link
					className={`${styles.link} ${styles.logo}`}
					activeClass="active"
					to="hero"
					spy={true}
					smooth={true}
					offset={0}
					duration={500}
					href="#hero"
				>
					<img alt="Logo" src={logo}></img>
				</Link>
				<ul className={styles["language-selector"]}>
					{Object.keys(languages).map(language => (
						<li key={language}>
							<button
								className={`${styles.link} ${styles["language-button"]}`}
								style={{ fontWeight: locale.get() === language ? "bold" : "normal" }}
								type="submit"
								onClick={() => locale.set(language)}
							>
								{languages[language]}
							</button>
						</li>
					))}
				</ul>
				<ul>
					<li>
						<Link
							className={styles.link}
							activeClass="active"
							to="about"
							spy={true}
							smooth={true}
							offset={-160}
							duration={500}
							href="#about"
						>
							{t("navbar.links.about")}
						</Link>
					</li>
					<li>
						<Link
							className={styles.link}
							activeClass="active"
							to="sponsors"
							spy={true}
							smooth={true}
							offset={-120}
							duration={500}
							href="#sponsors"
						>
							{t("navbar.links.sponsors")}
						</Link>
					</li>
					<li>
						<Link
							className={styles.link}
							activeClass="active"
							to="schedule"
							spy={true}
							smooth={true}
							offset={-80}
							duration={500}
							href="#schedule"
						>
							{t("navbar.links.hacker")}
						</Link>
					</li>
					<li>
						<Link
							className={styles.link}
							activeClass="active"
							to="collaborators"
							spy={true}
							smooth={true}
							offset={-130}
							duration={500}
							href="#collaborators"
						>
							{t("navbar.links.collaborators")}
						</Link>
					</li>
					<li>
						<Link
							className={styles.link}
							activeClass="active"
							to="faq"
							spy={true}
							smooth={true}
							offset={-130}
							duration={500}
							href="#faq"
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
