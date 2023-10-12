import React from "react";
import { t } from "../../i18n";
import styles from "./About.module.css";
import frame from "/SVGs/2024/about-stats/frame.svg";

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
			<img className={styles.frame} src={frame} alt={t("about.img_alt")} />
		</div>
	);
}

export default About;
