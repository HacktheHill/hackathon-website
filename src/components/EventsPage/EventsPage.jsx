import { t } from "../../i18n";
import Navigation from "../Navigation/Navigation";
import Schedule from "../Schedule/Schedule";
import styles from "./EventsPage.module.css";

const EventsPage = () => {
	return (
		<>
			<Navigation />
			<header className={styles["header"]}>
				<h1 className={styles["title"]}>{t("events-page.title")}</h1>
				<p className={styles["description-text"]}>{t("events-page.description")}</p>
				<p className={styles["description-text"]}>{t("events-page.description2")}</p>
				<p className={styles["description-text"]}>{t("events-page.description3")}</p>
				<button className={styles["home-button"]}>
					<a href="/">
						{t("events-page.button.start")}
						<img src="/Logos/hackthehill-banner.svg" alt="Hack the Hill Logo" />
						{t("events-page.button.end")}
					</a>
				</button>
			</header>
			<Schedule />
		</>
	);
};

export default EventsPage;
