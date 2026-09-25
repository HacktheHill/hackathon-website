import { useCallback, useEffect, useRef, useState } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH, HERO_SCENE_LAYERS, SCENE_LAYERS } from "../Scene/sceneLayers";
import { programme, slides, type Slide } from "./slides";
import { resourceLinks, scheduleEvents } from "./presentationContent";
import VenueSigns from "./VenueSigns";
import Challenges, { challengeCount } from "./Challenges";
import BlackoutVideo from "./BlackoutVideo";
import ImportedSlideVideo from "./ImportedSlideVideo";
import PresentationParticles from "./PresentationParticles";
import { OpeningArtwork, OpeningBranding } from "./OpeningScene";
import icons from "../../../public/art/presentation/icons/manifest.json";
import anchor from "../../../public/art/presentation/anchor/manifest.json";
import "./presentation.css";

const WIDTH = 1600;
const HEIGHT = 900;
const sceneScale = WIDTH / CANVAS_WIDTH;
const guidelinesIndex = slides.findIndex(item => item.id === "guidelines");
const challengesIndex = slides.findIndex(item => item.id === "challenges");
const scheduleIndex = slides.findIndex(item => item.id === "schedule");
const collaboratorsIndex = slides.findIndex(item => item.id === "partners");
const requiresCut = (slide: Slide) => slide.kind === "black" || slide.kind === "imported";
const foreground = SCENE_LAYERS.find(layer => layer.name === "bush-4")!;
// wanchor.psd starts at the same ice edge as the full website landscape.
const anchorSceneTop = SCENE_LAYERS.find(layer => layer.name === "ice-1")!.y;
const anchorScale = sceneScale * 0.82;
const anchorBounds = {
	x: Math.min(...anchor.layers.map(layer => layer.x)),
	y: Math.min(...anchor.layers.map(layer => layer.y)),
	right: Math.max(...anchor.layers.map(layer => layer.x + layer.width)),
	bottom: Math.max(...anchor.layers.map(layer => layer.y + layer.height)),
};
const slideIcons: Record<string, string[]> = {
	land: ["layer-2", "layer-3", "layer-4"],
	tonight: ["layer-5"],
	welcome: ["layer-7"],
	president: ["layer-8", "layer-9"],
};
function SlideContent({
	slide,
	active,
	timelineIndex,
	venueLanguage,
	challengeStage,
}: {
	slide: Slide;
	active: boolean;
	timelineIndex: number;
	venueLanguage: number;
	challengeStage: number;
}) {
	if (slide.kind === "black") return null;
	if (slide.kind === "imported" && slide.image)
		return <>
			<img className="imported-slide-image" src={slide.image.src} alt={slide.image.alt} width={2560} height={1440} draggable={false} />
			{active && slide.video && <ImportedSlideVideo video={slide.video} />}
		</>;
	if (slide.kind === "cover")
		return (
			<div className="cover-content">
				<OpeningBranding />
				<h1 className="sr-only">{slide.title}</h1>
				<p className="french sr-only" lang="fr">
					{slide.french}
				</p>
			</div>
		);

	return (
		<div className={`slide-content layout-${slide.kind}`}>
			<header>
				<h2>{slide.title}</h2>
				<p className="french" lang="fr">
					{slide.french}
				</p>
			</header>
			{slide.placeholder && (
				<div className="slide-placeholder">
					<p>{slide.placeholder[0]}</p>
					<p lang="fr">{slide.placeholder[1]}</p>
				</div>
			)}
			{slide.kind === "agenda" && (
				<ol className="programme">
					{programme.map(([en, fr]) => (
						<li key={en}>
							<span>{en}</span>
							<span lang="fr">{fr}</span>
						</li>
					))}
				</ol>
			)}
			{slide.kind === "welcome" && (
				<p className="welcome-copy">
					Canada’s capital hackathon.
					<br />A weekend of building, learning,
					<br />
					and finding your people.
				</p>
			)}
			{slide.kind === "guidelines" && <VenueSigns language={venueLanguage} />}
			{slide.kind === "challenges" && <Challenges stage={challengeStage} />}
			{slide.logos && (
				<div
					className={`sponsor-logos count-${slide.logos.length} ${slide.kind === "sponsors" ? "sponsor-overview" : slide.id === "partners" ? "collaborator-logos" : ""}`}
				>
					{slide.logos.map((logo, i) => (
						<a href={logo.href} target="_blank" rel="noreferrer" key={logo.alt}>
							<img className="logo-snowbank" src={`/art/sponsors/snowbank-${i + 1}.webp`} alt="" />
							<img className="sponsor-mark" src={logo.src} alt={logo.alt} />
						</a>
					))}
				</div>
			)}
			{slide.kind === "schedule" && (
				<div className="schedule" data-event={timelineIndex + 1}>
					<div className="schedule-line" aria-hidden="true" />
					<div
						className="schedule-track"
						aria-hidden="true"
						style={{ transform: `translateX(${800 - timelineIndex * 560}px)` }}
					>
						{scheduleEvents.map((event, i) => (
							<span
								key={`${event.day}-${event.time}`}
								className={`schedule-stop${i === timelineIndex ? " is-current" : ""}`}
								style={{ left: i * 560 }}
							/>
						))}
					</div>
					<div className="schedule-event-copy" key={timelineIndex} aria-live="polite" aria-atomic="true">
						<div className="schedule-day">
							<span>{scheduleEvents[timelineIndex].day}</span>
							<span aria-hidden="true"> / </span>
							<span lang="fr">{scheduleEvents[timelineIndex].dayFrench}</span>
						</div>
						<strong>{scheduleEvents[timelineIndex].time}</strong>
						<h3>{scheduleEvents[timelineIndex].title}</h3>
						<p lang="fr">{scheduleEvents[timelineIndex].french}</p>
					</div>
				</div>
			)}
			{slide.kind === "rules" && (
				<div className="competition-rules">
					<div>
						<p>Up to 4 per team</p>
						<p lang="fr">4 personnes maximum par équipe</p>
					</div>
					<div>
						<p>Start after the opening ceremony</p>
						<p lang="fr">Commencez après la cérémonie d’ouverture</p>
					</div>
					<div>
						<p>Credit external code and assets</p>
						<p lang="fr">Citez le code et les ressources externes</p>
					</div>
				</div>
			)}
			{slide.kind === "resources" && (
				<div className="resource-links">
					{resourceLinks.map(resource => (
						<div key={resource.name}>
							<h3>{resource.name}</h3>
							{resource.url && resource.qrSrc ? (
								<a href={resource.url} target="_blank" rel="noreferrer">
									<img
										className="resource-qr"
										src={resource.qrSrc}
										alt={`QR code: ${resource.name}`}
									/>
								</a>
							) : (
								<div className="qr-pending">
									<p>Link to confirm</p>
									<p lang="fr">Lien à confirmer</p>
								</div>
							)}
							<p>{resource.description}</p>
							<p lang="fr">{resource.french}</p>
						</div>
					))}
				</div>
			)}
			{slide.kind === "closing" && (
				<ol className="next-steps">
					<li>
						<span>01</span> Meet your team <small lang="fr">Rencontrez votre équipe</small>
					</li>
					<li>
						<span>02</span> Explore the challenges <small lang="fr">Découvrez les défis</small>
					</li>
					<li>
						<span>03</span> Get ready to build <small lang="fr">Préparez-vous à créer</small>
					</li>
				</ol>
			)}
		</div>
	);
}

