import { useEffect, useState } from "react";
import FAQ from "..//FAQ/FAQ";
import About from "../About/About";
import Collaborators from "../Collaborators/Collaborators";
import Footer from "../Footer/Footer";
import Hero from "../Hero/Hero";
import Navigation from "../Navigation/Navigation";
import Schedule from "../Schedule/Schedule";
import Sponsors from "../Sponsors/Sponsors";
import "./App.css";
import Headshots from "../Headshots/Headshots";

function App() {
	const [pageScroll, setPageScroll] = useState(0);
	useEffect(() => {
		const onScroll = () => setPageScroll(window.scrollY);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<>
			<Navigation pageScroll={pageScroll} />
			<Hero />
			<About />
			<Sponsors />
			<Schedule />
			<Headshots />
			<Collaborators />
			<FAQ />
			<Footer />
			{/* Commented out because the information provided is outdated-> */}
			{/* <Notification /> */}
		</>
	);
}

export default App;
