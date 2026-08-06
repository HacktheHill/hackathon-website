import { t } from "@/i18n";
import styles from "./Landing2026.module.css";

function About() {
	const paragraphs = t("landing2026.about.paragraphs");
	const mediaLabel = t("landing2026.about.mediaPlaceholder");

	return (
		<section id="about" className={styles.section} aria-labelledby="landing-2026-about-title">
			<div className={styles.aboutGrid}>
				<div className={styles.copy} data-scroll-reveal="right" data-reveal-order="0">
					<p className={styles.eyebrow}>{t("landing2026.eyebrow")}</p>
					<h2 id="landing-2026-about-title">{t("landing2026.about.title")}</h2>
					{paragraphs.map(paragraph => (
						<p key={paragraph}>{paragraph}</p>
					))}
				</div>
				<div
					className={styles.mediaPlaceholder}
					role="img"
					aria-label={mediaLabel}
					data-scroll-reveal="left"
					data-reveal-order="1"
				>
					<span>{mediaLabel}</span>
				</div>
			</div>
		</section>
	);
}

export default About;
