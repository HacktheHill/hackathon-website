import FAQ from "../FAQ/FAQ";
import About from "../About/About";
import Footer from "../Footer/Footer";
import Testimonials from "../Testimonials/Testimonials";
import Notification from "../Notification/Notification";
import Stats from "../Stats/Stats";
import Hero from "../Hero/Hero";
import Navigation from "../Navigation/Navigation";
import Schedule from "../Schedule/Schedule";
import Sponsors from "../Sponsors/Sponsors";
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
