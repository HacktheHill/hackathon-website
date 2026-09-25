import { useEffect, useRef, useState } from "react";

const START_DELAY_MS = 3000;

export default function BlackoutVideo({ active }: { active: boolean }) {
	const video = useRef<HTMLVideoElement>(null);
	const [source, setSource] = useState("");
	const [ready, setReady] = useState(false);
	const [finished, setFinished] = useState(false);
	const [started, setStarted] = useState(false);
	const [blocked, setBlocked] = useState(false);
	const [failed, setFailed] = useState(false);
	const [attempt, setAttempt] = useState(0);

	useEffect(() => {
		const controller = new AbortController();
		let objectUrl = "";
		setFailed(false);
		setReady(false);
		// Download every byte before starting, so the staged tape failure cannot be a buffering stall.
		void fetch("/art/presentation/blackout-training.mp4", { signal: controller.signal })
			.then(response => {
				if (!response.ok) throw new Error("Video download failed");
				return response.blob();
			})
			.then(blob => {
				if (controller.signal.aborted) return;
				objectUrl = URL.createObjectURL(blob);
				setSource(objectUrl);
			})
			.catch(() => {
				if (!controller.signal.aborted) setFailed(true);
			});
		return () => {
			controller.abort();
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [attempt]);

	useEffect(() => {
		const element = video.current;
		if (!element) return;
		if (!active) {
			element.pause();
			element.currentTime = 0;
			setFinished(false);
			setStarted(false);
			setBlocked(false);
			return;
		}
		if (!ready) return;
		let cancelled = false;
		const timeout = window.setTimeout(() => {
			void element.play().catch(error => {
				if (cancelled) return;
				if (error.name === "NotAllowedError") setBlocked(true);
				else if (error.name !== "AbortError") setFailed(true);
			});
		}, START_DELAY_MS);
		return () => {
			cancelled = true;
			window.clearTimeout(timeout);
			element.pause();
		};
	}, [active, ready]);

	return (
		<div className="presentation-blackout" hidden={!active} data-ready={ready} data-finished={finished}>
			<div className="blackout-frame">
				<video
					className="blackout-film"
					ref={video}
					src={source || undefined}
					preload="auto"
					playsInline
					hidden={!active || finished || !started}
					onPlaying={() => setStarted(true)}
					onCanPlay={() => setReady(true)}
					onEnded={() => setFinished(true)}
					onError={() => source && setFailed(true)}
					aria-label="Hack the Hill training video"
				>
					<track
						kind="captions"
						src="/art/presentation/blackout-training.vtt"
						srcLang="en"
						label="English"
						default
					/>
				</video>
			</div>
			{active && (blocked || failed) && (
				<button
					className="blackout-play"
					ref={element => element?.focus()}
					onClick={() => {
						if (failed) setAttempt(value => value + 1);
						else
							void video.current
								?.play()
								.then(() => setBlocked(false))
								.catch(() => setFailed(true));
					}}
				>
					{failed ? "Retry video / Réessayer" : "Play video / Lire la vidéo"}
				</button>
			)}
		</div>
	);
}
