import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

export function useHeroParallax() {
	const heroRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const heroEl = heroRef.current;
		if (!heroEl) return;
		const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		let reducedMotion = motionQuery.matches;

		const heading = heroEl.querySelector<HTMLElement>(`.${styles["hero-heading"]}`);

		// Skip all parallax work + pause the cloud drift while the hero is off-screen
		// so scrolling the rest of the page stays cheap.
		let visible = true;
		const observer = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				heroEl.classList.toggle("hero-offscreen", !visible);
			},
			{ threshold: 0 },
		);
		observer.observe(heroEl);

		let frame = 0;
		const update = () => {
			frame = 0;
			if (!visible || reducedMotion) return;
			const scrollY = window.scrollY;
			if (!heroRef.current) return;

			if (heading) {
				heading.style.transform = `translate3d(0, ${Math.min(scrollY, window.innerHeight) * 0.05}px, 0)`;
			}
		};

		const handleScroll = () => {
			if (frame) return;
			frame = window.requestAnimationFrame(update);
		};

		const handleMotionChange = (event: MediaQueryListEvent) => {
			reducedMotion = event.matches;
			if (!reducedMotion) return;

			heading?.style.removeProperty("transform");
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		motionQuery.addEventListener("change", handleMotionChange);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			motionQuery.removeEventListener("change", handleMotionChange);
			observer.disconnect();
			if (frame) window.cancelAnimationFrame(frame);
		};
	}, []);

	return heroRef;
}
