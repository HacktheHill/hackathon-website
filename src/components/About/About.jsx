import React, { useEffect } from "react";
import { t } from "../../i18n";
import styles from "./About.module.css";
import rightLeaves from "/SVGs/About/right-leaves.svg";
import "../../global.css";

//animations
import AOS from "aos";
import "aos/dist/aos.css";

function About() {
	const videoLink = "https://www.youtube.com/embed/yDNJC2-lUWE?si=VAD1Na8xGVwE9i5W";
	const thumbnailLink = "https://i.ytimg.com/vi/yDNJC2-lUWE/hqdefault.jpg";

	useEffect(() => {
		AOS.init({});
	}, []);

	return (
		<div className={styles.about} id="about">
			<div className={styles["about-text"]}>
				<h1 data-aos="fade-right" data-aos-duration="800" className={styles.title}>
					{t("about.title")}
				</h1>
				<p data-aos="fade-right" data-aos-duration="800">
					{t("about.p1")}
				</p>
				<p data-aos="fade-right" data-aos-duration="800">
					{t("about.p2")}
				</p>
				<p data-aos="fade-right" data-aos-duration="800">
					{t("about.p3")}
				</p>
			</div>
			<div className={styles.frame} data-aos="fade-left" data-aos-duration="800">
				<iframe
					src={videoLink}
					title={t("about.title")}
					srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:3.5rem/1.5 sans-serif;color:#FFFFFF;text-shadow:0 0 0.5em black}</style><a href=${videoLink}><img src=${thumbnailLink} alt=${t(
						"about.frame_alt",
					)}><span>▶</span></a>`}
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
