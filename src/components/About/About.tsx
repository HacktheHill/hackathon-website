import { useTranslations } from "@/i18n";
import styles from "./About.module.css";
import { recapEmbedUrl, recapThumbnailUrl } from "./recapVideo";

import "@/global.css";

export function AboutVideo() {
	const t = useTranslations();
	return (
		<iframe
			className={styles.video}
			src={recapEmbedUrl}
			title={t("about.frame_alt")}
			srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}a{position:absolute;inset:0}a:focus-visible{outline:3px solid #fff3b6;outline-offset:-3px}img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}span{position:absolute;inset:0;display:grid;place-items:center;font:3.5rem sans-serif;color:#fff3b6;text-shadow:0 0 0.5em black}</style><a href="${recapEmbedUrl}"><img src="${recapThumbnailUrl}" alt="${t(
				"about.frame_alt",
			)}"><span aria-hidden="true">▶</span></a>`}
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowFullScreen
			loading="lazy"
		/>
	);
}

function About() {
	const t = useTranslations();
	return (
		<section id="about" aria-labelledby="about-title">
			<div className={styles["about-text"]}>
				<h2
					id="about-title"
					className="section-heading"
					aria-label={t("about.title").replaceAll(/&nbsp;/g, " ")}
					data-aos="fade-right"
					data-aos-duration="800"
					dangerouslySetInnerHTML={{ __html: t("about.title") }}
				></h2>
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
		</section>
	);
}

export default About;
