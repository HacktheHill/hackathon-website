import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import hero from "../../assets/hero.svg?raw";
import { t } from "../../i18n";
import styles from "./Hero.module.css";
import "./animations.css";
import BannerLogo from "/Logos/hackthehill-banner.svg";
import LocationPin from "/SVGs/location-pin.svg";

//animations
import AOS from "aos";
import "aos/dist/aos.css";

const EVENT_START_DATE = new Date("2000-01-01T00:00:00-00:00");
const HACKING_END_DATE = new Date("2000-01-01T00:00:00-00:00");

// If the current time is before the event start date, the countdown will show the time until the event starts
// If the current time is between the event start date and the hacking end	 date, the countdown will show the time until the hacking ends
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
	const [email, setEmail] = useState("");

	useEffect(() => {
		AOS.init();
	}, []);

	useEffect(() => {
		setTime(Date.now());
		const interval = setInterval(() => setTime(Date.now()), 1000);
		setEmail();

		return () => clearInterval(interval);
	}, []);

	const days = Math.floor((date - time) / 1000 / 60 / 60 / 24);
	const hours = Math.floor((date - time) / 1000 / 60 / 60) % 24;
	const minutes = Math.floor((date - time) / 1000 / 60) % 60;
	const seconds = Math.floor((date - time) / 1000) % 60;

	const formattedHours = hours.toLocaleString("en-US", { minimumIntegerDigits: 2 });
	const formattedMinutes = minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 });
	const formattedSeconds = seconds.toLocaleString("en-US", { minimumIntegerDigits: 2 });

	const popup = event => {
		if (event.target.closest("#clock-tower")) {
			setPopupOpen(true);
		} else {
			setPopupOpen(false);
		}
	};

	// For parallax scrolling effect
	const [scrollY, setScrollY] = useState(0);
	const heroRef = useRef(null);

	// Detect if the user is scrolling and update the scrollY state variable accordingly
	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// API for the parallax scrolling effect
	useEffect(() => {
		// The selector is used to select all elements with the same class name
		// The x and y values for each element are multiplied by the scrollY value to create the parallax effect
		const transformations = [
			{ selector: "#Sun", x: 0, y: 3 },
			{ selector: "#Hill-1", x: -3, y: 0.2 },
			{ selector: "#Hill-2", x: 2, y: 1.6 },
			{ selector: "#Hill-3", x: 0, y: 1.6 },
			{ selector: "#Hill-4", x: 0.6, y: 1.6 },
		];

		// Select all elements with the same class name and apply the CSS transformation to each of them
		const applyTransformation = ({ selector, x, y }) => {
			const elements = heroRef.current.querySelectorAll(selector);
			elements.forEach(element => {
				const xValue = scrollY * x;
				const yValue = scrollY * y;
				element.style.transform = `translate(${xValue}px, ${yValue}px)`;
			});
		};

		transformations.forEach(transformation => applyTransformation(transformation));
	}, [scrollY]);

	return (
		<div id="hero" className={styles["hero"]} onPointerMove={popup} onTouchStart={popup}>
			{/* Heading with logo, form, and button */}
			<div className={styles["hero-heading"]}>
				<div className={styles["location-date-heading"]} data-aos="fade-up" data-aos-duration="800">
					<h5 className={styles["location"]}>
						<img className={styles["location-pin"]} src={LocationPin} alt={t("hero.pin_alt")} />{" "}
						{t("hero.format")}
						<strong> {t("hero.at")} uOttawa</strong>
					</h5>
				</div>
				<h1 id="Hero" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
					<img className={styles["banner-logo"]} src={BannerLogo} alt="Hack the Hill"></img>
				</h1>
				<h2 data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
					{t("hero.h2")}
				</h2>
				{/*
				<form
					className={styles["hero-form"]}
					action={"https://tracker.hackthehill.com/follow?email=" + { email }}
				>
					<input
						id="email"
						name="email"
						className={styles["hero-input"]}
						type="email"
						required
						placeholder={t("hero.email_placeholder")}
						onChange={event => setEmail(event.target.value)}
						data-aos="fade-up"
						data-aos-duration="1000"
						data-aos-delay="400"
					/>
					<button
						type="submit"
						className={styles["hero-btn"]}
						target={"_blank"}
						data-aos="fade-up"
						data-aos-duration="1000"
						data-aos-delay="500"
					>
						{t("hero.more")} <Icon icon={faArrowRight} className={styles["hero-btn-icon"]} />
					</button>
				</form>*/}
				<a href="https://tracker.hackthehill.com/follow" target="_blank" rel="noreferrer">
					<button
						className={styles["hero-btn"]}
						data-aos="fade-up"
						data-aos-duration="1000"
						data-aos-delay="500"
					>
						{t("hero.apply")} <Icon icon={faArrowRight} className={styles["hero-btn-icon"]} />
					</button>
				</a>
			</div>

			{/* Parallax, background, clouds, birds, trees, hills, buildings, etc. */}
			<div
				ref={heroRef}
				className={styles["hero-img"]}
				dangerouslySetInnerHTML={{
					__html: hero,
				}}
			></div>

			{/* Popup for countdown when hovering over clock tower */}
			{date && (
				<dialog className={styles["countdown-dialog"]} open={popupOpen}>
					<p className={styles["countdown-header"]}>
						{" "}
						<strong>psst... Mark your calendar, Hackathon is in</strong>
					</p>

					<div className={styles["countdown-items-container"]}>
						<div className={styles["countdown-item"]}>
							<h3>{days}</h3>
							<h4>day{days === 1 ? "" : "s"}</h4>
						</div>
						<div className={styles["countdown-item"]}>
							<h3>{hours}</h3>
							<h4>hour{hours === 1 ? "" : "s"}</h4>
						</div>
						<div className={styles["countdown-item"]}>
							<h3>{minutes}</h3>
							<h4>minute{minutes === 1 ? "" : "s"}</h4>
						</div>
						<div className={styles["countdown-item"]}>
							<h3>{seconds}</h3>
							<h4>second{seconds === 1 ? "" : "s"}</h4>
						</div>
					</div>
				</dialog>
			)}

			{date && (
				<dialog className={styles["countdown-dialog-small"]} open={popupOpen}>
					<p className={styles["countdown-header-small"]}>
						{" "}
						<strong>psst... Hackathon is in</strong>
					</p>

					<div className={styles["countdown-items-container-small"]}>
						<div className={styles["countdown-item"]}>
							<h3>{days}:</h3>
						</div>
						<div className={styles["countdown-item"]}>
							<h3>{formattedHours}:</h3>
						</div>
						<div className={styles["countdown-item"]}>
							<h3>{formattedMinutes}:</h3>
						</div>
						<div className={styles["countdown-item"]}>
							<h3>{formattedSeconds}</h3>
						</div>
					</div>
				</dialog>
			)}
		</div>
	);
}

export default Hero;
