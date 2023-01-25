import { useEffect, useState } from "react";
import "./Notification.css";

const contents = `Calling all aspiring game developers! Get ready to level up your game development skills at the Got Games introduction to Unity workshop! Join us on January 25th from 7pm to 9pm in STM117 and on Twitch.`;

const action = () => {
	window.open("https://forms.gle/rMP4BLrkQvaKBkpA8", "_blank");
};

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
			id="Notification"
			className="Notification"
			style={{
				transform: visible ? "translateY(0)" : "translateY(100%)",
			}}
			aria-hidden={!visible}
			onClick={action}
		>
			{contents}
			<button
				className="CloseButton"
				aria-label="Close Notification"
				title="Close Notification"
				onClick={() => setVisible(false)}
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<title>Close Notification</title>
					<path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</button>
		</div>
	);
}

export default Notification;
