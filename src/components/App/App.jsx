import Navigation from "../Navigation/Navigation";
import Hero from "../Hero/Hero";
import About from "../About/About";
import Stats from "../Stats/Stats";
import Winners from "../Winners/Winners";
import Testimonials from "../Testimonials/Testimonials";
import Schedule from "../Schedule/Schedule";
import Sponsors from "../Sponsors/Sponsors";
import FAQ from "../FAQ/FAQ";
import Footer from "../Footer/Footer";
import Notification from "../Notification/Notification";
import "../../global.css";
import styles from "./App.module.css";

function App() {
	return (
		<>
			<Navigation />
			<Hero />
			<div className={styles.wrapper}>
				<About />
				<Stats />
				<Winners />
				<Testimonials />
				<Schedule />
				<Sponsors />
				<FAQ />
				<Footer />
			</div>
			{/* <Notification /> */}
		</>
	);
}

export default App;