import type { Dispatch, SetStateAction } from "react";
import { locale, t } from "@/i18n";
import { useState } from "react";
import style from "./NavBar.module.css";

type NavbarProps = {
	pageScroll: number;
	sidebarOpen: boolean;
	setSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

const logo = "/Logos/hackthehill-logo.svg";

function Navbar({ pageScroll, sidebarOpen, setSidebarOpen }: Readonly<NavbarProps>) {
	const [language, setLanguage] = useState<"en" | "fr">("en");

	const links = [
		{
			to: "about",
			text: t("landing2026.navigation.links.about"),
		},
		{
			to: "winners",
			text: t("landing2026.navigation.links.winners"),
		},
		{
			to: "sponsors",
			text: t("landing2026.navigation.links.sponsors"),
		},
		{
			to: "faq",
			text: t("landing2026.navigation.links.faq"),
		},
	];

	return (
		<nav
			className={style["navbar"]}
			data-scrolled={pageScroll > 50}
			aria-label={t("landing2026.navigation.ariaLabel")}
		>
			<div className={style["navbar-inner"]}>
				<a className={style["brand"]} href="#hero" aria-label="Hack the Hill">
					<img alt="" src={logo} />
				</a>

				<ul className={style["nav-links"]}>
					{links.map(link => (
						<li key={link.text}>
							<a className={style["link"]} href={`#${link.to}`}>
								{link.text}
							</a>
						</li>
					))}
				</ul>

				<div className={style["utilities"]}>
					<button
						className={style["utility-button"]}
						type="button"
						aria-label={t("landing2026.navigation.languageSwitch")}
						onClick={() => {
							const nextLanguage = language === "en" ? "fr" : "en";
							setLanguage(nextLanguage);
							locale.set(nextLanguage);
							document.documentElement.lang = nextLanguage;
						}}
					>
						{language === "en" ? "FR" : "EN"}
					</button>
					<a
						className={`${style["utility-button"]} ${style["archive-button"]}`}
						href="https://2024.hackthehill.com"
						target="_blank"
						rel="noreferrer"
						aria-label={t("landing2026.navigation.editionArchive")}
					>
						HtH II
					</a>
					<button
						id="mobile-menu-toggle"
						className={`${style["sidebar-icon"]} ${sidebarOpen ? style["sidebar-open"] : ""}`}
						type="button"
						onClick={() => setSidebarOpen(!sidebarOpen)}
						aria-label={
							sidebarOpen ? t("landing2026.navigation.menuClose") : t("landing2026.navigation.menuOpen")
						}
						aria-expanded={sidebarOpen}
						aria-controls="mobile-navigation"
					>
						<span></span>
						<span></span>
						<span></span>
					</button>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
