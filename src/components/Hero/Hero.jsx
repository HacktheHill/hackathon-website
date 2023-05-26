import { useEffect, useState } from "react";
import hero from "../../assets/hero.svg?raw";
import { t } from "../../i18n";
import Button from "../Button/Button.jsx";
import { t } from "../../i18n";
import styles from "./Hero.module.css";
import BannerLogo from "/Logos/hackthehill-banner.svg";
import LocationPin from "/SVGs/location-pin.svg";

// 7:00 PM EST on March 3rd, 2023
const EVENT_START_DATE = new Date("2023-03-03T19:00:00-05:00");
// 9:00 AM EST on March 5th, 2023
const HACKING_END_DATE = new Date("2023-03-05T09:00:00-05:00");

// If the current time is before the event start date, the countdown will show the time until the event starts
// If the current time is between the event start date and the hacking end date, the countdown will show the time until the hacking ends
// If the current time is after the hacking end date, the countdown will not show
let date = null;
switch (true) {
	case Date.now() < EVENT_START_DATE:
		date = EVENT_START_DATE;
		break;
	case Date.now() < HACKING_END_DATE:
		date = HACKING_END_DATE;
		break;
}

function Hero() {
	const [popupOpen, setPopupOpen] = useState(false);
	const [time, setTime] = useState(0);

	useEffect(() => {
		setTime(Date.now());
		const interval = setInterval(() => setTime(Date.now()), 1000);
		return () => clearInterval(interval);
	}, []);

	const days = Math.floor((date - time) / 1000 / 60 / 60 / 24);
	const hours = Math.floor((date - time) / 1000 / 60 / 60) % 24;
	const minutes = Math.floor((date - time) / 1000 / 60) % 60;
	const seconds = Math.floor((date - time) / 1000) % 60;

	const popup = event => {
		if (event.target.closest("#clock-tower")) {
			setPopupOpen(true);
		} else {
			setPopupOpen(false);
		}
	};

	return (
		<div className={styles.hero} onPointerMove={popup} onTouchStart={popup}>
			<div className={styles.heroHeading}>
				<div className={styles.locationDateHeading}>
					<h3 className={styles.location}>
						<img className={styles.locationPin} src={LocationPin} alt={t("hero.pin_alt")} />{" "}
						{t("hero.hybrid")}
						<strong> {t("hero.at")} uOttawa</strong>
					</h3>
					<h3>
						Mar &nbsp;
						<time dateTime="03/02/2023">3</time>&ndash;
						<time dateTime="05/02/2023">5</time>, <strong>2023</strong>
					</h3>
				</div>
				<h1 id="Hero">
					<img className={styles.bannerLogo} src={BannerLogo} alt="Hack the Hill"></img>
				</h1>
				<h2>{t("hero.h2")}</h2>
				<h3>{t("hero.h3")}</h3>
				<Button href={t("hero.link")} target={"_blank"} offset={-160}>
					{t("hero.more")}
				</Button>
			</div>
			<div
				className={styles.heroImge}
				dangerouslySetInnerHTML={{
					__html: hero,
				}}
			></div>
			{date && (
				<dialog className={styles.countdownDialog} open={popupOpen}>
					<div className={styles.countdownItem}>
						<h3>{days}</h3>
						<h4>day{days === 1 ? "" : "s"}</h4>
					</div>
					<div className={styles.countdownItem}>
						<h3>{hours}</h3>
						<h4>hour{hours === 1 ? "" : "s"}</h4>
					</div>
					<div className={styles.countdownItem}>
						<h3>{minutes}</h3>
						<h4>minute{minutes === 1 ? "" : "s"}</h4>
					</div>
					<div className={styles.countdownItem}>
						<h3>{seconds}</h3>
						<h4>second{seconds === 1 ? "" : "s"}</h4>
					</div>
				</dialog>
			)}
		</div>
	);
}

export default Hero;
