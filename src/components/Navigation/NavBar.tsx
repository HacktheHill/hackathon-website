import { Link } from "react-scroll";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { locale, t } from "@/i18n";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import style from "./NavBar.module.css";

type NavbarProps = {
	pageScroll: number;
	sidebarOpen: boolean;
	setSidebarOpen: Dispatch<SetStateAction<boolean>>;
	menuButtonRef: RefObject<HTMLButtonElement>;
	scrollDuration: number;
};

const logo = "/Logos/hackthehill-logo.svg";

function Navbar({ pageScroll, sidebarOpen, setSidebarOpen, menuButtonRef, scrollDuration }: Readonly<NavbarProps>) {
	const currentLocale = useStore(locale);
	const languageCode = currentLocale === "en" ? "FR" : "EN";

	const links = [
		{
			to: "about",
			offset: -120,
			text: t("navbar.links.about"),
		},
		{
			to: "testimonials",
			offset: -120,
			text: t("navbar.links.testimonials"),
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
		document.documentElement.lang = currentLocale;
	}, [currentLocale]);

	return (
		<nav className={style["navbar"]} data-scrolled={pageScroll > 50} aria-label={t("navbar.aria_label")}>
			<Link
				className="link logo"
				activeClass="active"
				to="hero"
				spy={true}
				smooth={true}
				offset={0}
				duration={scrollDuration}
				href="#hero"
				aria-label={t("navbar.home_label")}
				data-navigation-home
			>
				<img alt="" src={logo}></img>
			</Link>

			<div className={style["left-side-buttons"]}>
				<button
					className={style["square-button"]}
					type="button"
					aria-label={`${languageCode}: ${t("navbar.language_switch")}`}
					onClick={() => {
						locale.set(currentLocale === "en" ? "fr" : "en");
					}}
				>
					{languageCode}
				</button>
				<a
					id="mlh-trust-badge"
					className={style["mlh-trust-badge"]}
					href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=gray"
					target="_blank"
					rel="noreferrer"
				>
					<img
						src="https://logged-assets.s3.amazonaws.com/trust-badge/2027/mlh-trust-badge-2027-red.svg"
						alt="Major League Hacking 2026 Hackathon Season"
					/>
				</a>
				<a
					className={style["square-button"]}
					href="https://2024.hackthehill.com"
					target="_blank"
					rel="noreferrer"
					aria-label={`HtH II: ${t("navbar.past_site_label")}`}
				>
					<span className={style["past-site-label"]}>HtH II</span>
					<span className={style["past-site-label-short"]} aria-hidden="true">
						II
					</span>
				</a>
			</div>

			<ul>
				{links.map(link => (
					<li key={link.text}>
						<Link
							className={style["link"]}
							activeClass={style["active"]}
							to={link.to}
							spy={true}
							smooth={true}
							offset={link.offset}
							duration={scrollDuration}
							href={`#${link.to}`}
						>
							{link.text}
						</Link>
					</li>
				))}
			</ul>
			<button
				ref={menuButtonRef}
				type="button"
				className={`${style["sidebar-icon"]} ${sidebarOpen ? style["sidebar-open"] : ""}`}
				onClick={() => setSidebarOpen(open => !open)}
				aria-label={t(sidebarOpen ? "navbar.menu_close" : "navbar.menu_open")}
				aria-controls="mobile-navigation"
				aria-expanded={sidebarOpen}
			>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
			</button>
		</nav>
	);
}

export default Navbar;
