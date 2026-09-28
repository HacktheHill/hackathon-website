import { useCallback, useEffect, useState } from "react";
import { sponsorData } from "../Sponsors/sponsorData";
import ClosingLandscape from "./ClosingLandscape";
import ClosingSigns, { ClosingJoin } from "./ClosingSigns";
import StupidIdeas from "./StupidIdeas";
import WinnerConfetti from "./WinnerConfetti";
import PresentationParticles from "./PresentationParticles";
import { closingSlides, closingY, closingTone, type ClosingSlide } from "./closingContent";
import "./presentation.css";
import "./closing.css";

function Content({ slide, revealed, active }: { slide: ClosingSlide; revealed: boolean; active: boolean }) {
	if (slide.kind === "reminders") return <ClosingSigns language={revealed ? 1 : 0} />;
	if (slide.kind === "join") return <ClosingJoin />;
	if (slide.kind === "aside") return <StupidIdeas active={active} />;
	if (slide.kind === "finale")
		return (
			<div className="closing-logo-finale">
				<img
					className="closing-final-wordmark"
					src="/art/presentation/opening/wordmark.webp"
					alt="Hack the Hill III"
				/>
			</div>
		);
	const organizations =
		slide.kind === "sponsors" ? Object.values(sponsorData.sponsors).flat() : sponsorData.collaborators;
	return (
		<div className={`closing-content closing-${slide.kind ?? "title"}`}>
			{slide.logo && (
				<div className="closing-logo">
					<img className="logo-snowbank" src="/art/sponsors/snowbank-1.webp" alt="" />
					<img className="sponsor-mark" src={slide.logo} alt={slide.sponsor} />
				</div>
			)}
			{slide.place && (
				<p className="closing-place">
					{slide.place === 1 ? "1st / 1re" : slide.place === 2 ? "2nd / 2e" : "3rd / 3e"}
				</p>
			)}
			<header>
				{slide.id === "closing" ? (
					<>
						<h1 className="sr-only">
							{slide.title} / {slide.french}
						</h1>
						<div className="closing-cover-wordmark" role="img" aria-label="Hack the Hill III">
							<img src="/art/presentation/opening/wordmark.webp" alt="" />
						</div>
					</>
				) : (
					<>
						<h1>{slide.title}</h1>
						<p lang="fr" className="closing-french">
							{slide.french}
						</p>
					</>
				)}
			</header>
			{slide.copy && (
				<div className="closing-copy">
					<p>{slide.copy}</p>
					<p lang="fr">{slide.copyFrench}</p>
				</div>
			)}
			{slide.kind === "award" && (
				<div className="closing-award-result" aria-live="polite">
					<div className="closing-reveal" data-revealed={revealed}>
						<div className="closing-drumroll" aria-hidden={revealed}>
							<h2>Drumroll, please…</h2>
							<p lang="fr">Roulement de tambour…</p>
						</div>
						<div className="closing-winner-bar" aria-hidden={!revealed}>
							<h2
								className="closing-winner-name"
								data-long={(slide.winner || "Winner to be announced").length > 32}
							>
								{slide.winner || "Winner to be announced"}
							</h2>
							{slide.members && <p className="closing-winner-members">{slide.members}</p>}
						</div>
					</div>
					<p className="closing-prize">{slide.prize}</p>
					{slide.prizeFrench && slide.prizeFrench !== slide.prize && (
						<p className="closing-prize-fr" lang="fr">
							{slide.prizeFrench}
						</p>
					)}
				</div>
			)}
			{slide.kind === "agenda" && (
				<ol className="closing-programme">
					{[
						["Celebrate what you built", "Célébrons vos créations"],
						["Mini-challenges & MLH awards", "Mini-défis et prix MLH"],
						["Main-track winners", "Équipes gagnantes des volets principaux"],
						["Your next chapter", "La suite de votre aventure"],
					].map(([en, fr]) => (
						<li key={en}>
							{en}
							<span lang="fr">{fr}</span>
						</li>
					))}
				</ol>
			)}
			{(slide.kind === "sponsors" || slide.kind === "partners") && (
				<div
					className={`sponsor-logos count-${organizations.length} ${slide.kind === "sponsors" ? "sponsor-overview" : "collaborator-logos"}`}
				>
					{organizations.map((org, i) => (
						<a key={org.alt} href={org.href} target="_blank" rel="noreferrer">
							<img className="logo-snowbank" src={`/art/sponsors/snowbank-${i + 1}.webp`} alt="" />
							<img className="sponsor-mark" src={org.src} alt={org.alt} />
						</a>
					))}
				</div>
			)}
		</div>
	);
}

