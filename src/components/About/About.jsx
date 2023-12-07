import React from "react";
import { t } from "../../i18n";
import styles from "./About.module.css";
import leftLeaves from "/SVGs/About/left-leaves.svg";
import rightLeaves from "/SVGs/About/right-leaves.svg";
import "../../global.css";

function About() {
	const podcastLink =
		"https://www.youtube.com/embed/videoseries?si=ZobjNMvDAoBIorPw&controls=0&list=PLvXySQVib-mmNoOeoORHRGz2UyeSEgj7Q&autoplay=0&loop=1&mute=0";
	const thumbnailLink = "https://img.youtube.com/vi/un8x-gcfQUw/hqdefault.jpg";

	return (
		<div className={styles.about} id="about">
			<div className={styles["about-text"]}>
				<h1>{t("about.title")}</h1>
				<p>{t("about.p1")}</p>
				<p>{t("about.p2")}</p>
				<p>{t("about.p3")}</p>
			</div>
			<div className={styles.frame}>
				<img className={styles["left-leaves"]} src={leftLeaves} alt="left-leaves" />
				<iframe
					src={podcastLink}
					title={t("about.title")}
					srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:3.5rem/1.5 sans-serif;color:#fff3b6;text-shadow:0 0 0.5em black}</style><a href=${podcastLink}><img src=${thumbnailLink} alt='Podcast'><span>▶</span></a>`}
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
					loading="lazy"
				></iframe>
				<img className={styles["right-leaves"]} src={rightLeaves} alt="right-leaves" />
			</div>
		</div>
	);
}

export default About;
