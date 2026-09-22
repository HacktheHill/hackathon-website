import { useEffect, useState, useRef } from "react";
import { useTranslations } from "@/i18n";
import Navigation from "../Navigation/Navigation";
import HeroLayerPicture from "./HeroLayerPicture";
import { HERO_ASSETS, HERO_CLOUDS } from "./assets";
import { useCountdown } from "./useCountdown";
import { useClockHotspot } from "./useClockHotspot";
import { useHeroParallax } from "./useHeroParallax";
import styles from "./Hero.module.css";
import "./animations.css";

const BannerLogo = "/Logos/hackthehill-banner.svg";

function Hero() {
	const [popupOpen, setPopupOpen] = useState(false);
	const t = useTranslations();
	const { countdownAvailable, countdownHeading, countdownItems, countdownOpenLabel, countdownCloseLabel } =
		useCountdown();
	const heroRef = useHeroParallax();
	const { foregroundRef, hotspotRef } = useClockHotspot(countdownAvailable);
	const applyBtnRef = useRef<HTMLAnchorElement>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const closeButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!popupOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;

			event.preventDefault();
			setPopupOpen(false);
			hotspotRef.current?.focus();
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [popupOpen]);

	useEffect(() => {
		if (popupOpen && applyBtnRef.current && dialogRef.current && heroRef.current) {
			if (window.matchMedia("(min-width: 1025px)").matches) {
				const heroRect = heroRef.current.getBoundingClientRect();
				const btnRect = applyBtnRef.current.getBoundingClientRect();
				const centerYScreen = (btnRect.bottom + window.innerHeight) / 2;
				const centerYLocal = centerYScreen - heroRect.top;
				dialogRef.current.style.top = `${centerYLocal}px`;
			} else {
				dialogRef.current.style.top = "";
			}
		}
	}, [popupOpen]);

	return (
		<section
			id="hero"
			ref={heroRef}
			className={styles["hero"]}
			aria-labelledby="hero-title"
			onPointerDown={() => setPopupOpen(false)}
		>
			<Navigation />
			{/* Sky */}
			<div className={styles["hero-sky"]} aria-hidden="true">
				<HeroLayerPicture asset={HERO_ASSETS.sky} highPriority />
			</div>

			{/* Drifting watercolour clouds */}
			<div className={styles["hero-clouds"]}>
				{HERO_CLOUDS.map((cloud, i) => (
					<div
						key={styles[cloud.className]}
						className={`${styles["cloud"]} ${styles[cloud.className]} hero-cloud hero-cloud-${i + 1}`}
						aria-hidden="true"
					>
						<HeroLayerPicture asset={cloud.asset} media={cloud.media} />
					</div>
				))}
			</div>

			{/* Layered hills behind the red foreground: far (yellow) then near (orange) */}
			<div className={styles["hero-hill-far"]} aria-hidden="true">
				<HeroLayerPicture asset={HERO_ASSETS.hill2} highPriority />
			</div>
			<div className={styles["hero-hill-near"]} aria-hidden="true">
				<HeroLayerPicture asset={HERO_ASSETS.hill1} highPriority />
			</div>

			{/* Foreground: Parliament clock-tower silhouette. The countdown hotspot
			    lives inside it so its position is relative to the painted image box. */}
			<div className={styles["hero-foreground"]} ref={foregroundRef}>
				<HeroLayerPicture asset={HERO_ASSETS.foreground} highPriority />
				{/* Invisible hotspot over the clock; positioned by useClockHotspot */}
				{countdownAvailable && (
					<button
						type="button"
						className={styles["clock-tower-hotspot"]}
						ref={hotspotRef}
						aria-label={countdownOpenLabel}
						aria-haspopup="dialog"
						aria-expanded={popupOpen}
						aria-controls="countdown-dialog"
						onPointerEnter={event => {
							if (event.pointerType !== "touch") setPopupOpen(true);
						}}
						onPointerLeave={event => {
							if (event.pointerType === "touch") return;
							const restoreFocus = dialogRef.current?.contains(document.activeElement);
							setPopupOpen(false);
							if (restoreFocus) requestAnimationFrame(() => hotspotRef.current?.focus());
						}}
						onPointerDown={event => event.stopPropagation()}
						onClick={event => {
							event.stopPropagation();
							setPopupOpen(true);
							requestAnimationFrame(() => closeButtonRef.current?.focus());
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
				<span data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
					<a ref={applyBtnRef} className={styles["hero-apply"]} href="https://apply.hackthehill.com/">
						{t("hero.apply")}
					</a>
				</span>
			</div>

			{/* Popup for countdown when opening the clock-tower hotspot */}
			{countdownAvailable && (
				<dialog
					ref={dialogRef}
					id="countdown-dialog"
					className={styles["countdown-dialog"]}
					open={popupOpen}
					aria-labelledby="countdown-heading"
					onPointerDown={event => event.stopPropagation()}
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
						&times;
					</button>
					<p id="countdown-heading" className={styles["countdown-header"]}>
						{countdownHeading}
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
