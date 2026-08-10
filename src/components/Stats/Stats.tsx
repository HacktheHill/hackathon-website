import { t } from "@/i18n";
import styles from "./Stats.module.css";

function Stats() {
	return (
		<section className={styles.stats} id="stats" aria-labelledby="stats-title">
			<div className={styles["stats-text"]}>
				<h2 id="stats-title" className="section-heading" data-aos="fade-up" data-aos-duration="800">
					{t("stats.title")}
				</h2>
				<div className={styles["stats-container"]}>
					<div className={styles["stats-item"]} data-aos="zoom-in" data-aos-duration="800">
						<strong className={styles["stats-value"]}>{t("stats.p1")}</strong>
						<p>{t("stats.p1tag")}</p>
					</div>
					<div
						className={styles["stats-item"]}
						data-aos="zoom-in"
						data-aos-duration="800"
						data-aos-delay="100"
					>
						<strong className={styles["stats-value"]}>{t("stats.p2")}</strong>
						<p>{t("stats.p2tag")}</p>
					</div>
					<div
						className={styles["stats-item"]}
						data-aos="zoom-in"
						data-aos-duration="800"
						data-aos-delay="200"
					>
						<strong className={styles["stats-value"]}>{t("stats.p3")}</strong>
						<p>{t("stats.p3tag")}</p>
					</div>
					<div
						className={styles["stats-item"]}
						data-aos="zoom-in"
						data-aos-duration="800"
						data-aos-delay="300"
					>
						<strong className={styles["stats-value"]}>{t("stats.p4")}</strong>
						<p>{t("stats.p4tag")}</p>
					</div>
				</div>
			</div>
		</section>
	);
}
export default Stats;
