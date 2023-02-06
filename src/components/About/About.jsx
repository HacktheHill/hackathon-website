import React, { Component } from "react";
import "./About.css";
import Mascot from "/SVGs/mascot-waving.svg";
import { useTranslation, Trans } from "react-i18next";
import "../Localization/i18n";

function About() {
	const { t, i18n } = useTranslation();

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
			<img className="mascot" src={Mascot} alt="Bea.var, the Hack the Hill Mascot" />
		</div>
	);
}

export default About;
