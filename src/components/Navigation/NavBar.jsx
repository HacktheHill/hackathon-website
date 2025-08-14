import { Link } from "react-scroll";
import { locale, t } from "../../i18n";
import logo from "/Logos/hackthehill-logo.svg";
import { useState, useEffect } from "react";
import style from "./NavBar.module.css";

//animations
import AOS from "aos";
import "aos/dist/aos.css";

function Navbar({ pageScroll, sidebarOpen, setSidebarOpen }) {
	const [language, setLanguage] = useState(true);

	const links = [
		{
			to: "about",
			offset: -120,
			text: t("navbar.links.about"),
		},
		{
			to: "winners",
			offset: -120,
			text: t("navbar.links.winners"),
		},
		{
			to: "testimonials",
			offset: -120,
			text: t("navbar.links.testimonials"),
		},
		{
			to: "schedule",
			offset: -120,
			text: t("navbar.links.hacker"),
		},
		{
			to: "sponsors",
			offset: -120,
			text: t("navbar.links.sponsors"),
		},
		{
			to: "collaborators",
			offset: -150,
			text: t("navbar.links.collaborators"),
		},
		{
			to: "faq",
			offset: -275,
			text: t("navbar.links.faq"),
		},
	];

	useEffect(() => {
		AOS.init({});
	}, []);

	return (
		<nav className={style["navbar"]} data-scrolled={pageScroll > 50} aria-label={t("navbar.aria_label")}>
			<Link
				className={style["logo"]}
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

			<div className={style["left-side-buttons"]}>
				<button
					className={style["square-button"]}
					type="submit"
					onClick={() => {
						setLanguage(!language);
						locale.set(language ? "fr" : "en");
					}}
				>
					{language ? "FR" : "EN"}
				</button>
				<button
					className={style["square-button"]}
					type="submit"
					onClick={() => window.open("https://2024.hackthehill.com", "_blank")}
				>
					2024
				</button>
			</div>

			<ul>
				{links.map((link, index) => (
					<li key={link.text}>
						<Link
							className={style["link"]}
							activeClass={style["active"]}
							to={link.to}
							spy={true}
							smooth={true}
							offset={link.offset}
							duration={500}
							href={`#${link.to}`}
						>
							{link.text}
						</Link>
					</li>
				))}
			</ul>
			<button
				className={`${style["sidebar-icon"]} ${sidebarOpen ? style["sidebar-open"] : ""}`}
				onClick={() => setSidebarOpen(!sidebarOpen)}
				aria-label="Sidebar Icon"
			>
				<div></div>
				<div></div>
				<div></div>
			</button>
		</nav>
	);
}

export default Navbar;
