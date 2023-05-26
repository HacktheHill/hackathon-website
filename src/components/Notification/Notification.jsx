import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { t } from "../../i18n";

import styles from "./Notification.module.css";

function Notification() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setVisible(true);
		}, 1000);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	return (
		<div
			id="notification"
			className={ styles.notification}
			style={{
				transform: visible ? "translateY(0)" : "translateY(100%) scaleY(0)",
			}}
			aria-hidden={!visible}
		>
			<div className={styles.notificationContent}>
				<p>{t("notification.message")}</p>
				<Button
					href="https://thefulcrum.ca/sciencetech/u-of-o-hackathon-hosted-by-hack-the-hill/"
					target="_blank"
				>
					{t("notification.button_text")}
				</Button>
			</div>
			<button className={styles.notification.closeButton} title={t("notification.close")} onClick={() => setVisible(false)}>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<title>{t("notification.close")}</title>
					<path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</button>
		</div>
	);
}

export default Notification;
