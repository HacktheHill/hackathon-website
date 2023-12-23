import { faFacebook, faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import React from "react";
import { t } from "../../i18n";
import styles from "./Footer.module.css";
import TeamCarousel from "../Footer/TeamCarousel";

function Footer() {
	return (
		<>
			{/* <TeamCarousel/> */}
			<div className={styles.footer}>
				<div className={styles["footer-links"]}>
					<a
						href="https://cdn1.hackthehill.com/legal/constitution.pdf"
						target="_blank"
						rel="noreferrer"
						aria-label="Constitution"
					>
						{t("footer.constitution")}
					</a>
					<a
						href="https://cdn1.hackthehill.com/legal/privacy-policy.pdf"
						target="_blank"
						rel="noreferrer"
						aria-label="Privacy Policy"
					>
						{t("footer.privacy")}
					</a>
				</div>
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
				<small className={styles["copyright"]}>{t("footer.copyright")}</small>
			</div>
		</>
	);
}

export default Footer;
