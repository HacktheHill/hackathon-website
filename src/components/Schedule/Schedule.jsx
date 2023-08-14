import React from "react";
import { t } from "../../i18n";
import styles from "./Schedule.module.css";

function Schedule() {
	return (
		<div id="schedule" className={styles["schedule"]}>
			<div className={styles["schedule-title"]}>{t("schedule.title")}</div>
			<div className={styles["schedule-list"]}>
				<div className={styles["event-card"]}>
					<div className={styles["event-month"]}>{t("schedule.event1.month")}</div>
					<div className={styles["event-day"]}>16</div>
				</div>
				<section className={styles["event-details"]}>
					<div className={styles["event-heading"]}>
						<h1 className={styles["event-title"]}>{t("schedule.event1.title")}</h1>
						<button
							className={styles["event-button"]}
							target="_blank"
							rel="noreferrer"
							href="https://youtu.be/zpixm4xz_K4"
						>
							{t("schedule.event1.status")}
						</button>
					</div>
					<div className={styles["sub-title"]}>{t("schedule.event1.time")}</div>
					<p className={styles["event-description"]}>{t("schedule.event1.description")}</p>
				</section>

				<div className={styles["event-card"]}>
					<div className={styles["event-month"]}>{t("schedule.event2.month")}</div>
					<div className={styles["event-day"]}>30</div>
				</div>
				<section className={styles["event-details"]}>
					<div className={styles["event-heading"]}>
						<h1 className={styles["event-title"]}>{t("schedule.event2.title")}</h1>
						<button
							className={styles["event-button"]}
							disabled
							target="_blank"
							href="https://forms.gle/WUgn5g8XTjNf9Eq39"
						>
							{t("schedule.event2.status")}
						</button>
					</div>
					<div className={styles["sub-title"]}>{t("schedule.event2.time")}</div>
					<p className={styles["event-description"]}>{t("schedule.event2.description")}</p>
				</section>

				<div className={styles["event-card"]}>
					<div className={styles["event-month"]}>{t("schedule.event3.month")}</div>
					<div className={styles["event-day"]}>11</div>
				</div>
				<section className={styles["event-details"]}>
					<div className={styles["event-heading"]}>
						<h1 className={styles["event-title"]}>{t("schedule.event3.title")}</h1>
						<button className={styles["event-button"]} disabled>
							{t("schedule.event3.status")}
						</button>
					</div>
					<div className={styles["sub-title"]}>{t("schedule.event3.time")}</div>
					<p className={styles["event-description"]}>{t("schedule.event3.description")}</p>
				</section>

				<div className={styles["event-card"]}>
					<div className={styles["event-month"]}>{t("schedule.event4.month")}</div>
					<div className={styles["event-day"]}>25</div>
				</div>
				<section className={styles["event-details"]}>
					<div className={styles["event-heading"]}>
						<h1 className={styles["event-title"]}>{t("schedule.event4.title")}</h1>
						<button
							className={styles["event-button"]}
							href="https://youtu.be/mbr4ZmXtx0k"
							target={"_blank"}
						>
							{t("schedule.event4.status")}
						</button>
					</div>
					<div className={styles["sub-title"]}>{t("schedule.event4.time")}</div>
					<p className={styles["event-description"]}>{t("schedule.event4.description")}</p>
				</section>
			</div>
		</div>
	);
}

export default Schedule;
