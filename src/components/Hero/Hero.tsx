import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { t } from "@/i18n";
import styles from "./Hero.module.css";
import "./animations.css";

//animations
import AOS from "aos";
import "aos/dist/aos.css";

const BannerLogo = "/Logos/hackthehill-banner.svg";

const EVENT_START_DATE = new Date("2026-09-25T17:00:00-04:00").getTime();
const HACKING_START_DATE = new Date("2026-09-25T23:00:00-04:00").getTime();
const HACKING_END_DATE = new Date("2026-09-27T11:00:00-04:00").getTime();

// If the current time is before the event start date, the countdown will show the time until the event starts
// If the current time is between the event start date and the hacking start date, the countdown will show the time until hacking starts
// If the current time is between the hacking start date and the hacking end date, the countdown will show the time until hacking ends
// If the current time is after the hacking end date, the countdown will not show
let date: number | null = null;
switch (true) {
	case Date.now() < EVENT_START_DATE:
		date = EVENT_START_DATE;
		break;
	case Date.now() < HACKING_START_DATE:
		date = HACKING_START_DATE;
		break;
	case Date.now() < HACKING_END_DATE:
		date = HACKING_END_DATE;
		break;
}

// foreground.webp is 1920×1070. The Peace Tower clock sits at this centre (in the
// asset's own pixels) and spans roughly this box. We replicate the exact transform
// the browser paints the background with so the hotspot tracks the clock on every
// viewport — a fixed left/top can't, because the image scales/shifts per shape.
// There are two paint modes (see Hero.module.css):
//   • desktop: background-size: 100% auto; bottom-pinned, but the top is clamped
//     by --foreground-min-top so the spire clears the navbar
//   • portrait: background-size: cover; position: center bottom
const FOREGROUND_W = 1920;
const FOREGROUND_H = 1070;
const CLOCK_HOTSPOT = { cx: 690, cy: 290, w: 170, h: 170 };
// Fallback for --foreground-min-top if the custom property cannot be read.
const DEFAULT_FOREGROUND_MIN_TOP = 80;
// Portrait paints with `cover`; must match the CSS media condition.
const FOREGROUND_COVER_MEDIA = "(orientation: portrait)";

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
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		AOS.init();
	}, []);

	useEffect(() => {
		setTime(Date.now());
		const interval = setInterval(() => setTime(Date.now()), 1000);

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

	// `t()` calls React hooks internally, so the number of t() calls must stay
	// constant across renders. The form/thanks branch below would otherwise vary
	// the count, so resolve those strings up front (always called, every render).
	const emailPlaceholder = t("hero.email_placeholder");
	const followLabel = t("hero.more");
	const thanksLabel = t("hero.thanks");

	// For parallax scrolling effect
	const heroRef = useRef<HTMLDivElement>(null);

	// Keep the invisible countdown hotspot pinned to the painted clock. Because
	// the foreground is width-scaled and bottom-pinned, the clock slides around as
	// the viewport changes shape, so we recompute the hotspot from that geometry
	// whenever the foreground box resizes (vh changes, mobile URL bar, rotation).
	const foregroundRef = useRef<HTMLDivElement>(null);
	const hotspotRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const fg = foregroundRef.current;
		const hotspot = hotspotRef.current;
		if (!fg || !hotspot) return;

		const place = () => {
			const cw = fg.clientWidth;
			const ch = fg.clientHeight;
			if (!cw || !ch) return;

			// Replicate the painted background's geometry inside this box (the box's
			// own offset/drop is inherited by the hotspot as a child).
			let renderedW: number;
			let offsetY: number;
			if (window.matchMedia(FOREGROUND_COVER_MEDIA).matches) {
				// portrait: `cover` — fills whichever axis is tighter, bottom-pinned
				const coverScale = Math.max(cw / FOREGROUND_W, ch / FOREGROUND_H);
				renderedW = FOREGROUND_W * coverScale;
				offsetY = ch - FOREGROUND_H * coverScale;
			} else {
				// desktop: `100% auto`, bottom-pinned but floored at the navbar clearance
				renderedW = cw;
				const configuredMinTop = Number.parseFloat(
					window.getComputedStyle(fg).getPropertyValue("--foreground-min-top")
				);
				const minTop = Number.isFinite(configuredMinTop)
					? configuredMinTop
					: DEFAULT_FOREGROUND_MIN_TOP;
				offsetY = Math.max(minTop, ch - FOREGROUND_H * (renderedW / FOREGROUND_W));
			}
			const scale = renderedW / FOREGROUND_W;
			const offsetX = (cw - renderedW) / 2; // centred (matters only when cover-cropped)

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
			{ selector: `.${styles["hero-sky"]}`, speed: 0.15 },
			{ selector: `.${styles["hero-hill-far"]}`, speed: 0.3 },
			{ selector: `.${styles["hero-hill-near"]}`, speed: 0.45 },
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
		<div id="hero" ref={heroRef} className={styles["hero"]} onPointerDown={() => setPopupOpen(false)}>
			{/* Sky */}
			<div className={styles["hero-sky"]}></div>

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

			{/* Layered hills behind the red foreground: far (yellow) then near (orange) */}
			<div className={styles["hero-hill-far"]} aria-hidden="true"></div>
			<div className={styles["hero-hill-near"]} aria-hidden="true"></div>

			{/* Foreground: Parliament clock-tower silhouette. The countdown hotspot
			    lives inside it so its position is relative to the painted image box. */}
			<div className={styles["hero-foreground"]} ref={foregroundRef}>
				{/* Invisible hotspot over the clock; positioned via JS (see useEffect) */}
				<button
					type="button"
					id="clock-tower"
					className={styles["clock-tower-hotspot"]}
					ref={hotspotRef}
					aria-label="Show Hack the Hill countdown"
					aria-haspopup="dialog"
					aria-expanded={popupOpen}
					aria-controls="countdown-dialog countdown-dialog-small"
					onPointerEnter={(event) => {
						if (event.pointerType !== "touch") setPopupOpen(true);
					}}
					onPointerLeave={(event) => {
						if (event.pointerType !== "touch") setPopupOpen(false);
					}}
					onPointerDown={(event) => {
						event.stopPropagation();
						setPopupOpen(true);
					}}
					onClick={(event) => {
						event.stopPropagation();
						setPopupOpen(true);
					}}
				/>
			</div>

			{/* Date · wordmark · tagline · signup — right-side column over the open sky */}
			<div className={styles["hero-heading"]}>
				<p className={styles["hero-eyebrow"]} data-aos="fade-up" data-aos-duration="800">
					{t("hero.date")} {t("hero.at")} uOttawa
				</p>
				<h1
					id="Hero"
					className={styles["hero-wordmark"]}
					data-aos="fade-up"
					data-aos-duration="800"
					data-aos-delay="100"
				>
					<img className={styles["banner-logo"]} src={BannerLogo} alt="Hack the Hill III" />
					{/* Edition mark — three bright-red bars reading "III" */}
					<span className={styles["edition"]} aria-hidden="true">
						<i></i>
						<i></i>
						<i></i>
					</span>
				</h1>
				<h2 data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
					{t("hero.h2")}
				</h2>
				{/* The form submits a GET into the hidden iframe below, so the tracker
				    records the follow without navigating the page away. It's a
				    cross-origin navigation (not a fetch), so CORS doesn't apply — but
				    we also can't read the result, hence the optimistic message. */}
				{submitted ? (
					<output className={styles["hero-form-thanks"]} data-aos="fade-up" aria-live="polite">
						{thanksLabel}
					</output>
				) : (
					<form
						className={styles["hero-form"]}
						action="https://tracker.hackthehill.com/follow"
						target="tracker-sink"
						onSubmit={() => setSubmitted(true)}
					>
						<input
							id="email"
							name="email"
							className={styles["hero-input"]}
							type="email"
							required
							placeholder={emailPlaceholder}
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
							{followLabel} <Icon icon={faArrowRight} className={styles["hero-btn-icon"]} />
						</button>
					</form>
				)}
				{/* Hidden submit target — keeps the follow request on this page.
				    Hide inline (not just via the CSS class) so the iframe never flashes
				    at its default 300×150 bordered box before the stylesheet loads. */}
				<iframe
					className={styles["tracker-sink"]}
					style={{ display: "none" }}
					name="tracker-sink"
					title="Newsletter signup"
					tabIndex={-1}
					aria-hidden="true"
				/>
			</div>

			{/* Popup for countdown when opening the clock-tower hotspot */}
			{date && (
				<dialog
					id="countdown-dialog"
					className={styles["countdown-dialog"]}
					open={popupOpen}
					onPointerDown={(event) => event.stopPropagation()}
				>
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
				<dialog
					id="countdown-dialog-small"
					className={styles["countdown-dialog-small"]}
					open={popupOpen}
					onPointerDown={(event) => event.stopPropagation()}
				>
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
