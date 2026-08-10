import { useEffect, useRef, useState } from "react";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";
import { t } from "@/i18n";
import style from "./Navigation.module.css";

const Navigation = () => {
	const [pageScroll, setPageScroll] = useState(0);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);
	const menuButtonRef = useRef<HTMLButtonElement>(null);
	const mobileNavigationLabel = t("navbar.mobile_aria_label");

	useEffect(() => {
		const onScroll = () => setPageScroll(window.scrollY);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const updatePreference = () => setReducedMotion(motionQuery.matches);
		updatePreference();
		motionQuery.addEventListener("change", updatePreference);
		return () => motionQuery.removeEventListener("change", updatePreference);
	}, []);

	return (
		<div
			className={style["navigation"]}
			role={sidebarOpen ? "dialog" : undefined}
			aria-modal={sidebarOpen || undefined}
			aria-label={sidebarOpen ? mobileNavigationLabel : undefined}
		>
			<Navbar
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
				pageScroll={pageScroll}
				menuButtonRef={menuButtonRef}
				scrollDuration={reducedMotion ? 0 : 500}
			/>
			<Sidebar
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
				menuButtonRef={menuButtonRef}
				scrollDuration={reducedMotion ? 0 : 500}
			/>
		</div>
	);
};

export default Navigation;
