import { Link } from "react-scroll";
import { locale, t } from "../../i18n";
import React, { useState, useEffect } from "react";
import logo from "/src/assets/Logos/HTH/Hth_red_glow.svg";
import style from "./Navigation.module.css";

export default function Navigation() {
	const [language, setLanguage] = useState(true);

	return (
		<nav className={style["navbar"]} aria-label={t("navbar.aria_label")}>
			<div className={style["left-side-buttons"]}>
				<a href="/" className={style["square-button"]}>
					<img {...logo} alt="Logo" width="50px" />
				</a>
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
				<a href="events" className={style["square-button"]}>
					{t("navbar.links.events")}
				</a>
				<a href="blog" className={style["square-button"]}>
					{t("navbar.links.blog")}
				</a>
				<a href="team" className={style["square-button"]}>
					{t("navbar.links.team")}
				</a>
			</div>
			<button className={`${style["sidebar-icon"]}`} aria-label="Sidebar Icon">
				<div></div>
				<div></div>
				<div></div>
			</button>
		</nav>
	);
}
