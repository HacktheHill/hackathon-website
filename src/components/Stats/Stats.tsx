import { t } from "@/i18n";
import styles from "./Stats.module.css";

function Stats() {
	return (
		<section className={styles.stats} id="stats" aria-labelledby="stats-title">
			<h2 id="stats-title" className={styles.title}>
				{t("stats.title")}
			</h2>

			<div className={styles.signs}>
				<div className={`${styles.sign} ${styles.blue}`}>
					<img src="/art/scene/stats-sign-blue.webp" alt="" aria-hidden="true" />
					<div className={`${styles.copy} ${styles["blue-copy"]}`}>
						<div className={styles["blue-row"]}>
							<strong>{t("stats.p1")}</strong>
							<span>{t("stats.p1tag")}</span>
						</div>
						<div className={styles["blue-row"]}>
							<strong>{t("stats.p2")}</strong>
							<span>{t("stats.p2tag")}</span>
						</div>
					</div>
				</div>

				<div className={`${styles.sign} ${styles.organizers}`}>
					<img src="/art/scene/stats-sign-organizers.webp" alt="" aria-hidden="true" />
					<div className={`${styles.copy} ${styles["organizers-copy"]}`}>
						<strong>{t("stats.p5")}</strong>
						<span>{t("stats.p5tag")}</span>
					</div>
				</div>

				<div className={`${styles.sign} ${styles.green}`}>
					<img src="/art/scene/stats-sign-green.webp" alt="" aria-hidden="true" />
					<div className={`${styles.copy} ${styles["green-copy"]}`}>
						<div className={styles["green-top"]}>
							<strong>{t("stats.p3")}</strong>
							<span>{t("stats.p3tag")}</span>
						</div>
						<div className={styles["green-bottom"]}>
							<strong>{t("stats.p4")}</strong>
							<span>{t("stats.p4tag")}</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
export default Stats;
