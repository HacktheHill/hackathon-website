// Must run before any FontAwesome icon renders — disables the runtime CSS
// injection that causes the giant icon flash on load.
import "@/fontawesome";
import Navigation from "../Navigation/Navigation";
import Hero from "../Hero/Hero";
import About from "../About/About";
import Stats from "../Stats/Stats";
import Winners from "../Winners/Winners";
import Testimonials from "../Testimonials/Testimonials";
import Sponsors from "../Sponsors/Sponsors";
import FAQ from "../FAQ/FAQ";
import Footer from "../Footer/Footer";
import Notification from "../Notification/Notification";
import "@/global.css";
import styles from "./App.module.css";

function App() {
	return (
		<>
			<Navigation />
			<Hero />
			{/* TODO: Uncomment when website is done. */}
			{/* <div className={styles.wrapper}>
				<About />
				<Stats />
				<Winners />
				<Testimonials />
				<Sponsors />
				<FAQ />
				<Footer />
			</div> */}
			{/* <Notification /> */}
		</>
	);
}

export default App;