export default function ClosingPresentation() {
	const [{ index, revealed, cut, celebrate }, setPosition] = useState({
		index: 0,
		revealed: false,
		cut: false,
		celebrate: false,
	});
	const [scale, setScale] = useState(1);
	const [fullscreenError, setFullscreenError] = useState("");
	const step = useCallback(
		(direction: number) =>
			setPosition(current => {
				if (
					["award", "reminders"].includes(closingSlides[current.index].kind ?? "") &&
					((direction > 0 && !current.revealed) || (direction < 0 && current.revealed))
				)
					return {
						...current,
						revealed: !current.revealed,
						celebrate: direction > 0 && closingSlides[current.index].kind === "award",
					};
				const next = Math.max(0, Math.min(closingSlides.length - 1, current.index + direction));
				if (next === current.index) return current;
				return {
					index: next,
					celebrate: false,
					revealed: direction < 0 && ["award", "reminders"].includes(closingSlides[next].kind ?? ""),
					cut: closingSlides[current.index].kind === "aside" || closingSlides[next].kind === "aside",
				};
			}),
		[],
	);
	useEffect(() => {
		const resize = () => setScale(Math.min(innerWidth / 1600, innerHeight / 900));
		const hash = () => {
			const [id, reveal] = location.hash.slice(1).split("/");
			const target = ["belongings", "return-hardware"].includes(id)
				? "clean-up"
				: id === "thank-you"
					? "closing-logo"
					: id;
			const index = closingSlides.findIndex(item => item.id === target);
			if (index >= 0)
				setPosition({ index, revealed: reveal === "winner" || reveal === "fr", cut: true, celebrate: false });
		};
		resize();
		hash();
		window.addEventListener("resize", resize);
		window.addEventListener("hashchange", hash);
		return () => {
			window.removeEventListener("resize", resize);
			window.removeEventListener("hashchange", hash);
		};
	}, []);
	useEffect(() => {
		history.replaceState(
			null,
			"",
			`#${closingSlides[index].id}${revealed ? (closingSlides[index].kind === "award" ? "/winner" : "/fr") : ""}`,
		);
	}, [index, revealed]);
	const fullscreen = useCallback(async () => {
		try {
			if (document.fullscreenElement) await document.exitFullscreen();
			else await document.documentElement.requestFullscreen();
		} catch {
			setFullscreenError("Fullscreen unavailable. Use your browser’s fullscreen command.");
		}
	}, []);
	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (
				event.ctrlKey ||
				event.metaKey ||
				event.altKey ||
				(event.target instanceof HTMLElement && event.target.closest("input,textarea,select,[contenteditable]"))
			)
				return;
			if (["ArrowUp", "ArrowRight"].includes(event.key)) {
				event.preventDefault();
				if (!event.repeat) step(1);
			}
			if (["ArrowDown", "ArrowLeft"].includes(event.key)) {
				event.preventDefault();
				if (!event.repeat) step(-1);
			}
			if (event.key.toLowerCase() === "f" && !event.repeat) void fullscreen();
		};
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("keydown", onKey);
		};
	}, [step, fullscreen]);
	const y = closingY(index);
	return (
		<main
			className="presentation closing-presentation"
			data-cut={cut}
			aria-label="Hack the Hill closing ceremony presentation"
			data-index={index}
			data-revealed={revealed}
		>
			<div className="presentation-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
				<ClosingLandscape y={y} />
				<PresentationParticles mode={y > 9000 ? "bubbles" : y > 6300 ? "snow" : "none"} />
				<div className="slide-ribbon" style={{ transform: `translate3d(0, ${index * 900}px, 0)` }}>
					{closingSlides.map((slide, i) => (
						<section
							key={slide.id}
							className={`presentation-slide closing-slide text-${closingTone(i)} slide-${slide.id}`}
							data-kind={slide.kind}
							style={{ top: -i * 900 }}
							aria-hidden={i !== index}
							aria-roledescription="slide"
							aria-label={`${i + 1} of ${closingSlides.length}: ${slide.title}`}
							ref={node => {
								if (node) node.inert = i !== index;
							}}
						>
							<Content slide={slide} revealed={i === index && revealed} active={i === index} />
						</section>
					))}
				</div>
				{celebrate && <WinnerConfetti key={closingSlides[index].id} slide={closingSlides[index]} />}
			</div>
			<p className="sr-only" aria-live="polite">
				Slide {index + 1} of {closingSlides.length}: {closingSlides[index].title}
			</p>
			{fullscreenError && (
				<p role="status" className="sr-only">
					{fullscreenError}
				</p>
			)}
		</main>
	);
}
