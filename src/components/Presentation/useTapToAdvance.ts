import { useEffect } from "react";

// Route touch taps through the existing advance key so staged reveals and the
// intro's capture handler behave exactly as they do for the presenter.
export default function useTapToAdvance() {
	useEffect(() => {
		let start: { id: number; x: number; y: number; time: number } | null = null;
		const interactive = (target: EventTarget | null) =>
			target instanceof Element &&
			target.closest("a, button, input, textarea, select, video, audio, [contenteditable], [role=button]");
		const cancel = () => {
			start = null;
		};
		const down = (event: PointerEvent) => {
			start =
				event.pointerType === "touch" && event.isPrimary && !interactive(event.target)
					? { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now() }
					: null;
		};
		const move = (event: PointerEvent) => {
			if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12) cancel();
		};
		const up = (event: PointerEvent) => {
			const tap = start;
			cancel();
			if (
				!tap ||
				event.pointerId !== tap.id ||
				event.defaultPrevented ||
				interactive(event.target) ||
				performance.now() - tap.time > 600 ||
				Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > 12
			)
				return;
			window.dispatchEvent(
				new KeyboardEvent("keydown", {
					key: "ArrowRight",
					code: "ArrowRight",
					bubbles: true,
					cancelable: true,
				}),
			);
		};
		window.addEventListener("pointerdown", down);
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
		window.addEventListener("pointercancel", cancel);
		return () => {
			window.removeEventListener("pointerdown", down);
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
			window.removeEventListener("pointercancel", cancel);
		};
	}, []);
}
