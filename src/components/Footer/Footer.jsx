import { faFacebook, faGithub, faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import React from "react";
import { t } from "../../i18n";
import FooterLogo from "/Logos/hackthehill-banner.svg";
import styles from "./Footer.module.css";

function Footer() {
	return (
		<div className={styles.footer}>
			<div className={styles.footerLogo}>
				<img src={FooterLogo} alt="Logo" />
			</div>
			<p className={styles.logoText}>{t("footer.title")}</p>
			<div className={styles.footerContainer}>
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
			</div>
			<div className={styles["footer-text"]}>
				<p>{t("footer.description")}</p>
				<a
					href="https://github.com/HacktheHill/2023.hackthehill.com"
					target="_blank"
					rel="noreferrer"
					aria-label="GitHub"
					className={styles["footer-link"]}
				>
					<Icon icon={faGithub} />
					{t("footer.github")}
				</a>
				<small>&copy; 2022-2023 Hack the Hill</small>
			</div>
		</div>
	);
}

export default Footer;