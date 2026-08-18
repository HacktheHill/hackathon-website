import { faFacebook, faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { useEffect, useRef } from "react";
import { t } from "@/i18n";
import styles from "./Sidebar.module.css";

type SidebarProps = {
	sidebarOpen: boolean;
	setSidebarOpen: Dispatch<SetStateAction<boolean>>;
	menuButtonRef: RefObject<HTMLButtonElement>;
};

const Sidebar = ({ sidebarOpen, setSidebarOpen, menuButtonRef }: SidebarProps) => {
	const sidebarRef = useRef<HTMLElement>(null);
	const links = [
		{
			href: "https://apply.hackthehill.com/",
			text: t("navbar.links.apply"),
		},
		{
			href: "#about",
			text: t("navbar.links.about"),
		},
		{
			href: "#testimonials",
			text: t("navbar.links.testimonials"),
		},
		{
			href: "#sponsors",
			text: t("navbar.links.sponsors"),
		},
		{
			href: "#collaborators",
			text: t("navbar.links.collaborators"),
		},
		{
			href: "#faq",
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
		const listener = () => {
			if (window.innerWidth > 940) {
				if (sidebarRef.current?.contains(document.activeElement)) {
					const homeLink = menuButtonRef.current
						?.closest("nav")
						?.querySelector<HTMLElement>("[data-navigation-home]");
					homeLink?.focus();
				}
				setSidebarOpen(false);
			}
		};

		window.addEventListener("resize", listener);

		return () => {
			window.removeEventListener("resize", listener);
		};
	}, [menuButtonRef, setSidebarOpen]);

	useEffect(() => {
		const sidebar = sidebarRef.current;
		if (!sidebar) return;

		sidebar.toggleAttribute("inert", !sidebarOpen);
		const navigation = sidebar.parentElement;
		const background = navigation
			? Array.from(navigation.parentElement?.children ?? []).filter(element => element !== navigation)
			: [];
		background.forEach(element => element.toggleAttribute("inert", sidebarOpen));
		document.documentElement.toggleAttribute("data-mobile-navigation-open", sidebarOpen);

		return () => {
			background.forEach(element => element.removeAttribute("inert"));
			document.documentElement.removeAttribute("data-mobile-navigation-open");
		};
	}, [sidebarOpen]);

	useEffect(() => {
		if (!sidebarOpen || !sidebarRef.current) return;

		const sidebar = sidebarRef.current;
		const navigation = sidebar.parentElement;
		const focusable = Array.from(
			(navigation ?? sidebar).querySelectorAll<HTMLElement>(
				'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
			),
		).filter(element => element.getClientRects().length > 0);
		const firstSidebarLink = sidebar.querySelector<HTMLElement>("a[href]");
		const focusFrame = window.requestAnimationFrame(() => firstSidebarLink?.focus());

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				setSidebarOpen(false);
				menuButtonRef.current?.focus();
				return;
			}

			if (event.key !== "Tab" || focusable.length === 0) return;

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			window.cancelAnimationFrame(focusFrame);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [menuButtonRef, setSidebarOpen, sidebarOpen]);

	// Unlike the fixed navbar on the desktop site, this navbar scrolls away with
	// the page, so refocusing the menu button after a link click would scroll
	// back to the top and cancel the navigation. Focus is only restored on Escape.
	const closeSidebar = () => {
		setSidebarOpen(false);
	};

	return (
		<nav
			ref={sidebarRef}
			id="mobile-navigation"
			className={`${styles.sidebar} ${sidebarOpen ? styles["sidebar-open"] : ""}`}
			aria-label={t("navbar.mobile_aria_label")}
			aria-hidden={!sidebarOpen}
		>
			<ul className={styles.links}>
				{links.map(link => (
					<li key={link.href}>
						<a href={link.href} onClick={closeSidebar}>
							{link.text}
						</a>
					</li>
				))}
			</ul>
			<ul className={styles.media}>
				{media.map(link => (
					<li key={link.link}>
						<a
							href={link.link}
							target="_blank"
							rel="noreferrer"
							aria-label={link.label}
							onClick={closeSidebar}
						>
							<Icon icon={link.icon} size="2x" />
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default Sidebar;
