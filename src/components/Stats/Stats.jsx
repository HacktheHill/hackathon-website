import React, { useEffect } from "react";
import { t } from "../../i18n";
import styles from "./Stats.module.css";

//animations
import AOS from "aos";
import "aos/dist/aos.css";

function Stats() {
	useEffect(() => {
		AOS.init({});
	}, []);

	return (
		<div className={styles.stats} id="stats">
			<div className={styles["stats-text"]}>
				<h1 data-aos="fade-up" data-aos-duration="800">
					{t("stats.title")}
				</h1>
				<div className={styles["stats-container"]}>
					<div className={styles["stats-item"]} data-aos="zoom-in" data-aos-duration="800">
						<h2>{t("stats.p1")}</h2>
						<p>{t("stats.p1tag")}</p>
					</div>
					<div
						className={styles["stats-item"]}
						data-aos="zoom-in"
						data-aos-duration="800"
						data-aos-delay="100"
					>
						<h2>{t("stats.p2")}</h2>
						<p>{t("stats.p2tag")}</p>
					</div>
					<div
						className={styles["stats-item"]}
						data-aos="zoom-in"
						data-aos-duration="800"
						data-aos-delay="200"
					>
						<h2>{t("stats.p3")}</h2>
						<p>{t("stats.p3tag")}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Stats;
