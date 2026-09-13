import { useEffect, type RefObject } from "react";

export function useSceneParallax(artworkRef: RefObject<HTMLDivElement>, canvasRef: RefObject<HTMLDivElement>) {
	useEffect(() => {
		const artwork = artworkRef.current;
		const canvas = canvasRef.current;
		if (!artwork || !canvas) return;

		const layers = Array.from(artwork.querySelectorAll<HTMLElement>("[data-parallax-speed]")).map(element => ({
			element,
			speed: Number(element.dataset.parallaxSpeed),
		}));
		const sections = Array.from(canvas.querySelectorAll<HTMLElement>("[data-section-parallax]")).map(element => ({
			element,
			max: Number(element.dataset.parallaxMax),
			speed: Number(element.dataset.sectionParallax),
		}));
		const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const desktopQuery = window.matchMedia("(min-width: 1025px)");
		let frame = 0;

		const update = () => {
			frame = 0;

			if (motionQuery.matches || !desktopQuery.matches) return;

			const travel = Math.min(window.scrollY, window.innerHeight * 1.25);
			layers.forEach(({ element, speed }) => {
				element.style.translate = `0 ${travel * speed}px`;
			});

			sections.forEach(({ element, max, speed }) => {
				const previousOffset = Number(element.dataset.parallaxOffset ?? 0);
				const bounds = element.getBoundingClientRect();
				const baseCenter = bounds.top - previousOffset + bounds.height / 2;
				const distanceFromCenter = window.innerHeight / 2 - baseCenter;
				const offset = Math.max(-max, Math.min(max, distanceFromCenter * speed));
				element.dataset.parallaxOffset = String(offset);
				element.style.translate = `0 ${offset}px`;
			});
		};

		const resetMotion = () => {
			if (motionQuery.matches || !desktopQuery.matches) {
				layers.forEach(({ element }) => element.style.removeProperty("translate"));
				sections.forEach(({ element }) => {
					element.style.removeProperty("translate");
					element.dataset.parallaxOffset = "0";
				});
			} else {
				update();
			}
		};
		const handleScroll = () => {
			if (!frame) frame = window.requestAnimationFrame(update);
		};

		resetMotion();
		window.addEventListener("scroll", handleScroll, { passive: true });
		motionQuery.addEventListener("change", resetMotion);
		desktopQuery.addEventListener("change", resetMotion);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			motionQuery.removeEventListener("change", resetMotion);
			desktopQuery.removeEventListener("change", resetMotion);
			if (frame) window.cancelAnimationFrame(frame);
		};
	}, [artworkRef, canvasRef]);
}
