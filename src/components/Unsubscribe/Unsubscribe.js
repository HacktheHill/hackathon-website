import { useRef, useState } from "react";
import { useQuery } from "../PageRouter/PageRouter";
import "./Unsubscribe.css";

function Unsubscribe() {
	document.title = "Unsubscribe | Hack the Hill";

	const query = useQuery();

	const [hidden, setHidden] = useState(false);

	const message = useRef(null);
	const button = useRef(null);

	async function handleSubmit(event) {
		event.preventDefault();

		message.current.textContent = "";
		button.current.textContent = "Unsubscribing...";
		button.current.disabled = true;
		setHidden(true);

		const email = query.get("email") || event.target.email.value;

		try {
			const response = await fetch(`https://hackthehill.arcanist.workers.dev//unsubscribe?email=${email}`);
			if (!response.ok) {
				throw new Error(response.statusText);
			}
			message.current.textContent = "You have been unsubscribed from email notifications";
		} catch (error) {
			message.current.textContent = "An error occurred while unsubscribing";
		}
		button.current.textContent = "Go to Hack the Hill";
		button.current.type = "button";
		button.current.disabled = false;
	}

	return (
		<main>
			<form onSubmit={handleSubmit}>
				<img src="Logos\hthlogo_icon_ver.svg" alt="Hack the Hill logo" />
				<h1>Hack the Hill</h1>
				<p ref={message} />
				{!hidden && (
					<>
						<p>
							Are you sure you want to unsubscribe from email notifications
							{query.get("email") ? ` for ${query.get("email")}` : ""}?
						</p>
						{!query.get("email") && <input type="email" name="email" placeholder="Email" />}
					</>
				)}
				<a href="/">
					<button type="submit" ref={button}>
						Unsubscribe
					</button>
				</a>
			</form>
		</main>
	);
}

export default Unsubscribe;
