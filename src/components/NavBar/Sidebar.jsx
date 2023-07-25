import React, { useState } from "react";
import "./Sidebar.css";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { t } from "../../i18n";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
	const [isNavOpen, setIsNavOpen] = useState(false);
	const links = [
		{
			id: 1,
			to: "about",
			spy: true,
			smooth: true,
			offset: -30,
			duration: 500,
			text: t("navbar.links.about"),
			href: "#about",
		},
		{
			id: 2,
			to: "sponsors",
			spy: true,
			smooth: true,
			offset: -30,
			duration: 500,
			text: t("navbar.links.sponsors"),
			href: "#sponsors",
		},
		{
			id: 3,
			to: "schedule",
			spy: true,
			smooth: true,
			offset: 0,
			duration: 500,
			text: t("navbar.links.hacker"),
			href: "#schedule",
		},
		{
			id: 4,
			to: "collaborators",
			spy: true,
			smooth: true,
			offset: -30,
			duration: 500,
			text: t("navbar.links.collaborators"),
			href: "#collaborators",
		},
		{
			id: 5,
			to: "faq",
			spy: true,
			smooth: true,
			offset: -30,
			duration: 500,
			text: t("navbar.links.faq"),
			href: "#faq",
		},
	];

	useEffect(() => {
		document.body.style.overflow = isNavOpen ? "hidden" : "auto";
	}, [isNavOpen]);

	return (
		<>
			<div className={styles["icon-container"]}>
				<button
					className={` ${ styles["sidebar-icon"]} ${isNavOpen ?  styles["sidebar-change"] : null}`}
					onClick={() => setIsNavOpen(!isNavOpen)}
				>
					<div className={styles.bar1}></div>
        <div className={styles.bar2}></div>
        <div className={styles.bar3}></div>
				</button>
			</div>
			<div className={styles["sidebar-content"]}>
				<nav className={`${ styles.nav} ${isNavOpen ? styles["nav-open"] : styles["nav-closed"]}`}>
					<ul className={styles["nav-links"]}>
						{links.map(link => (
							<li className={styles.link} key={link.text}>
								<a
									href={`${link.href}`}
									onClick={() => setIsNavOpen(!isNavOpen)}
									style={{
										fontFamily: "Rubik",
										textAlign: "center",
										textDecoration: "none",
										color: "black",
									}}
								>
									{link.text}
								</a>
							</li>
						))}
					</ul>

					<div className={styles["media-links"]}>
						<a
							href="https://www.facebook.com/canadascapitalhackathon"
							target="_blank"
							rel="noreferrer"
							aria-label="Facebook"
						>
							<Icon icon={faFacebook} size="2x" />
						</a>
						<a
							href="https://twitter.com/hackthehill_"
							target="_blank"
							rel="noreferrer"
							aria-label="Twitter"
						>
							<Icon icon={faTwitter} size="2x" />
						</a>
						<a
							href="https://www.instagram.com/hackthehill/"
							target="_blank"
							rel="noreferrer"
							aria-label="Instagram"
						>
							<Icon icon={faInstagram} size="2x" />
						</a>
						<a
							href="https://www.tiktok.com/@hackthehill"
							target="_blank"
							rel="noreferrer"
							aria-label="TikTok"
						>
							<Icon icon={faTiktok} size="2x" />
						</a>
						<a
							href="https://www.linkedin.com/company/hackthehill/"
							target="_blank"
							rel="noreferrer"
							aria-label="LinkedIn"
						>
							<Icon icon={faLinkedin} size="2x" />
						</a>
					</div>
				</nav>
			</div>
		</>
	);
};

export default Sidebar;
