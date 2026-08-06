import { useEffect, useRef } from "react";
import About from "./About";
import FAQ from "./FAQ";
import PreviousWinners from "./PreviousWinners";
import Sponsors from "./Sponsors";
import styles from "./Landing2026.module.css";

const REVEAL_SELECTOR = "[data-scroll-reveal]";
const REVEAL_THRESHOLD = 0.15;
const REVEAL_ROOT_BOTTOM_MARGIN = 0.08;

function Landing2026() {
	const landingRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const landing = landingRef.current;
		if (!landing) return;

		const revealElements = Array.from(landing.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		if (reducedMotion || !("IntersectionObserver" in window)) return;

		const revealBoundary = window.innerHeight * (1 - REVEAL_ROOT_BOTTOM_MARGIN);
		revealElements.forEach(element => {
			const bounds = element.getBoundingClientRect();
			const visibleHeight = Math.max(0, Math.min(bounds.bottom, revealBoundary) - Math.max(bounds.top, 0));

			if (visibleHeight / Math.max(bounds.height, 1) >= REVEAL_THRESHOLD) {
				element.classList.add(styles.revealVisible);
			}
		});

		landing.classList.add(styles.motionReady);

		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					const element = entry.target as HTMLElement;

					if (entry.isIntersecting && entry.intersectionRatio >= REVEAL_THRESHOLD) {
						element.classList.add(styles.revealVisible);
					} else if (!entry.isIntersecting) {
						element.classList.remove(styles.revealVisible);
					}
				});
			},
			{
				threshold: [0, REVEAL_THRESHOLD],
				rootMargin: `0px 0px -${REVEAL_ROOT_BOTTOM_MARGIN * 100}% 0px`,
			},
		);

		revealElements.forEach(element => observer.observe(element));

		return () => observer.disconnect();
	}, []);

	return (
		<main ref={landingRef} className={styles.landing}>
			<About />
			<PreviousWinners />
			<Sponsors />
			<FAQ />
		</main>
	);
}

export default Landing2026;
