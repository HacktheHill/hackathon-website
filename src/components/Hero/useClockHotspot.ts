import { useEffect, useRef } from "react";

// Match the foreground image dimensions and the clock center in its original pixels.
const FOREGROUND_WIDTH = 1920;
const FOREGROUND_HEIGHT = 1070;
const CLOCK_HOTSPOT = { centerX: 690, centerY: 290, width: 170, height: 170 };
// Fallback for --foreground-min-top if the custom property cannot be read.
const DEFAULT_FOREGROUND_MIN_TOP = 80;
// Portrait paints with `cover`; must match the CSS media condition.
const FOREGROUND_COVER_MEDIA = "(orientation: portrait)";

export function useClockHotspot(countdownAvailable: boolean) {
	const foregroundRef = useRef<HTMLDivElement>(null);
	const hotspotRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const foreground = foregroundRef.current;
		const hotspot = hotspotRef.current;
		if (!foreground || !hotspot) return;

		const place = () => {
			const containerWidth = foreground.clientWidth;
			const containerHeight = foreground.clientHeight;
			if (!containerWidth || !containerHeight) return;

			// Replicate the painted image's geometry inside this box (the box's
			// own offset/drop is inherited by the hotspot as a child).
			let renderedWidth: number;
			let offsetY: number;
			if (window.matchMedia(FOREGROUND_COVER_MEDIA).matches) {
				// Portrait uses cover scaling and pins the image to the bottom.
				const coverScale = Math.max(containerWidth / FOREGROUND_WIDTH, containerHeight / FOREGROUND_HEIGHT);
				renderedWidth = FOREGROUND_WIDTH * coverScale;
				offsetY = containerHeight - FOREGROUND_HEIGHT * coverScale;
			} else {
				// Desktop uses the full width, with enough top clearance for the navbar.
				renderedWidth = containerWidth;
				const configuredMinTop = Number.parseFloat(
					window.getComputedStyle(foreground).getPropertyValue("--foreground-min-top"),
				);
				const minTop = Number.isFinite(configuredMinTop) ? configuredMinTop : DEFAULT_FOREGROUND_MIN_TOP;
				offsetY = Math.max(minTop, containerHeight - FOREGROUND_HEIGHT * (renderedWidth / FOREGROUND_WIDTH));
			}
			const scale = renderedWidth / FOREGROUND_WIDTH;
			const offsetX = (containerWidth - renderedWidth) / 2; // centred (matters only when cover-cropped)

			hotspot.style.left = `${offsetX + CLOCK_HOTSPOT.centerX * scale}px`;
			hotspot.style.top = `${offsetY + CLOCK_HOTSPOT.centerY * scale}px`;
			hotspot.style.width = `${CLOCK_HOTSPOT.width * scale}px`;
			hotspot.style.height = `${CLOCK_HOTSPOT.height * scale}px`;
		};

		place();
		const observer = new ResizeObserver(place);
		observer.observe(foreground);
		return () => observer.disconnect();
	}, [countdownAvailable]);

	return { foregroundRef, hotspotRef };
}
