import { useEffect, useState, useRef } from "react";
import { useStore } from "@nanostores/react";
import { locale, t } from "@/i18n";
import styles from "./Hero.module.css";
import "./animations.css";

const BannerLogo = "/Logos/hackthehill-banner.svg";

const EVENT_START_DATE = new Date("2026-09-25T17:00:00-04:00").getTime();
const HACKING_START_DATE = new Date("2026-09-25T23:00:00-04:00").getTime();
const HACKING_END_DATE = new Date("2026-09-27T11:00:00-04:00").getTime();

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
	const [time, setTime] = useState<number | null>(null);
	const currentLocale = useStore(locale);
	const closeButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const initialTime = Date.now();
		setTime(initialTime);
		if (initialTime >= HACKING_END_DATE) return;

		const interval = window.setInterval(() => {
			const now = Date.now();
			setTime(now);
			if (now >= HACKING_END_DATE) window.clearInterval(interval);
		}, 1000);

		return () => window.clearInterval(interval);
	}, []);

	const targetDate =
		time === null
			? null
			: time < EVENT_START_DATE
				? EVENT_START_DATE
				: time < HACKING_START_DATE
					? HACKING_START_DATE
					: time < HACKING_END_DATE
						? HACKING_END_DATE
						: null;
	const countdownAvailable = targetDate !== null;
	const remainingTime = targetDate === null || time === null ? 0 : Math.max(0, targetDate - time);
	const days = Math.floor(remainingTime / 1000 / 60 / 60 / 24);
	const hours = Math.floor(remainingTime / 1000 / 60 / 60) % 24;
	const minutes = Math.floor(remainingTime / 1000 / 60) % 60;
	const seconds = Math.floor(remainingTime / 1000) % 60;

	const formattedHours = hours.toLocaleString("en-US", { minimumIntegerDigits: 2 });
	const formattedMinutes = minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 });
	const formattedSeconds = seconds.toLocaleString("en-US", { minimumIntegerDigits: 2 });
	const eventStartLabel = t("hero.countdown.event_start");
	const hackingStartLabel = t("hero.countdown.hacking_start");
	const hackingEndLabel = t("hero.countdown.hacking_end");
	const countdownOpenLabel = t("hero.countdown.open");
	const countdownCloseLabel = t("hero.countdown.close");
	const countdownHeading =
		targetDate === HACKING_START_DATE
			? hackingStartLabel
			: targetDate === HACKING_END_DATE
				? hackingEndLabel
				: eventStartLabel;
	const pluralRules = new Intl.PluralRules(currentLocale);
	const countdownItems = [
		{
			key: "days",
			display: String(days),
			label: t(pluralRules.select(days) === "one" ? "hero.countdown.day" : "hero.countdown.days"),
		},
		{
			key: "hours",
			display: formattedHours,
			label: t(pluralRules.select(hours) === "one" ? "hero.countdown.hour" : "hero.countdown.hours"),
		},
		{
			key: "minutes",
			display: formattedMinutes,
			label: t(pluralRules.select(minutes) === "one" ? "hero.countdown.minute" : "hero.countdown.minutes"),
		},
		{
			key: "seconds",
			display: formattedSeconds,
			label: t(pluralRules.select(seconds) === "one" ? "hero.countdown.second" : "hero.countdown.seconds"),
		},
	];

	// For parallax scrolling effect
	const heroRef = useRef<HTMLDivElement>(null);

	// Keep the invisible countdown hotspot pinned to the painted clock. Because
	// the foreground is width-scaled and bottom-pinned, the clock slides around as
	// the viewport changes shape, so we recompute the hotspot from that geometry
	// whenever the foreground box resizes (vh changes, mobile URL bar, rotation).
	const foregroundRef = useRef<HTMLDivElement>(null);
	const hotspotRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!popupOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;

			event.preventDefault();
			const restoreFocus = document.activeElement === closeButtonRef.current;
			setPopupOpen(false);
			if (restoreFocus) hotspotRef.current?.focus();
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [popupOpen]);

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
	}, [countdownAvailable]);

	// Detect if the user is scrolling and apply layered parallax transforms.
	// Each layer moves at a different rate to create a sense of depth.
	useEffect(() => {
		const heroEl = heroRef.current;
		if (!heroEl) return;
		const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		let reducedMotion = motionQuery.matches;

		const heading = heroEl.querySelector<HTMLElement>(`.${styles["hero-heading"]}`);

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
			if (!visible || reducedMotion) return;
			const scrollY = window.scrollY;
			if (!heroRef.current) return;

			if (heading) {
				heading.style.transform = `translate3d(0, ${Math.min(scrollY, window.innerHeight) * 0.05}px, 0)`;
			}
		};

		const handleScroll = () => {
			if (frame) return;
			frame = window.requestAnimationFrame(update);
		};

		const handleMotionChange = (event: MediaQueryListEvent) => {
			reducedMotion = event.matches;
			if (!reducedMotion) return;

			heading?.style.removeProperty("transform");
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		motionQuery.addEventListener("change", handleMotionChange);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			motionQuery.removeEventListener("change", handleMotionChange);
			observer.disconnect();
			if (frame) window.cancelAnimationFrame(frame);
		};
	}, []);

	return (
		<section
			id="hero"
			ref={heroRef}
			className={styles["hero"]}
			aria-labelledby="hero-title"
			onPointerDown={() => setPopupOpen(false)}
		>
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
				{countdownAvailable && (
					<button
						type="button"
						className={styles["clock-tower-hotspot"]}
						ref={hotspotRef}
						aria-label={countdownOpenLabel}
						aria-haspopup="dialog"
						aria-expanded={popupOpen}
						aria-controls="countdown-dialog"
						onPointerEnter={(event) => {
							if (event.pointerType !== "touch") setPopupOpen(true);
						}}
						onPointerLeave={(event) => {
							if (event.pointerType !== "touch") setPopupOpen(false);
						}}
						onPointerDown={(event) => event.stopPropagation()}
						onClick={(event) => {
							event.stopPropagation();
							setPopupOpen(true);
							window.requestAnimationFrame(() => closeButtonRef.current?.focus());
						}}
					/>
				)}
			</div>

			{/* Date · wordmark · tagline · application — right-side column over the open sky */}
			<div className={styles["hero-heading"]}>
				<p className={styles["hero-eyebrow"]} data-aos="fade-up" data-aos-duration="800">
					{t("hero.date")} {t("hero.at")} uOttawa
				</p>
				<h1
					id="hero-title"
					className={styles["hero-wordmark"]}
					data-aos="fade-up"
					data-aos-duration="800"
					data-aos-delay="100"
				>
					<img
						className={styles["banner-logo"]}
						src={BannerLogo}
						alt="Hack the Hill III"
						width="635"
						height="96"
					/>
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
				<span
					data-aos="fade-up"
					data-aos-duration="1000"
					data-aos-delay="300"
				>
					<a className={styles["hero-apply"]} href="https://apply.hackthehill.com/">
						{t("hero.apply")}
					</a>
				</span>
			</div>

			{/* Popup for countdown when opening the clock-tower hotspot */}
			{countdownAvailable && (
				<dialog
					id="countdown-dialog"
					className={styles["countdown-dialog"]}
					open={popupOpen}
					aria-labelledby="countdown-heading"
					onPointerDown={(event) => event.stopPropagation()}
				>
					<button
						ref={closeButtonRef}
						type="button"
						className={styles["countdown-close"]}
						aria-label={countdownCloseLabel}
						onClick={() => {
							setPopupOpen(false);
							hotspotRef.current?.focus();
						}}
					>
						<span aria-hidden="true">&times;</span>
					</button>
					<p id="countdown-heading" className={styles["countdown-header"]}>
						<strong>{countdownHeading}</strong>
					</p>

					<div className={styles["countdown-items-container"]}>
						{countdownItems.map(item => (
							<div key={item.key} className={styles["countdown-item"]}>
								<span className={styles["countdown-value"]}>{item.display}</span>
								<span className={styles["countdown-unit"]}>{item.label}</span>
							</div>
						))}
					</div>
				</dialog>
			)}
		</section>
	);
}

export default Hero;
