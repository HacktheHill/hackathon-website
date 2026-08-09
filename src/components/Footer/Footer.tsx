import { faFacebook, faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { type FormEvent, useRef, useState } from "react";
import { t } from "@/i18n";
import styles from "./Footer.module.css";

const SUBSCRIBE_ENDPOINT = "https://emails.hackthehill.com/subscribe";

type SubscriptionState = "idle" | "submitting" | "accepted" | "invalid" | "rate-limited" | "failed";

function Footer() {
	const [email, setEmail] = useState("");
	const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>("idle");
	const submittingRef = useRef(false);

	const emailPlaceholder = t("footer.email_placeholder");
	const emailLabel = t("footer.email_label");
	const subscribeLabel = t("footer.subscribe");
	const sendingLabel = t("footer.sending");
	const thanksLabel = t("footer.thanks");
	const invalidEmailLabel = t("footer.invalid_email");
	const rateLimitedLabel = t("footer.rate_limited");
	const sendErrorLabel = t("footer.send_error");

	const isSubmitting = subscriptionState === "submitting";
	const errorLabel =
		subscriptionState === "invalid"
			? invalidEmailLabel
			: subscriptionState === "rate-limited"
			? rateLimitedLabel
			: subscriptionState === "failed"
			? sendErrorLabel
			: null;

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

	return (
		<footer className={styles.footer}>
			<hr className={styles["divider"]} />
			<div className={styles["media-links"]}>
				<a
					href="https://www.facebook.com/canadascapitalhackathon"
					target="_blank"
					rel="noreferrer"
					aria-label="Facebook"
				>
					<Icon icon={faFacebook} />
				</a>
				<a href="https://twitter.com/hackthehill_" target="_blank" rel="noreferrer" aria-label="Twitter">
					<Icon icon={faTwitter} />
				</a>
				<a
					href="https://www.instagram.com/hackthehill/"
					target="_blank"
					rel="noreferrer"
					aria-label="Instagram"
				>
					<Icon icon={faInstagram} />
				</a>
				<a href="https://www.tiktok.com/@hackthehill" target="_blank" rel="noreferrer" aria-label="TikTok">
					<Icon icon={faTiktok} />
				</a>
				<a
					href="https://www.linkedin.com/company/hackthehill/"
					target="_blank"
					rel="noreferrer"
					aria-label="LinkedIn"
				>
					<Icon icon={faLinkedin} />
				</a>
			</div>
			{subscriptionState === "accepted" ? (
				<output className={styles["subscribe-thanks"]} aria-live="polite" role="status">
					{thanksLabel}
				</output>
			) : (
				<form
					className={styles["subscribe-form"]}
					onSubmit={handleSubscribe}
					aria-busy={isSubmitting}
					aria-label={subscribeLabel}
				>
					<div className={styles["subscribe-controls"]}>
						<label className={styles["visually-hidden"]} htmlFor="footer-email">
							{emailLabel}
						</label>
						<input
							id="footer-email"
							name="email"
							className={styles["subscribe-input"]}
							type="email"
							required
							maxLength={254}
							autoComplete="email"
							inputMode="email"
							spellCheck={false}
							value={email}
							onChange={event => {
								setEmail(event.target.value);
								if (subscriptionState !== "idle") setSubscriptionState("idle");
							}}
							placeholder={emailPlaceholder}
							disabled={isSubmitting}
							aria-invalid={subscriptionState === "invalid"}
							aria-describedby={errorLabel ? "footer-email-error" : undefined}
						/>
						<button type="submit" className={styles["subscribe-button"]} disabled={isSubmitting}>
							{isSubmitting ? sendingLabel : subscribeLabel}
							{!isSubmitting && <Icon icon={faArrowRight} className={styles["subscribe-button-icon"]} />}
						</button>
					</div>
					{errorLabel && (
						<p id="footer-email-error" className={styles["subscribe-error"]} role="alert">
							{errorLabel}
						</p>
					)}
				</form>
			)}
			<p className={styles["legal"]}>
				<span>{t("footer.copyright")}</span>
				<span className={styles["legal-separator"]} aria-hidden="true">
					·
				</span>
				<a href="https://cdn1.hackthehill.com/legal/privacy-policy.pdf" target="_blank" rel="noreferrer">
					{t("footer.privacy")}
				</a>
			</p>
		</footer>
	);
}

export default Footer;
