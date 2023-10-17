import FAQ from "..//FAQ/FAQ";
import About from "../About/About";
import Collaborators from "../Collaborators/Collaborators";
import Footer from "../Footer/Footer";
import Testimonials from "../Testimonials/Testimonials";
import Notification from "../Notification/Notification";
import Stats from "../Stats/Stats";
import Hero from "../Hero/Hero";
import Navigation from "../Navigation/Navigation";
import Schedule from "../Schedule/Schedule";
import Sponsors from "../Sponsors/Sponsors";
import "../../global.css";

function App() {
	return (
		<>
			<Navigation />
			<Hero />
			{/* <About /> */}
			{/* <Stats /> */}
			<Testimonials />
			{/* <Schedule /> */}
			{/* <Sponsors /> */}
			{/* <Collaborators /> */}
			<FAQ />
			<Footer />
			{/* <Notification /> */}
		</>
	);
}

export default App;
