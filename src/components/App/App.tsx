// Disable runtime CSS injection before any FontAwesome icon renders.
import "@/fontawesome";
import { useRef } from "react";
import { useTranslations } from "@/i18n";
import Hero from "../Hero/Hero";
import About, { AboutVideo } from "../About/About";
import Stats, { MobileStatsIntro } from "../Stats/Stats";
import Testimonials from "../Testimonials/Testimonials";
import Sponsors from "../Sponsors/Sponsors";
import FAQ from "../FAQ/FAQ";
import Footer from "../Footer/Footer";
import ParticleEffects from "../ParticleEffects/ParticleEffects";
import "@/global.css";
import SceneArtwork from "../Scene/SceneArtwork";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../Scene/sceneLayers";
import { useSceneParallax } from "../Scene/useSceneParallax";
import { useFaqCanvasExtension } from "../Scene/useFaqCanvasExtension";
import styles from "../Scene/Scene.module.css";
import appStyles from "./App.module.css";

function App() {
	const t = useTranslations();
	const artworkRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLDivElement>(null);

	useSceneParallax(artworkRef, canvasRef);
	useFaqCanvasExtension(canvasRef);

	return (
		<>
			<a className={appStyles["skip-link"]} href="#main-content">
				{t("navbar.skip_to_content")}
			</a>
			<main id="main-content" tabIndex={-1}>
				<div ref={canvasRef} className={styles.canvas} data-page-canvas>
					<div className={styles["base-scene"]} style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}>
						<SceneArtwork artworkRef={artworkRef} />
						<div className={`${styles.slot} ${styles["hero-slot"]}`}>
							<Hero />
						</div>
						<div className={styles["video-layer"]}>
							<div className={styles["video-frame"]}>
								<AboutVideo />
							</div>
							<MobileStatsIntro />
						</div>
						<div className={styles["stats-layer"]} data-section-parallax="0.035" data-parallax-max="42">
							<Stats />
						</div>

						<div className={styles.content}>
							<ParticleEffects />
							<div className={`${styles.slot} ${styles["about-slot"]}`}>
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
