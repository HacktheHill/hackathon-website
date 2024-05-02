import React from "react";
import Hero from "../Hero/Hero";
import About from "../About/About";
import Stats from "../Stats/Stats";
import Gallery from "../Gallery/Gallery";
import Sponsors from "../Sponsors/Sponsors";
import Testimonials from "../Testimonials/Testimonials";
import Contact from "../Contact/Contact";
import "../../global.css";

export default function HomePage() {
	return (
		<div className="w-full flex flex-col items-center jusitfy-center">
			<Hero />
			<About />
			<Stats />
			<Gallery />
			<Sponsors />
			<Testimonials />
			{/*<Contact />*/}
		</div>
	);
}
