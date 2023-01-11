import { useEffect, useState } from "react";
import hero from "../../assets/hero.svg?raw";
import "./Hero.css";
import BannerLogo from "/Logos/hackthehill-banner.svg";
import LocationPin from "/SVGs/location-pin.svg";

const date = new Date("2023-02-03T00:00:00-05:00");

function Hero() {
	const [popupOpen, setPopupOpen] = useState(false);
	const [time, setTime] = useState(Date.now());

	useEffect(() => {
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
		<div className="Hero" onPointerMove={popup} onTouchStart={popup}>
			<div className="HeroHeading">
				<div className="LocationDateHeading">
					<h3>
						<img className="LocationPin" src={LocationPin} alt="Location Pin" /> Hybrid
						<strong> @ uOttawa</strong>
					</h3>
					<h3>
						Mar &nbsp;
						<time dateTime="03/02/2023">3</time>&ndash;
						<time dateTime="05/02/2023">5</time>, <strong>2023</strong>
					</h3>
				</div>
				<h1 id="Hero">
					<img className="BannerLogo" src={BannerLogo} alt="Hack the Hill"></img>
				</h1>
				<h2>Canada's Capital Hackathon</h2>
				<h3>University of Ottawa &times; Carleton University</h3>
				<a className="HeroButton" target="_blank" href="/register" rel="noreferrer">
					<button>Register Now!</button>
				</a>
			</div>
			<div
				className="HeroImg"
				dangerouslySetInnerHTML={{
					__html: hero,
				}}
			></div>
			<dialog className="CountdownDialog" open={popupOpen}>
				<div className="CountdownItem">
					<h3>{days}</h3>
					<h4>day{days === 1 ? "" : "s"}</h4>
				</div>
				<div className="CountdownItem">
					<h3>{hours}</h3>
					<h4>hour{hours === 1 ? "" : "s"}</h4>
				</div>
				<div className="CountdownItem">
					<h3>{minutes}</h3>
					<h4>minute{minutes === 1 ? "" : "s"}</h4>
				</div>
				<div className="CountdownItem">
					<h3>{seconds}</h3>
					<h4>second{seconds === 1 ? "" : "s"}</h4>
				</div>
			</dialog>
		</div>
	);
}

export default Hero;
