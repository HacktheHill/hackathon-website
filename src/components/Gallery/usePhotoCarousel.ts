import { useEffect, useRef, useState } from "react";
import { galleryItems } from "./galleryData";

export function usePhotoCarousel() {
	const sectionRef = useRef<HTMLElement>(null);
	const [index, setIndex] = useState(0);
	const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
	const [paused, setPaused] = useState(false);
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	const [visible, setVisible] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(true);
	const [loadedId, setLoadedId] = useState<string | null>(null);
	const items = galleryItems.filter(item => !unavailable.has(item.id));
	const activeIndex = index % Math.max(1, items.length);
	const item = items[activeIndex];

	useEffect(() => {
		const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReducedMotion(preference.matches);
		update();
		preference.addEventListener("change", update);
		const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
		if (sectionRef.current) observer.observe(sectionRef.current);
		return () => {
			preference.removeEventListener("change", update);
			observer.disconnect();
		};
	}, []);

	// The first preview can finish loading before React hydrates the page.
	useEffect(() => {
		const image = sectionRef.current?.querySelector("img");
		if (!image?.complete || !item) return;
		if (image.naturalWidth > 0) setLoadedId(item.id);
		else setUnavailable(current => new Set([...current, item.id]));
	}, [item?.id]);

	useEffect(() => {
		if (!visible || paused || hovered || focused || reducedMotion || items.length < 2 || loadedId !== item?.id)
			return;
		const timer = window.setInterval(() => {
			if (!document.hidden) setIndex(current => (current + 1) % items.length);
		}, 8000);
		return () => window.clearInterval(timer);
	}, [visible, paused, hovered, focused, reducedMotion, items.length, item?.id, loadedId]);

	function move(direction: number) {
		setPaused(true);
		setIndex((activeIndex + direction + items.length) % Math.max(1, items.length));
	}

	return {
		sectionRef,
		item,
		activeIndex,
		count: items.length,
		paused,
		reducedMotion,
		setPaused,
		setHovered,
		setFocused,
		move,
		loaded: () => setLoadedId(item.id),
		failed: () => setUnavailable(current => new Set([...current, item.id])),
	};
}
