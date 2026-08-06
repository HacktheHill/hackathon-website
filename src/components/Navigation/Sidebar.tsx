import { faFacebook, faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef } from "react";
import { t } from "@/i18n";
import styles from "./Sidebar.module.css";

type SidebarProps = {
	sidebarOpen: boolean;
	setSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
	const firstLinkRef = useRef<HTMLAnchorElement>(null);
	const archiveLabel = t("landing2026.navigation.editionArchive");

	const links = [
		{
			to: "about",
			text: t("landing2026.navigation.links.about"),
		},
		{
			to: "winners",
			text: t("landing2026.navigation.links.winners"),
		},
		{
			to: "sponsors",
			text: t("landing2026.navigation.links.sponsors"),
		},
		{
			to: "faq",
			text: t("landing2026.navigation.links.faq"),
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
		const listener = () => {
			if (window.innerWidth > 940) {
				setSidebarOpen(false);
			}
		};

		window.addEventListener("resize", listener);

		return () => {
			window.removeEventListener("resize", listener);
		};
	}, [setSidebarOpen]);

	useEffect(() => {
		document.documentElement.style.overflowY = sidebarOpen ? "hidden" : "";

		return () => {
			document.documentElement.style.overflowY = "";
		};
	}, [sidebarOpen]);

	useEffect(() => {
		if (!sidebarOpen) return;
		const focusFrame = window.requestAnimationFrame(() => firstLinkRef.current?.focus());

		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;

			setSidebarOpen(false);
			window.requestAnimationFrame(() => document.getElementById("mobile-menu-toggle")?.focus());
		};

		window.addEventListener("keydown", closeOnEscape);
		return () => {
			window.cancelAnimationFrame(focusFrame);
			window.removeEventListener("keydown", closeOnEscape);
		};
	}, [setSidebarOpen, sidebarOpen]);

	return (
		<nav
			id="mobile-navigation"
			className={`${styles.sidebar} ${sidebarOpen ? styles["sidebar-open"] : ""}`}
			aria-label={t("landing2026.navigation.mobileAriaLabel")}
			aria-hidden={!sidebarOpen}
		>
			{sidebarOpen && (
				<div className={styles["menu-content"]}>
					<ul className={styles.links}>
						{links.map((link, index) => (
							<li key={link.text}>
								<a
									ref={index === 0 ? firstLinkRef : undefined}
									href={`#${link.to}`}
									onClick={() => setSidebarOpen(false)}
								>
									{link.text}
								</a>
							</li>
						))}
					</ul>
					<div className={styles["menu-footer"]}>
						<a
							className={styles["archive-link"]}
							href="https://2024.hackthehill.com"
							target="_blank"
							rel="noreferrer"
							aria-label={archiveLabel}
							onClick={() => setSidebarOpen(false)}
						>
							HtH II <span aria-hidden="true">↗</span>
						</a>
						<ul className={styles.media}>
							{media.map(link => (
								<li key={link.link}>
									<a
										href={link.link}
										target="_blank"
										rel="noreferrer"
										aria-label={link.label}
										onClick={() => setSidebarOpen(false)}
									>
										<Icon icon={link.icon} />
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</nav>
	);
};

export default Sidebar;
