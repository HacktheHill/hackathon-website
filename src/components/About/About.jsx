import React from "react";
import { t } from "../../i18n";
import "./About.css";
import Mascot from "/SVGs/mascot-waving.svg";

function About() {
	return (
		<div className="about" id="about">
			<div className="about-text">
				<h1>{t("about.title")}</h1>
				<p>
					{t("about.p1")}
					<br></br>
					<br></br>
					{t("about.p2")}
					<br></br>
					<br></br>
					{t("about.p3")}
				</p>
			</div>
			<img className="mascot" src={Mascot} alt={t("about.img_alt")} />
		</div>
	);
}

export default About;
