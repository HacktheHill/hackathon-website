import { locale, useTranslations } from "@/i18n";
import { useStore } from "@nanostores/react";
import Button from "../Button/Button";
import styles from "./Sponsors.module.css";
import { SNOWBANKS, VISIBLE_SPONSOR_ROWS, sponsorData as data } from "./sponsorData";

function Sponsors() {
	const t = useTranslations();
	const currentLocale = useStore(locale);

	return (
		<>
			<section
				id="sponsors"
				className={`${styles["sponsors-collaborators"]} ${styles["sponsors"]}`}
				aria-labelledby="sponsors-title"
			>
				<h2 id="sponsors-title" className="section-heading" data-aos="fade-up" data-aos-duration="800">
					{t("sponsors.title")}
				</h2>
				<div className={styles.header}>
					<div className={styles["header-column"]}>
						<p className={styles.text} data-aos="fade-up" data-aos-duration="800">
							{t("sponsors.p")}
						</p>
						<div className={styles["sponsor-cta-container"]} data-aos="fade-up" data-aos-duration="800">
							<Button className={styles["sponsor-cta"]} href="mailto:sponsorship@hackthehill.com">
								{t("sponsors.button")}
							</Button>
						</div>
					</div>
				</div>

				<div className={styles["icons"]}>
					{VISIBLE_SPONSOR_ROWS.map((tiers, rowIndex) => (
						<div
							key={tiers.join("-")}
							className={styles["sponsor-tier-row"]}
							data-sponsor-tier-row={tiers.join(" ")}
						>
							{tiers
								.flatMap(tier => data.sponsors[tier].map(sponsor => ({ sponsor, tier })))
								.map(({ sponsor, tier }, index) => (
									<a
										key={sponsor.href}
										href={sponsor.href}
										target="_blank"
										rel="noreferrer"
										data-sponsor-card
										data-sponsor-tier={tier}
										className={styles["sponsor-card"]}
										data-aos="fade-up"
										data-aos-duration="800"
									>
										<img
											className={styles.snowbank}
											src={SNOWBANKS[(rowIndex + index) % SNOWBANKS.length]}
											alt=""
											aria-hidden="true"
											loading="lazy"
											decoding="async"
										/>
										<img
											className={styles.icon}
											alt={
												currentLocale === "fr"
													? `Logo de ${sponsor.alt}`
													: `${sponsor.alt} logo`
											}
											src={sponsor.src}
											loading="lazy"
											decoding="async"
										/>
									</a>
								))}
						</div>
					))}
				</div>
			</section>
			<section
				id="collaborators"
				className={`${styles["sponsors-collaborators"]} ${styles["collaborators"]}`}
				aria-labelledby="collaborators-title"
			>
				<h2 id="collaborators-title" className="section-heading" data-aos="fade-up" data-aos-duration="800">
					{t("collaborators.title")}
				</h2>
				<div className={`${styles["icons-row"]} ${styles["collaborator-icons"]}`}>
					{data.collaborators.map((sponsor, i) => (
						<a
							key={i}
							href={sponsor.href}
							target="_blank"
							rel="noreferrer"
							className={styles["collaborator-card"]}
							data-aos="fade-up"
							data-aos-duration="800"
						>
							<img
								className={`${styles["icon"]} ${styles["icon-medium"]}`}
								alt={currentLocale === "fr" ? `Logo de ${sponsor.alt}` : `${sponsor.alt} logo`}
								src={sponsor.src}
								loading="lazy"
								decoding="async"
							></img>
						</a>
					))}
				</div>
			</section>
		</>
	);
}

export default Sponsors;
