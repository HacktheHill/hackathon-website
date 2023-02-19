import { useEffect, useState } from "react";
import hero from "../../assets/hero.svg?raw";
import Button from "../Button/Button.jsx";
import { t } from "../../i18n";
import "./Hero.css";
import BannerLogo from "/Logos/hackthehill-banner.svg";
import LocationPin from "/SVGs/location-pin.svg";

const date = new Date("2023-03-03T00:00:00-05:00");

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
		<div className="hero" onPointerMove={popup} onTouchStart={popup}>
			<div className="hero-heading">
				<div className="location-date-heading">
					<h3>
						<img className="location-pin" src={LocationPin} alt={t("hero.alt_pin")} /> {t("hero.hybrid")}
						<strong> {t("hero.at")} uOttawa</strong>
					</h3>
					<h3>
						Mar &nbsp;
						<time dateTime="03/02/2023">3</time>&ndash;
						<time dateTime="05/02/2023">5</time>, <strong>2023</strong>
					</h3>
				</div>
				<h1 id="Hero">
					<img className="banner-logo" src={BannerLogo} alt="Hack the Hill"></img>
				</h1>
				<h2>{t("hero.h2")}</h2>
				<h3>
					{t("hero.h3")}&times;{t("hero.h3_p2")}
				</h3>
				<Button href="#about" offset={-160}>
					{t("hero.more")}
				</Button>
			</div>
			<div
				className="hero-img"
				dangerouslySetInnerHTML={{
					__html: hero,
				}}
			></div>
			<dialog className="countdown-dialog" open={popupOpen}>
				<div className="countdown-item">
					<h3>{days}</h3>
					<h4>day{days === 1 ? "" : "s"}</h4>
				</div>
				<div className="countdown-item">
					<h3>{hours}</h3>
					<h4>hour{hours === 1 ? "" : "s"}</h4>
				</div>
				<div className="countdown-item">
					<h3>{minutes}</h3>
					<h4>minute{minutes === 1 ? "" : "s"}</h4>
				</div>
				<div className="countdown-item">
					<h3>{seconds}</h3>
					<h4>second{seconds === 1 ? "" : "s"}</h4>
				</div>
			</dialog>
		</div>
	);
}

export default Hero;
