import React, { useEffect } from "react";
import Hero from "../Hero/Hero";
import About from "../About/About";
import Stats from "../Stats/Stats";
import Gallery from "../Gallery/Gallery";
import Sponsors from "../Sponsors/Sponsors";
import Testimonials from "../Testimonials/Testimonials";
import Contact from "../Contact/Contact";
import "../../global.css";
import AOS from "aos";
import "aos/dist/aos.css";

export default function HomePage() {
	useEffect(() => {
		AOS.init({ once: false, duration: 700 });
	}, []);
	return (
		<div className="w-full flex flex-col items-center justify-center">
			<Hero />
			<About />
			<Stats />
			<Sponsors />
			<Gallery />
			<Testimonials />
			{/*<Contact />*/}
		</div>
	);
}
