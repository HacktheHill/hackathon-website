import { useEffect, useRef, useState } from "react";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";
import { t } from "@/i18n";
import style from "./Navigation.module.css";

// Matches the 4.5rem navbar height; scrolling further than this hides the bar.
const NAVBAR_HEIGHT = 72;

const Navigation = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [navbarHidden, setNavbarHidden] = useState(false);
	const [pastHero, setPastHero] = useState(false);
	const menuButtonRef = useRef<HTMLButtonElement>(null);
	const mobileNavigationLabel = t("navbar.mobile_aria_label");

	useEffect(() => {
		let lastY = window.scrollY;
		let frame = 0;

		const update = () => {
			frame = 0;
			const y = window.scrollY;
			const heroBottom = document.getElementById("hero")?.getBoundingClientRect().bottom ?? 0;
			setPastHero(heroBottom <= NAVBAR_HEIGHT);
			// Small dead zone so momentum jitter doesn't toggle the bar.
			if (Math.abs(y - lastY) > 4) {
				setNavbarHidden(y > lastY && y > NAVBAR_HEIGHT);
				lastY = y;
			}
		};
		const onScroll = () => {
			if (!frame) frame = window.requestAnimationFrame(update);
		};

		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			if (frame) window.cancelAnimationFrame(frame);
		};
	}, []);

	return (
		<div
			className={style.navigation}
			role={sidebarOpen ? "dialog" : undefined}
			aria-modal={sidebarOpen || undefined}
			aria-label={sidebarOpen ? mobileNavigationLabel : undefined}
		>
			<Navbar
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
				menuButtonRef={menuButtonRef}
				hidden={navbarHidden && !sidebarOpen}
				floating={pastHero}
			/>
			<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} menuButtonRef={menuButtonRef} />
		</div>
	);
};

export default Navigation;
