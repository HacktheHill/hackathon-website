import React from "react";
import { t } from "../../i18n";
import Mascot from "/SVGs/mascot-waving.svg";
import styles from "./About.module.css";

function About() {
	return (
		<div className={styles.about} id={styles.about}>
			<div className={styles.aboutText}>
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
			<img className={styles.mascot} src={Mascot} alt={t("about.img_alt")} />
		</div>
	);
}

export default About;
