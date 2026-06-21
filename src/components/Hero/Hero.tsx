import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import type { PointerEvent, TouchEvent } from "react";
import { t } from "@/i18n";
import styles from "./Hero.module.css";
import "./animations.css";
import BannerLogo from "@/assets/Logos/hackthehill-banner.svg?url";
import LocationPin from "@/assets/SVGs/location-pin.svg?url";

//animations
import AOS from "aos";
import "aos/dist/aos.css";

const EVENT_START_DATE = new Date("2026-09-25T13:00:00-00:00").getTime();
const HACKING_END_DATE = new Date("2026-09-27T15:00:00-00:00").getTime();

// If the current time is before the event start date, the countdown will show the time until the event starts
// If the current time is between the event start date and the hacking end	 date, the countdown will show the time until the hacking ends
// If the current time is after the hacking end date, the countdown will not show
let date: number | null = null;
switch (true) {
	case Date.now() < EVENT_START_DATE:
		date = EVENT_START_DATE;
		break;
	case Date.now() < HACKING_END_DATE:
		date = HACKING_END_DATE;
		break;
}

// foreground.webp is 1920×1070, painted with `background-size: cover;
// background-position: center top`. The Peace Tower clock sits at this centre
// (in the asset's own pixels) and spans roughly this box. We map it through the
// same cover transform the browser uses so the hotspot tracks the clock on every
// viewport — a fixed left/top can't, because `cover` crops differently per shape.
const FOREGROUND_W = 1920;
const FOREGROUND_H = 1070;
const CLOCK_HOTSPOT = { cx: 690, cy: 290, w: 170, h: 170 };

