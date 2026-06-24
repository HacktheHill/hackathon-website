import { faFacebook, faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { Link } from "react-scroll";
import type { Dispatch, SetStateAction } from "react";
import { locale, t } from "@/i18n";
import { useState, useEffect } from "react";
import style from "./NavBar.module.css";

//animations
import AOS from "aos";
import "aos/dist/aos.css";

type NavbarProps = {
	pageScroll: number;
	sidebarOpen: boolean;
	setSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

const logo = "/Logos/hackthehill-logo.svg";

function Navbar({ pageScroll, sidebarOpen, setSidebarOpen }: Readonly<NavbarProps>) {
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

	// Same socials as the sidebar (see Sidebar.tsx) — shown in the bar on desktop,
	// and hidden under 940px where the hamburger + sidebar take over.
	const media = [
		{
			link: "https://www.facebook.com/canadascapitalhackathon",
			icon: faFacebook,
			label: "Facebook",
		},
		{
			link: "https://twitter.com/hackthehill_",
			icon: faTwitter,
			label: "Twitter",
		},
		{
			link: "https://www.instagram.com/hackthehill/",
			icon: faInstagram,
			label: "Instagram",
		},
		{
			link: "https://www.tiktok.com/@hackthehill",
			icon: faTiktok,
			label: "TikTok",
		},
		{
			link: "https://www.linkedin.com/company/hackthehill/",
			icon: faLinkedin,
			label: "LinkedIn",
		},
	];

	useEffect(() => {
		AOS.init({});
	}, []);

	return (
		<nav className={style["navbar"]} data-scrolled={pageScroll > 50} aria-label={t("navbar.aria_label")}>
			<Link
				className="link logo"
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
					onClick={() => window.open("https://2024.hackthehill.com", "_blank", "noopener,noreferrer")}
				>
					HtH II
				</button>
			</div>

			{/* TODO: Uncomment when website is done. */}
			{/* <ul>
				{links.map(link => (
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
			</ul> */}
			<ul className={style["media"]}>
				{media.map(link => (
					<li key={link.link}>
						<a href={link.link} target="_blank" rel="noreferrer" aria-label={link.label}>
							<Icon icon={link.icon} />
						</a>
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
