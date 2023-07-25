import { faFacebook, faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Link } from "react-scroll";
import { t } from "../../i18n";
import styles from "./Sidebar.module.css";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
	const links = [
		{
			to: "about",
			offset: -30,
			text: t("navbar.links.about"),
		},
		{
			to: "sponsors",
			offset: -30,
			text: t("navbar.links.sponsors"),
		},
		{
			to: "schedule",
			offset: 0,
			text: t("navbar.links.hacker"),
		},
		{
			to: "collaborators",
			offset: -30,
			text: t("navbar.links.collaborators"),
		},
		{
			to: "faq",
			offset: -30,
			text: t("navbar.links.faq"),
		},
	];

	const media = [
		{
			link: "https://www.facebook.com/canadascapitalhackathon",
			icon: faFacebook,
			label: "Facebook",
		},
		{
			link: "https://twitter.com/hackthehill_",
			icon: faTwitter,
			label: "Twitter",
		},
		{
			link: "https://www.instagram.com/hackthehill/",
			icon: faInstagram,
			label: "Instagram",
		},
		{
			link: "https://www.tiktok.com/@hackthehill",
			icon: faTiktok,
			label: "TikTok",
		},
		{
			link: "https://www.linkedin.com/company/hackthehill/",
			icon: faLinkedin,
			label: "LinkedIn",
		},
	];

	useEffect(() => {
		const listener = window.addEventListener("resize", () => {
			if (window.innerWidth > 940) {
				setSidebarOpen(false);
			}
		});

		return () => {
			window.removeEventListener("resize", listener);
		};
	});

	useEffect(() => {
		document.documentElement.style.overflow = sidebarOpen ? "hidden" : "auto";
	}, [sidebarOpen]);

	return (
		<>
			<nav className={`${styles.sidebar} ${sidebarOpen ? styles["sidebar-open"] : ""}`}>
				<ul className={styles.links}>
					{links.map(link => (
						<li key={link.text}>
							<Link
								to={link.to}
								spy={true}
								smooth={true}
								offset={link.offset}
								duration={500}
								href={`#${link.to}`}
								onClick={() => setSidebarOpen(!sidebarOpen)}
							>
								{link.text}
							</Link>
						</li>
					))}
				</ul>
				<ul className={styles.media}>
					{media.map(link => (
						<li key={link.link}>
							<a href={link.link} target="_blank" rel="noreferrer" aria-label={link.label}>
								<Icon icon={link.icon} size="2x" />
							</a>
						</li>
					))}
				</ul>
			</nav>
		</>
	);
};

export default Sidebar;
