import { type FormEvent, useRef, useState } from "react";

const SUBSCRIBE_ENDPOINT = "https://emails.hackthehill.com/subscribe";

type SubscriptionState = "idle" | "submitting" | "accepted" | "invalid" | "rate-limited" | "failed";

export function useSubscription() {
	const [email, setEmail] = useState("");
	const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>("idle");
	const submittingRef = useRef(false);

	const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (submittingRef.current) return;

		submittingRef.current = true;
		setSubscriptionState("submitting");
		try {
			const response = await fetch(SUBSCRIBE_ENDPOINT, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: email.trim(), consent: true }),
			});

			if (response.status === 202) {
				setSubscriptionState("accepted");
				return;
			}

			if (response.status === 400) {
				setSubscriptionState("invalid");
				return;
			}

			if (response.status === 429) {
				setSubscriptionState("rate-limited");
				return;
			}

			setSubscriptionState("failed");
		} catch {
			setSubscriptionState("failed");
		} finally {
			submittingRef.current = false;
		}
	};

	const updateEmail = (value: string) => {
		setEmail(value);
		if (subscriptionState !== "idle") setSubscriptionState("idle");
	};

	return { email, updateEmail, subscriptionState, handleSubscribe };
}
