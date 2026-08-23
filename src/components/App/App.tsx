// Must run before any FontAwesome icon renders — disables runtime CSS injection.
import "@/fontawesome";
import { Fragment, useEffect, useRef } from "react";
import { t } from "@/i18n";
import Hero from "../Hero/Hero";
import About, { AboutVideo } from "../About/About";
import Stats, { MobileVideoSign } from "../Stats/Stats";
import Testimonials from "../Testimonials/Testimonials";
import Sponsors from "../Sponsors/Sponsors";
import FAQ from "../FAQ/FAQ";
import Footer from "../Footer/Footer";
import ParticleEffects from "../ParticleEffects/ParticleEffects";
import "@/global.css";
import styles from "./App.module.css";

const CANVAS_WIDTH = 3049;
const CANVAS_HEIGHT = 12301;

const SCENE_LAYERS = [
	{ name: "sky", x: 0, y: 0, width: 3049, height: 2005 },
	{ name: "cloud-1", x: 976, y: -315, width: 2182, height: 1069 },
	{ name: "cloud-2", x: -167, y: 544, width: 435, height: 290 },
	{ name: "cloud-3", x: 241, y: 274, width: 803, height: 403 },
	{ name: "cloud-4", x: -331, y: -142, width: 1884, height: 632 },
	{ name: "cloud-5", x: 2627, y: 434, width: 1182, height: 640 },
	{ name: "cloud-6", x: 1128, y: 430, width: 1489, height: 829 },
	{ name: "hill-near", x: 0, y: 680, width: 3049, height: 1143 },
	{ name: "hill-far", x: 1483, y: 821, width: 1566, height: 670 },
	{ name: "parliament-tower", x: 907, y: 253, width: 394, height: 1392 },
	{ name: "parliament-roof", x: 0, y: 980, width: 3049, height: 846 },
	{ name: "parliament-towers", x: 364, y: 834, width: 2431, height: 1270 },
	{ name: "bush-1", x: 0, y: 1316, width: 3049, height: 1581 },
	{ name: "bush-2", x: 0, y: 1443, width: 3049, height: 3216 },
	{ name: "bush-3", x: 0, y: 3129, width: 3049, height: 2870 },
	{ name: "bush-4", x: 0, y: 4568, width: 3049, height: 2018 },
	{ name: "road", x: 0, y: 5989, width: 3049, height: 814 },
	{ name: "water", x: 0, y: 8404, width: 3049, height: 3597 },
	{ name: "ice-1", x: 0, y: 6393, width: 3049, height: 3153 },
	{ name: "ice-2", x: 0, y: 7619, width: 3049, height: 1926 },
	{ name: "logs", x: 1436, y: 2080, width: 1377, height: 900 },
	{ name: "footer-water", x: 374, y: 11310, width: 2675, height: 991 },
	{ name: "footer-water-2", x: 0, y: 11553, width: 3049, height: 748 },
] as const;

const HERO_SCENE_LAYERS: ReadonlySet<string> = new Set([
	"sky",
	"cloud-1",
	"cloud-2",
	"cloud-3",
	"cloud-4",
	"cloud-5",
	"cloud-6",
	"hill-near",
	"hill-far",
	"parliament-tower",
	"parliament-roof",
	"parliament-towers",
	"bush-1",
	"bush-2",
]);

const RESPONSIVE_CANVAS_WIDTHS = [1280, 1920] as const;

const percent = (value: number, total: number) => `${(value / total) * 100}%`;
const responsiveLayerWidth = (layerWidth: number, canvasWidth: number) =>
	Math.round((layerWidth * canvasWidth) / CANVAS_WIDTH);
const sceneLayerSrcSet = (layer: (typeof SCENE_LAYERS)[number]) =>
	[
		...RESPONSIVE_CANVAS_WIDTHS.map(
			canvasWidth =>
				`/art/scene/responsive/${canvasWidth}/${layer.name}.webp ${responsiveLayerWidth(
					layer.width,
					canvasWidth,
				)}w`,
		),
		`/art/scene/${layer.name}.webp ${layer.width}w`,
	].join(", ");
const sceneLayerSizes = (layer: (typeof SCENE_LAYERS)[number]) =>
	`(min-width: ${CANVAS_WIDTH}px) ${layer.width}px, ${((layer.width / CANVAS_WIDTH) * 100).toFixed(4)}vw`;

