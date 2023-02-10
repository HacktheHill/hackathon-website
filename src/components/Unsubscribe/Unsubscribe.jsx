import { useEffect, useRef } from "react";
import "./Unsubscribe.module.css";
import logo from "/Logos/hackthehill-logo.svg";

function Unsubscribe() {
	const message = useRef(null);
	const button = useRef(null);
	const email = new URLSearchParams(window.location.search).get("email");

	useEffect(() => {
		message.current.textContent = `Are you sure you want to unsubscribe from email notifications for ${email}?`;
		if (!email) {
			message.current.textContent = "No email address provided";
			button.current.textContent = "Go to Hack the Hill";
			button.current.type = "button";
			button.current.disabled = false;
		}
	});

	async function handleSubmit(event) {
		event.preventDefault();

		message.current.textContent = "";
		button.current.textContent = "Unsubscribing...";
		button.current.disabled = true;

		try {
			const response = await fetch(`https://hackthehill.arcanist.workers.dev/unsubscribe?email=${email}`);
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
				<img src={logo} alt="Hack the Hill logo" />
				<h1>Hack the Hill</h1>
				<p ref={message} />
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
