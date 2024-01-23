import { useEffect, useState } from "react";
import { t } from "../../i18n";
import Button from "../Button/Button";
import styles from "./Schedule.module.css";

function Schedule() {
	const events = t("schedule.events");

	return (
		<div id="schedule" className={styles["schedule"]}>
			<h1>{t("schedule.title")}</h1>
			<div className={styles["schedule-list"]}>
				{events.map((event, index) => (
					<div className={styles["schedule-list-item"]} key={index}>
						<Clouds />
						<div className={styles["event-card"]}>
							<div className={styles["event-month"]}>{event.month}</div>
							<div className={styles["event-day"]}>{event.day}</div>
						</div>
						<section className={styles["event-details"]}>
							<div className={styles["event-header"]}>
								<div className={styles["event-heading"]}>
									<h2 className={styles["event-title"]}>{event.title}</h2>
									<h4 className={styles["sub-title"]}>{event.time}</h4>
								</div>
								{event.disabled ? (
									<Button disabled href={event.link}>
										{event.status}
									</Button>
								) : (
									<Button href={event.link} target="_blank">
										{event.status}
									</Button>
								)}
							</div>
							<p className={styles["event-description"]}>{event.description}</p>
						</section>
					</div>
				))}
			</div>
			<img className={styles["sun"]} src="/SVGs/Schedule/sun.svg" alt="sun"></img>
		</div>
	);
}

function Clouds() {
	const [count, setCount] = useState(0);
	const [style, setStyle] = useState({});

	useEffect(() => {
		setCount(Math.floor(Math.random() * 3) + 1);
		setStyle({
			left: Math.random() * 150 - 50 + "%",
			top: Math.random() * 75 - 25 + "%",
			transform: `scale(${Math.random() * 0.75 + 0.25})`,
		});
	}, []);

	return new Array(count)
		.fill(0)
		.map((_, i) => (
			<img key={i} className={styles["cloud"]} src="/SVGs/Schedule/cloud.svg" alt="cloud" style={style}></img>
		));
}

export default Schedule;
