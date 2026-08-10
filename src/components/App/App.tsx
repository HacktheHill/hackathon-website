// Must run before any FontAwesome icon renders — disables the runtime CSS
// injection that causes the giant icon flash on load.
import "@/fontawesome";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { t } from "@/i18n";
import Navigation from "../Navigation/Navigation";
import Hero from "../Hero/Hero";
import About from "../About/About";
import Stats from "../Stats/Stats";
import Testimonials from "../Testimonials/Testimonials";
import Sponsors from "../Sponsors/Sponsors";
import FAQ from "../FAQ/FAQ";
import Footer from "../Footer/Footer";
import "@/global.css";
import styles from "./App.module.css";

function App() {
	useEffect(() => {
		const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		let initialized = false;

		const initializeAnimations = () => {
			if (!motionQuery.matches && !initialized) {
				AOS.init({});
				initialized = true;
			}
		};

		initializeAnimations();
		motionQuery.addEventListener("change", initializeAnimations);
		return () => motionQuery.removeEventListener("change", initializeAnimations);
	}, []);

	return (
		<>
			<a className={styles["skip-link"]} href="#main-content">
				{t("navbar.skip_to_content")}
			</a>
			<Navigation />
			<main id="main-content" tabIndex={-1}>
				<Hero />
				<div className={styles.wrapper}>
					<About />
					<Stats />
					<Testimonials />
					<Sponsors />
					<FAQ />
				</div>
			</main>
			<Footer />
		</>
	);
}

export default App;
