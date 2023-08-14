import React from "react";
import { t } from "../../i18n";
import styles from "./Schedule.module.css";

function Schedule() {
	return (
		<div id="schedule" className={styles["schedule"]}>
			<div className={styles["schedule-content"]}>
				<div className={styles["schedule-title"]} align="left">
					{t("schedule.title")}
				</div>
				<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
				<div className={styles["schedule-box"]}>
					<div id="eventStack" className={styles["event-stack"]}>
						<div className={styles["event-container"]}>
							<div className={styles["center"]}>
								<div className={styles["event-card"]}>
									<div className={styles["event-card-content"]}>
										<div className={styles["event-month"]}>{t("schedule.event1.month")}</div>
										<div className={styles["event-day"]}>16</div>
									</div>
								</div>
							</div>
							<div className={styles["event-details"]}>
								<div className={styles["event-title"]}>
									{t("schedule.event1.title")}
									<button
										className={styles["event-btn"]}
										target="_blank"
										href="https://youtu.be/zpixm4xz_K4"
									>
										<p className={styles["button-text"]}>{t("schedule.event1.status")}</p>
									</button>
								</div>
								<div className={styles["sub-title"]}>{t("schedule.event1.time")}</div>
								<p className={styles["event-desc"]}>{t("schedule.event1.description")}</p>
							</div>
						</div>

						<div className={styles["event-container"]}>
							<div className={styles["center"]}>
								<div className={styles["event-card"]}>
									<div className={styles["event-card-content"]}>
										<div className={styles["event-month"]}>{t("schedule.event2.month")}</div>
										<div className={styles["event-day"]}>30</div>
									</div>
								</div>
							</div>
							<div className={styles["event-details"]}>
								<div className={styles["event-title"]}>
									{t("schedule.event2.title")}
									<button
										className={styles["event-btn"]}
										disabled
										target="_blank"
										href="https://forms.gle/WUgn5g8XTjNf9Eq39"
									>
										<p className={styles["button-text"]}>{t("schedule.event2.status")}</p>
									</button>
								</div>
								<div className={styles["sub-title"]}>{t("schedule.event2.time")}</div>
								<p className={styles["event-desc"]} align="left">
									{t("schedule.event2.description")}
								</p>
							</div>
						</div>

						<div className={styles["event-container"]}>
							<div className={styles["center"]}>
								<div className={styles["event-card"]}>
									<div className={styles["event-card-content"]}>
										<div className={styles["event-month"]}>{t("schedule.event3.month")}</div>
										<div className={styles["event-day"]}>11</div>
									</div>
								</div>
							</div>
							<div className={styles["event-details"]}>
								<div className={styles["event-title"]}>
									{t("schedule.event3.title")}
									<button className={styles["event-btn"]} disabled>
										<p className={styles["button-text"]}>{t("schedule.event3.status")}</p>
									</button>
								</div>
								<div className={styles["sub-title"]}>{t("schedule.event3.time")}</div>
								<p className={styles["event-desc"]} align="left">
									{t("schedule.event3.description")}
								</p>
							</div>
						</div>

						<div className={styles["event-container"]}>
							<div className={styles["center"]}>
								<div className={styles["event-card"]}>
									<div className={styles["event-card-content"]}>
										<div className={styles["event-month"]}>{t("schedule.event4.month")}</div>
										<div className={styles["event-day"]}>25</div>
									</div>
								</div>
							</div>
							<div className={styles["event-details"]}>
								<div className={styles["event-title"]}>
									{t("schedule.event4.title")}
									<button
										className={styles["event-btn"]}
										href="https://youtu.be/mbr4ZmXtx0k"
										target={"_blank"}
									>
										<p className={styles["button-text"]}>{t("schedule.event4.status")}</p>
									</button>
								</div>
								<div className={styles["sub-title"]}>{t("schedule.event4.time")}</div>
								<p className={styles["event-desc"]} align="left">
									{t("schedule.event4.description")}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Schedule;
