import "./App.css";
import NavBar from "../NavBar/NavBar.js";
import Sidebar from "../NavBar/Sidebar.js";
import Hero from "../Hero/Hero.js";
import About from "../About/About.js";
import Schedule from "../Schedule/Schedule.js";
import SponsorEvent from "../SponsorEvent/SponsorEvent.js";
import SponsorShowcase from "../SponsorShowcase/SponsorShowcase.js";
import Collaborators from "../Collaborators/Collaborators.js";
import FAQ from "../FAQ/FAQ.js";
import Footer from "../Footer/Footer.js";
import { useEffect, useState } from "react";

function App() {
	document.title = "Hack the Hill | 2023";

	const [pageScroll, setPageScroll] = useState(0);

	useEffect(() => {
		const onScroll = () => setPageScroll(window.pageYOffset);
		window.removeEventListener("scroll", onScroll);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<div>
			<Sidebar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
			<div className="page-wrap">
				<NavBar pageScroll={pageScroll} />
				<Hero />
				<About />
				<SponsorShowcase />
				<Schedule />
				<Collaborators />
				<FAQ />
				<hr></hr>
				<Footer />
			</div>
		</div>
	);
}

export default App;
