import { locale, t } from "@/i18n";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import style from "./NavBar.module.css";

const logo = "/Logos/hackthehill-logo.svg";

function Navbar() {
	const currentLocale = useStore(locale);
	const languageCode = currentLocale === "en" ? "FR" : "EN";

	useEffect(() => {
		document.documentElement.lang = currentLocale;
	}, [currentLocale]);

	return (
		<nav className={style.navbar} aria-label={t("navbar.aria_label")}>
			<a
				className="link logo"
				href="#hero"
				aria-label={t("navbar.home_label")}
				data-navigation-home
			>
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
					id="mlh-trust-badge"
					className={style["mlh-trust-badge"]}
					href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=gray"
					target="_blank"
					rel="noreferrer"
				>
					<img
						src="https://logged-assets.s3.amazonaws.com/trust-badge/2027/mlh-trust-badge-2027-red.svg"
						alt="Major League Hacking 2026 Hackathon Season"
						width="100"
						height="180"
					/>
				</a>
			</div>
		</nav>
	);
}

export default Navbar;
