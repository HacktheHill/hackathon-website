import type { Dispatch, RefObject, SetStateAction } from "react";
import { locale, t } from "@/i18n";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import style from "./NavBar.module.css";

type NavbarProps = {
	sidebarOpen: boolean;
	setSidebarOpen: Dispatch<SetStateAction<boolean>>;
	menuButtonRef: RefObject<HTMLButtonElement>;
	hidden: boolean;
	floating: boolean;
};

const logo = "/Logos/hackthehill-logo.svg";

function Navbar({ sidebarOpen, setSidebarOpen, menuButtonRef, hidden, floating }: Readonly<NavbarProps>) {
	const currentLocale = useStore(locale);
	const languageCode = currentLocale === "en" ? "FR" : "EN";
	const links = [
		{ href: "https://apply.hackthehill.com/", text: t("navbar.links.apply") },
		{ href: "#about", text: t("navbar.links.about") },
		{ href: "#testimonials", text: t("navbar.links.testimonials") },
		{ href: "#sponsors", text: t("navbar.links.sponsors") },
		{ href: "#collaborators", text: t("navbar.links.collaborators") },
		{ href: "#faq", text: t("navbar.links.faq") },
	];

	useEffect(() => {
		document.documentElement.lang = currentLocale;
	}, [currentLocale]);

	return (
		<nav className={style.navbar} data-hidden={hidden} data-floating={floating} aria-label={t("navbar.aria_label")}>
			<a className="link logo" href="#hero" aria-label={t("navbar.home_label")} data-navigation-home>
				<img alt="" src={logo} width="114" height="70"></img>
			</a>

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
					className={style["square-button"]}
					href="https://2024.hackthehill.com"
					target="_blank"
					rel="noreferrer"
					aria-label={`HtH II: ${t("navbar.past_site_label")}`}
				>
					HtH II
				</a>
			</div>

			<ul className={style["navigation-links"]}>
				{links.map(link => (
					<li key={link.href}>
						<a className={style["navigation-link"]} href={link.href}>
							{link.text}
						</a>
					</li>
				))}
			</ul>

			<a
				id="mlh-trust-badge"
				className={style["mlh-trust-badge"]}
				href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=gray"
				target="_blank"
				rel="noreferrer"
			>
				<img
					src="https://logged-assets.s3.amazonaws.com/trust-badge/2027/mlh-trust-badge-2027-red.svg"
					alt="Major League Hacking 2027 Hackathon Season"
					width="100"
					height="180"
				/>
			</a>

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
