import { t } from "@/i18n";
import styles from "./About.module.css";

import leftLeaves from "@/assets/SVGs/About/left-leaves.svg?url";
import rightLeaves from "@/assets/SVGs/About/right-leaves.svg?url";
import "@/global.css";

const videoLink = "https://www.youtube.com/embed/yDNJC2-lUWE?si=VAD1Na8xGVwE9i5W";
const thumbnailLink = "https://i.ytimg.com/vi/yDNJC2-lUWE/hqdefault.jpg";

export function AboutVideo() {
	return (
		<iframe
			className={styles.video}
			src={videoLink}
			title={t("about.frame_alt")}
			srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}span{position:absolute;inset:0;display:grid;place-items:center;font:3.5rem sans-serif;color:#fff3b6;text-shadow:0 0 0.5em black}</style><a href=${videoLink}><img src=${thumbnailLink} alt="${t(
				"about.frame_alt",
			)}"><span>▶</span></a>`}
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowFullScreen
			loading="lazy"
		/>
	);
}

function About() {
	return (
		<section className={styles.about} id="about" aria-labelledby="about-title">
			<div className={styles["about-text"]}>
				<h2 id="about-title" className="section-heading" data-aos="fade-right" data-aos-duration="800">
					{t("about.title")}
				</h2>
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
				<img className={styles["left-leaves"]} src={leftLeaves} alt="" />
				<img className={styles["right-leaves"]} src={rightLeaves} alt="" />
			</div>
		</section>
	);
}

export default About;
