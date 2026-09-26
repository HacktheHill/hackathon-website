import { useEffect, useRef, useState } from "react";
import { OpeningArtwork } from "./OpeningScene";
import TimerFlag from "./TimerFlag";
import TimerSequence from "./TimerSequence";
import "./presentation.css";
import "./timer.css";

const DEFAULT_SECONDS = 10 * 60;

function RollingDigit({ digit }: { digit: string }) {
	const [frame, setFrame] = useState({ current: digit, previous: "", version: 0 });
	// Update the pair before paint so all changing columns start on the same frame.
	if (frame.current !== digit) {
		setFrame({ current: digit, previous: frame.current, version: frame.version + 1 });
	}
	return (
		<span className="timer-digit">
			<span key={frame.version} className={`timer-digit-reel${frame.previous ? " timer-digit-roll" : ""}`}>
				{frame.previous && <span>{frame.previous}</span>}
				<span>{frame.current}</span>
			</span>
		</span>
	);
}

export default function CountdownTimer() {
	const [remaining, setRemaining] = useState(DEFAULT_SECONDS);
	const [scale, setScale] = useState(1);
	const deadline = useRef<number | null>(null);
	const completed = useRef(false);

	useEffect(() => {
		// A deadline keeps elapsed time accurate when the browser throttles hidden tabs.
		deadline.current = Date.now() + DEFAULT_SECONDS * 1000;
		const update = () => {
			if (completed.current) return;
			const seconds = Math.max(0, Math.ceil((deadline.current! - Date.now()) / 1000));
			if (seconds === 0) completed.current = true;
			setRemaining(seconds);
		};
		const resize = () => setScale(Math.min(window.innerWidth / 1600, window.innerHeight / 900));
		const onKey = (event: KeyboardEvent) => {
			if (
				completed.current ||
				event.ctrlKey ||
				event.metaKey ||
				event.altKey ||
				event.repeat ||
				(event.target instanceof HTMLElement &&
					event.target.closest("input, textarea, select, [contenteditable]"))
			)
				return;
			const change =
				event.key === "+" || event.key === "=" || event.code === "NumpadAdd"
					? 60_000
					: event.key === "-" || event.code === "NumpadSubtract"
						? -60_000
						: 0;
			if (!change) return;
			event.preventDefault();
			const now = Date.now();
			deadline.current = Math.max(now, Math.max(now, deadline.current!) + change);
			update();
		};
		resize();
		const interval = window.setInterval(update, 100);
		window.addEventListener("resize", resize);
		window.addEventListener("keydown", onKey);
		document.addEventListener("visibilitychange", update);
		return () => {
			window.clearInterval(interval);
			window.removeEventListener("resize", resize);
			window.removeEventListener("keydown", onKey);
			document.removeEventListener("visibilitychange", update);
		};
	}, []);

	const minutes = Math.floor(remaining / 60);
	const seconds = remaining % 60;
	const digits = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	return (
		<TimerSequence complete={remaining === 0}>
			<main className="presentation timer-presentation" aria-label="Hack the Hill countdown">
				<div className="presentation-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
					<div className="landscape" aria-hidden="true">
						<OpeningArtwork />
						<TimerFlag />
					</div>
					<div
						className="countdown"
						role="timer"
						aria-live="off"
						aria-label={`${minutes} minutes ${seconds} seconds`}
						data-seconds={remaining}
					>
						<div className="timer-digits" aria-hidden="true">
							{[...digits].map((digit, index) =>
								digit === ":" ? (
									<span className="timer-colon" key="colon">
										:
									</span>
								) : (
									<RollingDigit digit={digit} key={digits.length - index} />
								),
							)}
						</div>
					</div>
				</div>
			</main>
		</TimerSequence>
	);
}
