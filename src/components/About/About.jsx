import React from "react";
import { t } from "../../i18n";
import styles from "./About.module.css";
import leftLeaves from "/SVGs/2024/about-stats/left-leaves.svg";
import rightLeaves from "/SVGs/2024/about-stats/right-leaves.svg";

function About() {
	return (
		<div className={styles.about} id="about">
			<div className={styles["about-text"]}>
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
			<div className={styles.frame}>
				<img className={styles["left-leaves"]} src={leftLeaves} alt="left-leaves" />
				<iframe
					src="https://www.youtube.com/embed/AiFOe3R3sWU?si=JEUvfaxf8jKG7uh0&controls=0&autoplay=1&loop=1&mute=1"
					title={t("about.title")}
					allow="accelerometer; autoplay;
				clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				></iframe>
				<img className={styles["right-leaves"]} src={rightLeaves} alt="right-leaves" />
			</div>
		</div>
	);
}

export default About;
