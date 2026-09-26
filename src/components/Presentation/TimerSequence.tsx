import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const RECAP_URL = "/art/presentation/hthrecap_2.mp4";
const FADE_MS = 1000;
type Phase = "countdown" | "black" | "video" | "closing" | "slides";

export default function TimerSequence({ complete, children }: { complete: boolean; children: ReactNode }) {
	const [phase, setPhase] = useState<Phase>("countdown");
	const [source, setSource] = useState("");
	const [ready, setReady] = useState(false);
	const [settledPhase, setSettledPhase] = useState<Phase | null>(null);
	const [slidesReady, setSlidesReady] = useState(false);
	const [blocked, setBlocked] = useState(false);
	const [error, setError] = useState(false);
	const [attempt, setAttempt] = useState(0);
	const video = useRef<HTMLVideoElement>(null);
	const slides = useRef<HTMLIFrameElement>(null);
	const starting = useRef(false);

	useEffect(() => {
		const controller = new AbortController();
		let objectUrl = "";
		// preload="auto" is only a hint. A completed Blob download guarantees all bytes are local.
		void (async () => {
			try {
				const response = await fetch(RECAP_URL, { signal: controller.signal });
				if (!response.ok) throw new Error(`Recap download failed: ${response.status}`);
				const blob = await response.blob();
				if (controller.signal.aborted) return;
				objectUrl = URL.createObjectURL(blob);
				setSource(objectUrl);
			} catch {
				if (!controller.signal.aborted) setError(true);
			}
		})();
		return () => {
			controller.abort();
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [attempt]);

	useEffect(() => {
		if (complete && phase === "countdown") setPhase("black");
	}, [complete, phase]);

	useEffect(() => {
		if (phase !== "black" && phase !== "closing") return;
		const timeout = window.setTimeout(() => setSettledPhase(phase), FADE_MS);
		return () => window.clearTimeout(timeout);
	}, [phase]);

	const play = useCallback(async () => {
		if (!video.current || starting.current) return;
		starting.current = true;
		try {
			await video.current.play();
			setBlocked(false);
			setPhase("video");
		} catch (reason) {
			if (reason instanceof DOMException && reason.name === "NotAllowedError") setBlocked(true);
			else setError(true);
		} finally {
			starting.current = false;
		}
	}, []);

	useEffect(() => {
		if (phase === "black" && settledPhase === phase && ready && !blocked && !error) void play();
		if (phase === "closing" && settledPhase === phase && slidesReady) setPhase("slides");
	}, [phase, settledPhase, ready, slidesReady, blocked, error, play]);

	useEffect(() => {
		if (!blocked) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				void play();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [blocked, play]);

	useEffect(() => {
		// Wait for the actual hydrated deck and its artwork, not just the iframe HTML.
		const interval = window.setInterval(() => {
			const document = slides.current?.contentDocument;
			if (
				document?.querySelector(".slide-opening") &&
				!document.querySelector("astro-island[ssr]") &&
				document.fonts.status === "loaded" &&
				[...document.images].every(image => image.complete && image.naturalWidth > 0)
			) {
				setSlidesReady(true);
				window.clearInterval(interval);
			}
		}, 100);
		return () => window.clearInterval(interval);
	}, []);

	useEffect(() => {
		if (phase === "slides") slides.current?.contentWindow?.focus();
	}, [phase]);

	return (
		<div className="timer-sequence" data-phase={phase} data-video-ready={ready}>
			<div className="timer-scene" aria-hidden={phase !== "countdown"}>
				{children}
			</div>
			<iframe
				ref={slides}
				className="timer-slides"
				src="/slides#opening"
				title="Opening ceremony slides"
				tabIndex={phase === "slides" ? 0 : -1}
				aria-hidden={phase !== "slides"}
				allowFullScreen
			/>
			<video
				ref={video}
				className="timer-recap"
				src={source || undefined}
				preload="auto"
				playsInline
				aria-label="Hack the Hill recap"
				aria-hidden={phase !== "video"}
				onCanPlay={() => setReady(true)}
				onEnded={() => setPhase("closing")}
				onError={() => {
					if (source) {
						setError(true);
						if (phase === "video") setPhase("black");
					}
				}}
			/>
			<div className="timer-blackout" aria-hidden="true" />
			{phase === "black" && (blocked || error) && (
				<button
					className="timer-play"
					onClick={() => {
						if (error) {
							setError(false);
							setReady(false);
							setSource("");
							setAttempt(value => value + 1);
						} else void play();
					}}
				>
					{error ? "Retry video / Réessayer" : "Play recap / Lancer la vidéo"}
				</button>
			)}
		</div>
	);
}
