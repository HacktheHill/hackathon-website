// Must run before any FontAwesome icon renders — disables runtime CSS injection.
import "@/fontawesome";
import { t } from "@/i18n";
import Navigation from "../Navigation/Navigation";
import Hero from "../Hero/Hero";
import About, { AboutVideo } from "../About/About";
import Stats from "../Stats/Stats";
import Testimonials from "../Testimonials/Testimonials";
import Sponsors from "../Sponsors/Sponsors";
import FAQ from "../FAQ/FAQ";
import Footer from "../Footer/Footer";
import "@/global.css";
import styles from "./App.module.css";

const CANVAS_WIDTH = 3049;
const CANVAS_HEIGHT = 12301;

const SCENE_LAYERS = [
	{ name: "sky", x: 0, y: 0, width: 3049 },
	{ name: "cloud-1", x: 976, y: -315, width: 2182 },
	{ name: "cloud-2", x: -167, y: 544, width: 435 },
	{ name: "cloud-3", x: 241, y: 274, width: 803 },
	{ name: "cloud-4", x: -331, y: -142, width: 1884 },
	{ name: "cloud-5", x: 2627, y: 434, width: 1182 },
	{ name: "cloud-6", x: 1128, y: 430, width: 1489 },
	{ name: "hill-near", x: 0, y: 680, width: 3049 },
	{ name: "hill-far", x: 1483, y: 821, width: 1566 },
	{ name: "parliament-tower", x: 907, y: 253, width: 394 },
	{ name: "parliament-roof", x: 0, y: 980, width: 3049 },
	{ name: "parliament-towers", x: 364, y: 834, width: 2431 },
	{ name: "bush-1", x: 0, y: 1316, width: 3049 },
	{ name: "bush-2", x: 0, y: 1443, width: 3049 },
	{ name: "bush-3", x: 0, y: 3129, width: 3049 },
	{ name: "bush-4", x: 0, y: 4868, width: 3049 },
	{ name: "road", x: 0, y: 6289, width: 3049 },
	{ name: "water", x: 0, y: 8704, width: 3049 },
	{ name: "ice-1", x: 0, y: 6693, width: 3049 },
	{ name: "ice-2", x: 0, y: 7919, width: 3049 },
	{ name: "logs", x: 1436, y: 2080, width: 1377 },
	{ name: "footer-water", x: 374, y: 11610, width: 2675 },
	{ name: "footer-water-2", x: 0, y: 11853, width: 3049 },
] as const;

const percent = (value: number, total: number) => `${(value / total) * 100}%`;

function App() {
	return (
		<>
			<a className={styles["skip-link"]} href="#main-content">
				{t("navbar.skip_to_content")}
			</a>
			<Navigation />
			<main id="main-content" tabIndex={-1}>
				<div
					className={styles.canvas}
					style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
				>
					<div className={styles.artwork} aria-hidden="true">
						{SCENE_LAYERS.map((layer, index) => (
							<img
								key={layer.name}
								className={`${styles.layer}${
									layer.name.startsWith("cloud-")
										? ` ${styles["scene-cloud"]} ${styles[layer.name]}`
										: ""
								}`}
								data-scene-layer={layer.name}
								src={`/art/scene/${layer.name}.webp`}
								alt=""
								decoding="async"
								style={{
									left: percent(layer.x, CANVAS_WIDTH),
									top: percent(layer.y, CANVAS_HEIGHT),
									width: percent(layer.width, CANVAS_WIDTH),
									zIndex: (index + 1) * 10,
								}}
							/>
						))}
					</div>
					<div className={styles["video-layer"]}>
						<AboutVideo />
					</div>
					<div className={styles["stats-layer"]}>
						<Stats />
					</div>

					<div className={styles.content}>
						<div className={`${styles.slot} ${styles["hero-slot"]}`}>
							<Hero />
						</div>
						<div className={`${styles.slot} ${styles["about-slot"]}`}>
							<About />
						</div>
						<div className={`${styles.slot} ${styles["testimonials-slot"]}`}>
							<Testimonials />
						</div>
						<div className={`${styles.slot} ${styles["sponsors-slot"]}`}>
							<Sponsors />
						</div>
						<div className={`${styles.slot} ${styles["faq-slot"]}`}>
							<FAQ />
						</div>
						<div className={`${styles.slot} ${styles["footer-slot"]}`}>
							<Footer />
						</div>
					</div>
				</div>
			</main>
		</>
	);
}

export default App;
