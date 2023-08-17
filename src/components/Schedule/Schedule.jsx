import React from "react";
import { t } from "../../i18n";
import styles from "./Schedule.module.css";

function Schedule() {

	const eventsObject = t('schedule.events');
	const eventsArray = Object.values(eventsObject);

  return (
    <div id="schedule" className={styles["schedule"]}>
	<div className={styles["schedule-title"]}>{t("schedule.title")}</div>

	<div className={styles["schedule-list"]}>
    	{eventsArray.map((event) => (
		
        <div className={styles["schedule-list-item"]}>
          <div className={styles["event-card"]}>
            <div className={styles["event-month"]}>{event.month}</div>
            <div className={styles["event-day"]}>{event.day}</div>
          </div>
          <section className={styles["event-details"]}>
            <div className={styles["event-heading"]}>
              <h1 className={styles["event-title"]}>{event.title}</h1>

			  {event.btn_Status === "" ? (
                <a
                  className={styles["event-button"]}
                  target="_blank"
                  rel="noreferrer"
                  href={event.link}
                >
                  {event.status}
                </a>
              ) : (
                <a className={styles["event-button-disabled"]}>{event.status}</a>
              )}
            </div>
            <div className={styles["sub-title"]}>{event.time}</div>
            <p className={styles["event-description"]}>{event.description}</p>
          </section>
		  </div>
      ))}
	  </div>
    </div>
  );
}

export default Schedule;
