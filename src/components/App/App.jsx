import { useEffect, useState } from "react";
import FAQ from "..//FAQ/FAQ";
import About from "../About/About";
import Collaborators from "../Collaborators/Collaborators";
import Footer from "../Footer/Footer";
import Memories from "../Memories/Memories";
import Notification from "../Notification/Notification";
import Stats from "../Stats/Stats";
import Hero from "../Hero/Hero";
import Navigation from "../Navigation/Navigation";
import Schedule from "../Schedule/Schedule";
import Sponsors from "../Sponsors/Sponsors";
import "./global.css";

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
			{/* 
			<About />
			<Stats />
			<Memories />
			<Schedule />
			<Sponsors />
			<Collaborators />	
			<FAQ />
			<Footer />
			*/}
			{/* <Notification /> */}
		</>
	);
}

export default App;