const HERO_PARALLAX_SPEEDS: Record<string, number> = {
	sky: 0.008,
	"cloud-1": 0.02,
	"cloud-2": 0.024,
	"cloud-3": 0.018,
	"cloud-4": 0.016,
	"cloud-5": 0.022,
	"cloud-6": 0.026,
	"hill-far": 0.06,
	"hill-near": 0.075,
	"parliament-tower": 0.045,
	"parliament-roof": 0.04,
	"parliament-towers": 0.035,
	"bush-1": 0.025,
	"bush-2": 0.018,
};

function App() {
	const artworkRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const artwork = artworkRef.current;
		const canvas = canvasRef.current;
		if (!artwork || !canvas) return;

		const layers = Array.from(
			artwork.querySelectorAll<HTMLElement>("[data-parallax-speed]"),
		).map(element => ({
			element,
			speed: Number(element.dataset.parallaxSpeed),
		}));
		const sections = Array.from(
			canvas.querySelectorAll<HTMLElement>("[data-section-parallax]"),
		).map(element => ({
			element,
			max: Number(element.dataset.parallaxMax),
			speed: Number(element.dataset.sectionParallax),
		}));
		const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const desktopQuery = window.matchMedia("(min-width: 1025px)");
		let frame = 0;

		const update = () => {
			frame = 0;

			if (motionQuery.matches || !desktopQuery.matches) return;

			const travel = Math.min(window.scrollY, window.innerHeight * 1.25);
			layers.forEach(({ element, speed }) => {
				element.style.translate = `0 ${travel * speed}px`;
			});

			sections.forEach(({ element, max, speed }) => {
				const previousOffset = Number(element.dataset.parallaxOffset ?? 0);
				const bounds = element.getBoundingClientRect();
				const baseCenter = bounds.top - previousOffset + bounds.height / 2;
				const distanceFromCenter = window.innerHeight / 2 - baseCenter;
				const offset = Math.max(-max, Math.min(max, distanceFromCenter * speed));
				element.dataset.parallaxOffset = String(offset);
				element.style.translate = `0 ${offset}px`;
			});
		};

		const resetMotion = () => {
			if (motionQuery.matches || !desktopQuery.matches) {
				layers.forEach(({ element }) => element.style.removeProperty("translate"));
				sections.forEach(({ element }) => {
					element.style.removeProperty("translate");
					element.dataset.parallaxOffset = "0";
				});
			} else {
				update();
			}
		};
		const handleScroll = () => {
			if (!frame) frame = window.requestAnimationFrame(update);
		};

		resetMotion();
		window.addEventListener("scroll", handleScroll, { passive: true });
		motionQuery.addEventListener("change", resetMotion);
		desktopQuery.addEventListener("change", resetMotion);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			motionQuery.removeEventListener("change", resetMotion);
			desktopQuery.removeEventListener("change", resetMotion);
			if (frame) window.cancelAnimationFrame(frame);
		};
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		const faqSlot = canvas?.querySelector<HTMLElement>("#faq")?.parentElement;
		const footerSlot = canvas?.querySelector<HTMLElement>("footer")?.parentElement;
		if (!canvas || !faqSlot || !footerSlot) return;

		const desktopQuery = window.matchMedia("(min-width: 1025px)");
		let frame = 0;

		const updateExtension = () => {
			frame = 0;
			if (!desktopQuery.matches) {
				canvas.style.removeProperty("--faq-content-extension");
				return;
			}

			const currentExtension =
				Number.parseFloat(getComputedStyle(canvas).getPropertyValue("--faq-content-extension")) || 0;
			const faqBottom = faqSlot.offsetTop + faqSlot.getBoundingClientRect().height;
			const footerTopWithoutExtension = footerSlot.offsetTop - currentExtension;
			const requiredExtension = Math.max(0, Math.ceil(faqBottom + 48 - footerTopWithoutExtension));

			canvas.style.setProperty("--faq-content-extension", `${requiredExtension}px`);
		};

		const requestExtensionUpdate = () => {
			if (!frame) frame = window.requestAnimationFrame(updateExtension);
		};
		const observer = new ResizeObserver(requestExtensionUpdate);
		observer.observe(faqSlot);
		window.addEventListener("resize", requestExtensionUpdate);
		desktopQuery.addEventListener("change", requestExtensionUpdate);
		requestExtensionUpdate();

		return () => {
			observer.disconnect();
			window.removeEventListener("resize", requestExtensionUpdate);
			desktopQuery.removeEventListener("change", requestExtensionUpdate);
			if (frame) window.cancelAnimationFrame(frame);
		};
	}, []);

	return (
		<>
			<a className={styles["skip-link"]} href="#main-content">
				{t("navbar.skip_to_content")}
			</a>
			<main id="main-content" tabIndex={-1}>
				<div ref={canvasRef} className={styles.canvas} data-page-canvas>
					<div
						className={styles["base-scene"]}
						style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
					>
					<div ref={artworkRef} className={styles.artwork} data-scene-artwork aria-hidden="true">
						{SCENE_LAYERS.map((layer, index) => (
							<Fragment key={layer.name}>
								<picture>
									<source
										media="(min-width: 1025px)"
										srcSet={sceneLayerSrcSet(layer)}
										sizes={sceneLayerSizes(layer)}
									/>
									<img
										className={`${styles.layer}${
											layer.name.startsWith("cloud-")
												? ` ${styles["scene-cloud"]} ${styles[layer.name]}`
												: ""
										}${layer.name === "road" ? ` ${styles["tablet-road-shift"]}` : ""}${
											layer.name === "ice-1" ? ` ${styles["tablet-ice-top"]}` : ""
										}${
											layer.name === "ice-2" ? ` ${styles["tablet-ice-cracks"]}` : ""
										}`}
										data-scene-layer={layer.name}
										data-parallax-speed={HERO_PARALLAX_SPEEDS[layer.name]}
										alt=""
										width={layer.width}
										height={layer.height}
										loading={HERO_SCENE_LAYERS.has(layer.name) ? "eager" : "lazy"}
										{...(layer.name === "sky" ? { fetchpriority: "high" } : {})}
										decoding={HERO_SCENE_LAYERS.has(layer.name) ? "sync" : "async"}
										style={{
											left: percent(layer.x, CANVAS_WIDTH),
											top: percent(layer.y, CANVAS_HEIGHT),
											width: percent(layer.width, CANVAS_WIDTH),
											zIndex: (index + 1) * 10,
										}}
									/>
								</picture>
								{layer.name === "ice-1" && (
									<picture>
										<source
											media="(min-width: 1025px)"
											srcSet={sceneLayerSrcSet(layer)}
											sizes={sceneLayerSizes(layer)}
										/>
										<img
											className={`${styles.layer} ${styles["tablet-ice-bottom"]}`}
											data-scene-slice="ice-bottom"
											alt=""
											width={layer.width}
											height={layer.height}
											loading="lazy"
											decoding="async"
											style={{
												left: percent(layer.x, CANVAS_WIDTH),
												top: percent(layer.y, CANVAS_HEIGHT),
												width: percent(layer.width, CANVAS_WIDTH),
												zIndex: (index + 1) * 10,
											}}
										/>
									</picture>
								)}
							</Fragment>
						))}
						<div className={styles["tablet-ice-middle"]}></div>
					</div>
					<div className={`${styles.slot} ${styles["hero-slot"]}`}>
						<Hero />
					</div>
					<div
						className={styles["video-layer"]}
						data-section-parallax="0.024"
						data-parallax-max="32"
					>
						<div className={styles["video-frame"]}>
							<AboutVideo />
						</div>
						<MobileVideoSign />
					</div>
					<div
						className={styles["stats-layer"]}
						data-section-parallax="0.035"
						data-parallax-max="42"
					>
						<Stats />
					</div>

					<div className={styles.content}>
						<ParticleEffects />
						<div
							className={`${styles.slot} ${styles["about-slot"]}`}
							data-section-parallax="0.024"
							data-parallax-max="32"
						>
							<About />
						</div>
						<div
							className={`${styles.slot} ${styles["testimonials-slot"]}`}
							data-section-parallax="0.028"
							data-parallax-max="36"
						>
							<Testimonials />
						</div>
						<div
							className={`${styles.slot} ${styles["sponsors-slot"]}`}
							data-section-parallax="0.02"
							data-parallax-max="30"
						>
							<Sponsors />
						</div>
						<div
							className={`${styles.slot} ${styles["faq-slot"]}`}
							data-section-parallax="0.024"
							data-parallax-max="34"
						>
							<FAQ />
						</div>
						<div
							className={`${styles.slot} ${styles["footer-slot"]}`}
							data-section-parallax="0.016"
							data-parallax-max="24"
						>
							<Footer />
						</div>
					</div>
					</div>
				</div>
			</main>
		</>
	);
}

export default App;
