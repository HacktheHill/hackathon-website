import React from "react";
import { t } from "../../i18n";
import styles from "./Stats.module.css";

function Stats() {
	return (
		<div className={styles.stats} id="stats">
			<div className={styles["stats-text"]}>
				<h1>{t("stats.title")}</h1>
				<div className={styles["stats-container"]}>
					<div className={styles["stats-item"]}>
						<h2>{t("stats.p1")}</h2>
						<p>{t("stats.p1tag")}</p>
					</div>
					<div className={styles["stats-item"]}>
						<h2>{t("stats.p2")}</h2>
						<p>{t("stats.p2tag")}</p>
					</div>
					<div className={styles["stats-item"]}>
						<h2>{t("stats.p3")}</h2>
						<p>{t("stats.p3tag")}</p>
					</div>
					<div className={styles["stats-item"]}>
						<h2>{t("stats.p4")}</h2>
						<p>{t("stats.p4tag")}</p>
					</div>
					<div className={styles["stats-item"]}>
						<h2>{t("stats.p5")}</h2>
						<p>{t("stats.p5tag")}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Stats;