export default function Presentation() {
	const [{ index, timelineIndex, venueLanguage, challengeStage, cut }, setPosition] = useState({
		cut: false,
		index: 0,
		timelineIndex: 0,
		venueLanguage: 0,
		challengeStage: 0,
	});
	const [scale, setScale] = useState(1);
	const [fullscreenError, setFullscreenError] = useState("");
	const wheelState = useRef({ accumulated: 0, lastWheel: 0, lastStep: 0 });
	const slide = slides[index];
	const ding = useRef<HTMLAudioElement>(null);
	useEffect(() => {
		const audio = ding.current;
		if (!audio) return;
		audio.pause();
		audio.currentTime = 0;
		if (slide.kind === "black" && slide.id !== "blackout") {
			// Direct links may be autoplay-blocked; keyboard navigation provides user activation.
			void audio.play().catch(() => {});
		}
		return () => audio.pause();
	}, [slide]);
	const go = useCallback(
		(next: number, hardCut = false) =>
			setPosition(current => ({
				cut:
					hardCut ||
					requiresCut(slides[current.index]) ||
					requiresCut(slides[Math.max(0, Math.min(slides.length - 1, next))]),
				index: Math.max(0, Math.min(slides.length - 1, next)),
				timelineIndex: 0,
				venueLanguage: 0,
				challengeStage: 0,
			})),
		[],
	);
	const step = useCallback((direction: number) => {
		setPosition(current => {
			const nextChallenge = current.challengeStage + direction;
			if (current.index === challengesIndex && nextChallenge >= 0 && nextChallenge <= challengeCount) {
				return { ...current, challengeStage: nextChallenge };
			}
			const nextLanguage = current.venueLanguage + direction;
			if (current.index === guidelinesIndex && nextLanguage >= 0 && nextLanguage <= 1) {
				return { ...current, venueLanguage: nextLanguage };
			}
			const nextEvent = current.timelineIndex + direction;
			if (current.index === scheduleIndex && nextEvent >= 0 && nextEvent < scheduleEvents.length) {
				return { ...current, timelineIndex: nextEvent };
			}
			const next = Math.max(0, Math.min(slides.length - 1, current.index + direction));
			return {
				index: next,
				cut: requiresCut(slides[current.index]) || requiresCut(slides[next]),
				challengeStage: next === challengesIndex && direction < 0 ? challengeCount : 0,
				venueLanguage: next === guidelinesIndex && direction < 0 ? 1 : 0,
				timelineIndex: next === scheduleIndex && direction < 0 ? scheduleEvents.length - 1 : 0,
			};
		});
	}, []);
	const fullscreen = useCallback(async () => {
		try {
			if (document.fullscreenElement) await document.exitFullscreen();
			else await document.documentElement.requestFullscreen();
			setFullscreenError("");
		} catch {
			setFullscreenError("Fullscreen is unavailable here. Open this page in a browser and press F11.");
		}
	}, []);

	useEffect(() => {
		const resize = () => setScale(Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT));
		const fromHash = () => {
			const found = slides.findIndex(item => `#${item.id}` === window.location.hash);
			if (found >= 0) go(found);
		};
		resize();
		fromHash();
		window.addEventListener("resize", resize);
		window.addEventListener("hashchange", fromHash);
		return () => {
			window.removeEventListener("resize", resize);
			window.removeEventListener("hashchange", fromHash);
		};
	}, [go]);

	// Wait for the initial hash to be read before replacing it.
	const mounted = useRef(false);
	useEffect(() => {
		if (!mounted.current) {
			mounted.current = true;
			return;
		}
		window.history.replaceState(null, "", `#${slides[index].id}`);
	}, [index]);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (
				event.altKey ||
				event.ctrlKey ||
				event.metaKey ||
				(event.target instanceof HTMLElement &&
					event.target.closest("input, textarea, select, [contenteditable]"))
			)
				return;
			if ((event.key === "0" || event.code === "Numpad0") && slide.id === "mlh") {
				event.preventDefault();
				if (!event.repeat) go(collaboratorsIndex, true);
				return;
			}
			if (event.key.toLowerCase() === "f") {
				event.preventDefault();
				void fullscreen();
				return;
			}
			// Preserve normal button/link activation for keyboard users.
			if (
				(event.key === " " || event.key === "Enter") &&
				event.target instanceof HTMLElement &&
				event.target.closest("button, a, video")
			)
				return;
			if (["ArrowDown", "ArrowRight", "PageDown", " ", "Enter"].includes(event.key)) {
				event.preventDefault();
				if (!event.repeat) step(event.shiftKey ? -1 : 1);
			}
			if (["ArrowUp", "ArrowLeft", "PageUp", "Backspace"].includes(event.key)) {
				event.preventDefault();
				if (!event.repeat) step(-1);
			}
			if (event.key === "Home") {
				event.preventDefault();
				go(0);
			}
			if (event.key === "End") {
				event.preventDefault();
				go(slides.length - 1);
			}
		};

		const onWheel = (event: WheelEvent) => {
			if (event.ctrlKey) return;
			event.preventDefault();
			const now = Date.now();
			const wheel = wheelState.current;
			if (now - wheel.lastWheel > 180) wheel.accumulated = 0;
			wheel.lastWheel = now;
			if (now - wheel.lastStep < 1000) return;
			wheel.accumulated += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? HEIGHT : 1);
			if (Math.abs(wheel.accumulated) > 65) {
				wheel.lastStep = now;
				step(Math.sign(wheel.accumulated));
				wheel.accumulated = 0;
			}
		};
		window.addEventListener("keydown", onKey);
		window.addEventListener("wheel", onWheel, { passive: false });
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("wheel", onWheel);
		};
	}, [step, go, fullscreen, slide.id]);

	return (
		<main className="presentation" data-cut={cut} aria-label="Hack the Hill opening ceremony presentation">
			<div className="presentation-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
				<div
					className="landscape"
					aria-hidden="true"
					style={{
						height: CANVAS_HEIGHT * sceneScale,
						transform: `translate3d(0, ${-slide.y * sceneScale}px, 0)`,
					}}
				>
					<OpeningArtwork />
					{SCENE_LAYERS.filter(layer => layer.name !== "logs" && !HERO_SCENE_LAYERS.has(layer.name)).map(
						layer => (
							<img
								key={layer.name}
								src={`/art/scene/responsive/1920/${layer.name}.webp`}
								alt=""
								width={layer.width}
								height={layer.height}
								draggable={false}
								style={{
									left: layer.x * sceneScale,
									top: layer.y * sceneScale,
									width: layer.width * sceneScale,
								}}
							/>
						),
					)}
					<div
						className="anchor-assembly"
						style={{
							left: 1310,
							top: (anchorSceneTop + anchorBounds.y) * sceneScale + 40,
							width: (anchorBounds.right - anchorBounds.x) * anchorScale,
							height: (anchorBounds.bottom - anchorBounds.y) * anchorScale,
						}}
					>
						{anchor.layers.map((layer, index) => (
							<img
								key={layer.name}
								className={`anchor-layer${layer.name === "layer-15" ? "" : " anchor-chain"}`}
								data-anchor-layer={layer.name}
								src={`/art/presentation/anchor/${layer.name}.webp`}
								alt=""
								width={layer.width}
								height={layer.height}
								draggable={false}
								style={{
									left: (layer.x - anchorBounds.x) * anchorScale,
									top: (layer.y - anchorBounds.y) * anchorScale,
									width: layer.width * anchorScale,
									animationDelay: `${-index * 0.2}s`,
								}}
							/>
						))}
					</div>
				</div>
				<PresentationParticles mode={slide.y < 6300 ? "none" : slide.y < 9000 ? "snow" : "bubbles"} />
				<div className="slide-ribbon" style={{ transform: `translate3d(0, ${-index * HEIGHT}px, 0)` }}>
					{slides.map((item, i) => (
						<section
							className={`presentation-slide text-${item.tone} slide-${item.id}`}
							data-kind={item.kind}
							key={item.id}
							aria-hidden={i !== index}
							ref={node => {
								if (node) node.inert = i !== index;
							}}
							aria-roledescription="slide"
							aria-label={`${i + 1} of ${slides.length}: ${item.title.replace(/\n/g, " ")}`}
							style={{ top: i * HEIGHT }}
						>
							{(slideIcons[item.id] ?? []).map(name => {
								const icon = icons.find(icon => icon.name === name)!;
								return (
									<img
										key={name}
										className={`slide-icon icon-${name}`}
										src={`/art/presentation/icons/${name}.webp`}
										width={icon.width}
										height={icon.height}
										alt=""
										draggable={false}
									/>
								);
							})}
							<SlideContent
								slide={item}
								active={i === index}
								timelineIndex={timelineIndex}
								venueLanguage={venueLanguage}
								challengeStage={challengeStage}
							/>
						</section>
					))}
				</div>
				{/* The clipping frame follows the slide; inverse motion keeps the foliage in the landscape. */}
				<div
					className="guidelines-foreground"
					aria-hidden="true"
					style={{ transform: `translate3d(0, ${(guidelinesIndex - index) * HEIGHT}px, 0)` }}
				>
					<div
						className="guidelines-foreground-origin"
						style={{ transform: `translate3d(0, ${(index - guidelinesIndex) * HEIGHT}px, 0)` }}
					>
						<div
							className="landscape"
							style={{ transform: `translate3d(0, ${-slide.y * sceneScale}px, 0)` }}
						>
							<img
								src="/art/scene/responsive/1920/bush-4.webp"
								alt=""
								width={foreground.width}
								height={foreground.height}
								style={{
									left: foreground.x * sceneScale,
									top: foreground.y * sceneScale,
									width: foreground.width * sceneScale,
								}}
							/>
						</div>
					</div>
				</div>
			</div>
			<BlackoutVideo active={slide.id === "blackout"} />
			<audio ref={ding} className="interlude-ding" src="/art/presentation/ding.mp3" preload="auto" />
			{slide.kind === "black" && slide.id !== "blackout" && (
				<div className="presentation-interlude"><h2>{slide.title}</h2></div>
			)}
			<p className="sr-only" aria-live="polite" aria-atomic="true">
				Slide {index + 1} of {slides.length}: {slide.title}
			</p>
			{fullscreenError && (
				<p className="sr-only" role="status">
					{fullscreenError}
				</p>
			)}
		</main>
	);
}