// `parallax` is the scroll depth of each cloud: negative = nearer (rises faster
// than the scroll), positive = farther (lags behind it). Roughly ordered by the
// cloud's apparent size/closeness.
const clouds = [
	{ cls: styles["cloud-1"], parallax: -0.45 },
	{ cls: styles["cloud-2"], parallax: 0.3 },
	{ cls: styles["cloud-3"], parallax: 0.2 },
	{ cls: styles["cloud-4"], parallax: -0.05 },
	{ cls: styles["cloud-5"], parallax: 0.08 },
	{ cls: styles["cloud-6"], parallax: -0.25 },
];

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
		setEmail("");

		return () => clearInterval(interval);
	}, []);

	const remainingTime = date === null ? 0 : date - time;
	const days = Math.floor(remainingTime / 1000 / 60 / 60 / 24);
	const hours = Math.floor(remainingTime / 1000 / 60 / 60) % 24;
	const minutes = Math.floor(remainingTime / 1000 / 60) % 60;
	const seconds = Math.floor(remainingTime / 1000) % 60;

	const formattedHours = hours.toLocaleString("en-US", { minimumIntegerDigits: 2 });
	const formattedMinutes = minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 });
	const formattedSeconds = seconds.toLocaleString("en-US", { minimumIntegerDigits: 2 });

	const popup = (event: PointerEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
		const target = event.target;

		if (target instanceof Element && target.closest("#clock-tower")) {
			setPopupOpen(true);
		} else {
			setPopupOpen(false);
		}
	};

	// For parallax scrolling effect
	const heroRef = useRef<HTMLDivElement>(null);

	// Keep the invisible countdown hotspot pinned to the painted clock. Because
	// the foreground uses `background-size: cover`, the clock slides around as the
	// viewport changes shape, so we recompute the hotspot from the cover geometry
	// whenever the foreground box resizes (vh changes, mobile URL bar, rotation).
	const foregroundRef = useRef<HTMLDivElement>(null);
	const hotspotRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const fg = foregroundRef.current;
		const hotspot = hotspotRef.current;
		if (!fg || !hotspot) return;

		const place = () => {
			const cw = fg.clientWidth;
			const ch = fg.clientHeight;
			if (!cw || !ch) return;

			// Replicate `background-size: cover; background-position: center top`.
			const scale = Math.max(cw / FOREGROUND_W, ch / FOREGROUND_H);
			const offsetX = (cw - FOREGROUND_W * scale) / 2; // centred horizontally
			const offsetY = 0; // top-aligned

			hotspot.style.left = `${offsetX + CLOCK_HOTSPOT.cx * scale}px`;
			hotspot.style.top = `${offsetY + CLOCK_HOTSPOT.cy * scale}px`;
			hotspot.style.width = `${CLOCK_HOTSPOT.w * scale}px`;
			hotspot.style.height = `${CLOCK_HOTSPOT.h * scale}px`;
		};

		place();
		const observer = new ResizeObserver(place);
		observer.observe(fg);
		return () => observer.disconnect();
	}, []);

	// Detect if the user is scrolling and apply layered parallax transforms.
	// Each layer moves at a different rate to create a sense of depth.
	useEffect(() => {
		const heroEl = heroRef.current;
		if (!heroEl) return;

		const layers: { selector: string; speed: number; fade?: boolean }[] = [
			{ selector: `.${styles["hero-bg"]}`, speed: 0.25 },
			{ selector: `.${styles["hero-heading"]}`, speed: 0.5, fade: true },
		];

		// Skip all parallax work + pause the cloud drift while the hero is off-screen
		// so scrolling the rest of the page stays cheap.
		let visible = true;
		const observer = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				heroEl.classList.toggle("hero-offscreen", !visible);
			},
			{ threshold: 0 }
		);
		observer.observe(heroEl);

		let frame = 0;
		const update = () => {
			frame = 0;
			if (!visible) return;
			const scrollY = window.scrollY;
			if (!heroRef.current) return;

			layers.forEach(({ selector, speed, fade }) => {
				const element = heroRef.current?.querySelector<HTMLElement>(selector);
				if (!element) return;
				element.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
				if (fade) {
					element.style.opacity = `${Math.max(0, 1 - scrollY / 500)}`;
				}
			});

			// Each cloud gets its own depth so the nearer ones move noticeably faster.
			const cloudEls = heroRef.current.querySelectorAll<HTMLElement>(".hero-cloud");
			cloudEls.forEach((el, i) => {
				el.style.transform = `translate3d(0, ${scrollY * (clouds[i]?.parallax ?? 0)}px, 0)`;
			});
		};

		const handleScroll = () => {
			if (frame) return;
			frame = window.requestAnimationFrame(update);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
			observer.disconnect();
			if (frame) window.cancelAnimationFrame(frame);
		};
	}, []);

	return (
		<div id="hero" ref={heroRef} className={styles["hero"]} onPointerMove={popup} onTouchStart={popup}>
			{/* Sky + distant hills */}
			<div className={styles["hero-bg"]}></div>

			{/* Drifting watercolour clouds */}
			<div className={styles["hero-clouds"]}>
				{clouds.map((cloud, i) => (
					<div
						key={cloud.cls}
						className={`${styles["cloud"]} ${cloud.cls} hero-cloud hero-cloud-${i + 1}`}
						aria-hidden="true"
					></div>
				))}
			</div>

			{/* Foreground: Parliament clock-tower silhouette. The countdown hotspot
			    lives inside it so its position is relative to the painted image box. */}
			<div className={styles["hero-foreground"]} ref={foregroundRef} aria-hidden="true">
				{/* Invisible hotspot over the clock; positioned via JS (see useLayoutEffect) */}
				<div
					id="clock-tower"
					className={styles["clock-tower-hotspot"]}
					ref={hotspotRef}
					aria-hidden="true"
				></div>
			</div>

			{/* Heading with logo, form, and button */}
			<div className={styles["hero-heading"]}>
				<div className={styles["location-date-heading"]} data-aos="fade-up" data-aos-duration="800">
					<h5 className={styles["location"]}>
						<strong>{t("hero.date")} </strong>
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
				<form
					className={styles["hero-form"]}
					action={"https://tracker.hackthehill.com/follow?email=" + email}
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
						data-aos="fade-up"
						data-aos-duration="1000"
						data-aos-delay="500"
					>
						{t("hero.more")} <Icon icon={faArrowRight} className={styles["hero-btn-icon"]} />
					</button>
				</form>
			</div>

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
