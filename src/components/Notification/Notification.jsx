import { useEffect, useState } from "react";
import Button from "../Button/Button";
import "./Notification.css";
import { useTranslation, Trans } from "react-i18next";
import "../Localization/i18n";

function Notification() {
	const [visible, setVisible] = useState(false);
	const { t, i18n } = useTranslation();

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
			className="notification"
			style={{
				transform: visible ? "translateY(0)" : "translateY(100%) scaleY(0)",
			}}
			aria-hidden={!visible}
		>
			<div className="notification-content">
				<p>
					Did you hear about the Fulcrum Article about Hack the Hill? UOTTA GO TO HACK THE HILL. Check out the
					"Science & Tech" Section of the Fulcrum and look for "Ready, Set, Hack" to learn more about what you
					can expect at Hack the Hill from some of our event directors. Thank you to Fulcrum for the post!
				</p>
				<Button
					href="https://thefulcrum.ca/sciencetech/u-of-o-hackathon-hosted-by-hack-the-hill/"
					target="_blank"
				>
					Read the Article
				</Button>
			</div>
			<button
				className="close-button"
				aria-label="Close Notification"
				title="Close Notification"
				onClick={() => setVisible(false)}
			>
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
