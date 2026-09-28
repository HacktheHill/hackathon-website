import { useEffect, useRef, useState } from "react";
import { closingLinks } from "./closingContent";

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const progress = (time: number, start: number, duration: number) => clamp((time - start) / duration);
const ease = (n: number) => 1 - Math.pow(1 - n, 3);

// Cues follow the edited recording's brass entrances and first big orchestral hit.
export default function StupidIdeas({ active }: { active: boolean }) {
	const audio = useRef<HTMLAudioElement>(null);
	const [time, setTime] = useState(0);
	const [blocked, setBlocked] = useState(false);
	const [failed, setFailed] = useState(false);
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const media = matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReduced(media.matches);
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, []);
	useEffect(() => {
		const element = audio.current;
		if (!element) return;
		element.pause();
		element.currentTime = 0;
		setTime(0);
		setBlocked(false);
		if (!active) return;
		let cancelled = false;
		let frame = 0;
		void element.play().catch(error => {
			if (!cancelled && error.name !== "AbortError") setBlocked(true);
		});
		const tick = () => {
			setTime(element.currentTime);
			if (!element.ended) frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => {
			cancelled = true;
			cancelAnimationFrame(frame);
			element.pause();
		};
	}, [active]);
	useEffect(() => {
		if (!active) return;
		const retry = (event: KeyboardEvent) => {
			if (!["ArrowRight", "ArrowUp"].includes(event.key)) return;
			if (!blocked && (audio.current?.currentTime ?? 0) >= 14) return;
			event.preventDefault();
			event.stopImmediatePropagation();
			if (blocked)
				void audio.current
					?.play()
					.then(() => setBlocked(false))
					.catch(() => setFailed(true));
			else if (audio.current) {
				audio.current.currentTime = 14;
				setTime(14);
			}
		};
		window.addEventListener("keydown", retry, true);
		return () => window.removeEventListener("keydown", retry, true);
	}, [active, blocked]);
	const promo = progress(time, 12, reduced ? 0.01 : 2);
	const phase = time < 4.5 ? "spob" : time < 8 ? "prick" : time < 12 ? "together" : "event";
	const actorStyle = (name: "spob" | "prick") => {
		const isSpob = name === "spob";
		const soloStart = isSpob ? 0.5 : 4.5;
		const soloEnd = isSpob ? 3.3 : 6.8;
		const solo = progress(time, soloStart, reduced ? 0.01 : 2);
		const together = progress(time, 8, reduced ? 0.01 : 3);
		const entrance = time < 8 ? solo : together;
		const fade = time < 8 ? progress(time, soloEnd, 1) : 0;
		const opacity = time < 8 ? solo * (1 - fade) : together;
		const width = isSpob ? 500 : 548;
		const home = time < 8 ? (1600 - width) / 2 : isSpob ? 820 : 240;
		const start = isSpob ? 1660 : -600;
		const x = reduced ? home : start + (home - start) * ease(entrance);
		const finalX = isSpob ? 1190 : 830;
		return {
			width,
			opacity,
			transform: `translate(${x + (finalX - x) * ease(promo)}px, ${(isSpob ? 140 : 120) + 270 * ease(promo)}px) scale(${1 - 0.36 * ease(promo)})`,
			filter: promo === 0 ? "url(#stupid-silhouette)" : `brightness(${promo})`,
		};
	};
	return (
		<div className="stupid-ideas-scene" data-phase={phase} data-blocked={blocked}>
			<svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
				<defs>
					<filter id="stupid-silhouette" colorInterpolationFilters="sRGB">
						<feMorphology operator="dilate" radius="1" />
						<feComponentTransfer>
							<feFuncA type="linear" slope="255" />
						</feComponentTransfer>
						<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
					</filter>
				</defs>
			</svg>
			<audio
				ref={audio}
				src="/art/presentation/closing/zarathustra-intro.m4a?v=20"
				preload="auto"
				onError={() => setFailed(true)}
			/>
			<div className="stupid-event-details" style={{ opacity: promo }} aria-hidden={promo < 1}>
				<h1>
					Stupid Ideas
					<br />
					Hackathon
				</h1>
				<p>Ottawa / November</p>
				<a href={closingLinks.stupid} target="_blank" rel="noreferrer" tabIndex={promo < 1 ? -1 : 0}>
					<img src="/art/presentation/closing/stupid-ideas-qr.png" alt="Follow Stupid Ideas on Instagram" />
					<span>@stupideas_com</span>
				</a>
			</div>
			{(["spob", "prick"] as const).map(name => (
				<img
					className={`stupid-character stupid-${name}`}
					key={name}
					src={`/art/presentation/closing/${name}.png`}
					alt={name === "spob" ? "Spob" : "Prick"}
					hidden={actorStyle(name).opacity === 0}
					style={actorStyle(name)}
				/>
			))}
			{active && (blocked || failed) && (
				<button
					className="stupid-play"
					onClick={() => {
						setFailed(false);
						if (failed) audio.current?.load();
						void audio.current
							?.play()
							.then(() => setBlocked(false))
							.catch(() => setBlocked(true));
					}}
				>
					{failed ? "Retry intro" : "Play intro · Right arrow"}
				</button>
			)}
		</div>
	);
}
