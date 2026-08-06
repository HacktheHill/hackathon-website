import { t } from "@/i18n";
import styles from "./Landing2026.module.css";

function Sponsors() {
	const logoPlaceholders = t("landing2026.sponsors.logoPlaceholders");

	return (
		<section id="sponsors" className={styles.section} aria-labelledby="landing-2026-sponsors-title">
			<div className={styles.sectionHeading} data-scroll-reveal="up" data-reveal-order="0">
				<p className={styles.eyebrow}>{t("landing2026.eyebrow")}</p>
				<h2 id="landing-2026-sponsors-title">{t("landing2026.sponsors.title")}</h2>
				<p>{t("landing2026.sponsors.introduction")}</p>
			</div>

			<div className={styles.sponsorGrid}>
				{logoPlaceholders.map((label, index) => (
					<div
						className={styles.logoPlaceholder}
						role="img"
						aria-label={label}
						key={label}
						data-scroll-reveal="up"
						data-reveal-order={index}
					>
						<span>{label}</span>
					</div>
				))}
			</div>
		</section>
	);
}

export default Sponsors;
