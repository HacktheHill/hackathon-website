import { useEffect, useState } from "react";
import FAQ from "..//FAQ/FAQ";
import About from "../About/About";
import Notification from "../Notification/Notification";
import Collaborators from "../Collaborators/Collaborators";
import Footer from "../Footer/Footer";
import Hero from "../Hero/Hero";
import NavBar from "../NavBar/NavBar";
import Sidebar from "../NavBar/Sidebar";
import Schedule from "../Schedule/Schedule";
import Sponsors from "../Sponsors/Sponsors";
import "./App.css";

function App() {
	const [pageScroll, setPageScroll] = useState(0);
	useEffect(() => {
		const onScroll = () => setPageScroll(window.pageYOffset);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<div>
			{<Sidebar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />}
			<div className="page-wrap">
				<NavBar pageScroll={pageScroll} />
				<Hero />
				<About />
				<Sponsors />
				<Schedule />
				<Collaborators />
				<FAQ />
				<hr></hr>
				<Footer />
				<Notification />
			</div>
		</div>
	);
}

export default App;
