import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./ParticleEffects.module.css";

type ParticleMode = "none" | "leaves" | "snow" | "bubbles";
type ParticleType = Exclude<ParticleMode, "none">;

type Particle = {
	asset: string;
	delay: number;
	duration: number;
	left: number;
	opacity: number;
	rotations: number[];
	size: number;
	top: number;
	x: number[];
};

type ActiveParticle = Particle & {
	expiresAt: number;
	id: number;
	mode: ParticleType;
	exiting?: boolean;
	exitDelay?: number;
	exitDuration?: number;
};

type ParticleStyle = CSSProperties & {
	"--particle-rotation-1": string;
	"--particle-rotation-2": string;
	"--particle-rotation-3": string;
	"--particle-rotation-4": string;
	"--particle-x-1": string;
	"--particle-x-2": string;
	"--particle-x-3": string;
	"--particle-x-4": string;
};

const PARTICLE_ASSETS = {
	leaves: Array.from({ length: 5 }, (_, index) =>
		`/art/particles/leaf-${index + 1}.webp`,
	),
	snow: Array.from({ length: 7 }, (_, index) =>
		`/art/particles/snow-${index + 1}.webp`,
	),
	bubbles: Array.from({ length: 6 }, (_, index) =>
		`/art/particles/bubble-${index + 1}.webp`,
	),
};

const PARTICLE_TYPES = ["leaves", "snow", "bubbles"] as const;
const PARTICLE_MODE_ORDER: ParticleMode[] = ["none", ...PARTICLE_TYPES];
const SPAWN_INTERVALS: Record<ParticleType, number> = {
	leaves: 3500,
	snow: 550,
	bubbles: 1100,
};
const MAX_ACTIVE_PARTICLES: Record<ParticleType, number> = {
	leaves: 10,
	snow: 37,
	bubbles: 24,
};
const PARTICLE_EXPIRY_GRACE_PERIOD = 1000;
const INITIAL_PARTICLE_PROGRESS = 0.15;
const STALE_PARTICLE_GRACE_PERIOD = 2500;
const STALE_PARTICLE_FADE_STAGGER = 90;
const MIN_STALE_PARTICLE_FADE_STAGGER = 20;
const STALE_PARTICLE_FADE_DURATION = 700;
const MIN_STALE_PARTICLE_FADE_DURATION = 180;
const GOLDEN_RATIO_CONJUGATE = 0.618033988749895;

const createRandom = (seed: number) => () => {
	seed |= 0;
	seed = (seed + 0x6d2b79f5) | 0;
	let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
	return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
};

const createParticle = (mode: ParticleType, sequence: number, random: () => number): Particle => {
	const assets = PARTICLE_ASSETS[mode];
	const ranges = {
		leaves: { duration: [17, 28], opacity: [0.28, 0.58], size: [30, 64] },
		snow: { duration: [11, 19], opacity: [0.38, 0.78], size: [7, 18] },
		bubbles: { duration: [14, 24], opacity: [0.38, 0.72], size: [18, 54] },
	}[mode];
	const duration = ranges.duration[0] + random() * (ranges.duration[1] - ranges.duration[0]);
	const drift = (random() - 0.5) * 90;
	const sway = mode === "leaves" ? 32 + random() * 48 : 8 + random() * 26;
	const direction = random() > 0.5 ? 1 : -1;
	const turn = direction * (180 + random() * 420);
	const leafTilt = direction * (6 + random() * 8);
	const distributedPosition = (sequence * GOLDEN_RATIO_CONJUGATE + random() * 0.06) % 1;

	return {
		asset: assets[sequence % assets.length],
		delay: 0,
		duration,
		left: distributedPosition * 100,
		opacity: ranges.opacity[0] + random() * (ranges.opacity[1] - ranges.opacity[0]),
		rotations:
			mode === "leaves"
				? [leafTilt, -leafTilt * 0.8, leafTilt * 0.7, -leafTilt * 0.45]
				: mode === "bubbles"
					? [0, 0, 0, 0]
					: [turn * 0.18, turn * 0.45, turn * 0.72, turn],
		size: ranges.size[0] + random() * (ranges.size[1] - ranges.size[0]),
		top: 0,
		x: [drift * 0.2 + sway, drift * 0.5 - sway, drift * 0.75 + sway, drift],
	};
};

const particleStyle = (particle: Particle): ParticleStyle => ({
	"--particle-rotation-1": `${particle.rotations[0]}deg`,
	"--particle-rotation-2": `${particle.rotations[1]}deg`,
	"--particle-rotation-3": `${particle.rotations[2]}deg`,
	"--particle-rotation-4": `${particle.rotations[3]}deg`,
	"--particle-x-1": `${particle.x[0]}px`,
	"--particle-x-2": `${particle.x[1]}px`,
	"--particle-x-3": `${particle.x[2]}px`,
	"--particle-x-4": `${particle.x[3]}px`,
	animationDelay: `${particle.delay}s`,
	animationDuration: `${particle.duration}s`,
	left: `${particle.left}%`,
	opacity: particle.opacity,
	top: `${particle.top}px`,
	width: `${particle.size}px`,
});

function ParticleEffects() {
	const [mode, setMode] = useState<ParticleMode>("none");
	const [fadeUrgency, setFadeUrgency] = useState(0);
	const [isPageVisible, setIsPageVisible] = useState(true);
	const [particles, setParticles] = useState<ActiveParticle[]>([]);
	const effectsRef = useRef<HTMLDivElement>(null);
	const nextParticleId = useRef(0);
	const random = useRef(createRandom(1729));
	const modeRef = useRef<ParticleMode>("none");
	const transitionBoundary = useRef<{
		direction: "up" | "down";
		element: HTMLElement;
	} | null>(null);

	const spawnParticle = useCallback((particleMode: ParticleType, startsInViewport = false) => {
		const id = nextParticleId.current++;
		const createdAt = Date.now();
		const particle = createParticle(particleMode, id, random.current);
		const effectsTop = effectsRef.current?.getBoundingClientRect().top ?? 0;
		const activeParticle: ActiveParticle = {
			...particle,
			delay: startsInViewport ? -particle.duration * INITIAL_PARTICLE_PROGRESS : 0,
			expiresAt: createdAt + particle.duration * 1000 + PARTICLE_EXPIRY_GRACE_PERIOD,
			id,
			mode: particleMode,
			top: Math.max(-effectsTop, 0),
		};

		setParticles(current => {
			const unexpired = current.filter(existing => existing.expiresAt > createdAt);
			let overflow = Math.max(
				unexpired.filter(existing => existing.mode === particleMode).length + 1 -
					MAX_ACTIVE_PARTICLES[particleMode],
				0,
			);
			const withinLimit = unexpired.filter(existing => {
				if (existing.mode !== particleMode || overflow === 0) return true;
				overflow -= 1;
				return false;
			});

			return [...withinLimit, activeParticle];
		});
	}, []);

	const removeParticle = useCallback((id: number) => {
		setParticles(current => current.filter(particle => particle.id !== id));
	}, []);

	const fadeStaleParticles = useCallback((activeMode: ParticleMode, urgency: number) => {
		const positions = new Map<number, number>();
		document.querySelectorAll<HTMLElement>("[data-particle-id]").forEach(element => {
			positions.set(Number(element.dataset.particleId), element.getBoundingClientRect().top);
		});
		const fadeStagger = Math.round(
			STALE_PARTICLE_FADE_STAGGER -
				(STALE_PARTICLE_FADE_STAGGER - MIN_STALE_PARTICLE_FADE_STAGGER) * urgency,
		);
		const fadeDuration = Math.round(
			STALE_PARTICLE_FADE_DURATION -
				(STALE_PARTICLE_FADE_DURATION - MIN_STALE_PARTICLE_FADE_DURATION) * urgency,
		);

		setParticles(current => {
			const exitDelays = new Map<number, number>();

			PARTICLE_TYPES.forEach(particleMode => {
				current
					.filter(
						particle =>
							particle.mode === particleMode && particle.mode !== activeMode && !particle.exiting,
					)
					.sort((left, right) => {
						const leftTop = positions.get(left.id) ?? 0;
						const rightTop = positions.get(right.id) ?? 0;
						return particleMode === "bubbles" ? leftTop - rightTop : rightTop - leftTop;
					})
					.forEach((particle, index) => {
						exitDelays.set(particle.id, index * fadeStagger);
					});
			});

			return current.map(particle =>
				exitDelays.has(particle.id)
					? {
							...particle,
							exiting: true,
							exitDelay: exitDelays.get(particle.id),
							exitDuration: fadeDuration,
						}
					: particle,
			);
		});
	}, []);

	useEffect(() => {
		const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		let frame = 0;

		const updateMode = () => {
			frame = 0;
			if (motionQuery.matches) {
				modeRef.current = "none";
				transitionBoundary.current = null;
				setMode("none");
				setFadeUrgency(1);
				setParticles([]);
				return;
			}

			const welcome = document.querySelector<HTMLElement>("#about");
			const testimonials = document.querySelector<HTMLElement>("#testimonials");
			const faq = document.querySelector<HTMLElement>("#faq");
			if (!welcome || !testimonials || !faq) return;
			const boundaries: Record<ParticleType, HTMLElement> = {
				leaves: welcome,
				snow: testimonials,
				bubbles: faq,
			};

			const viewportProbe = window.innerHeight * 0.52;
			let nextMode: ParticleMode = "none";
			if (welcome.getBoundingClientRect().top <= viewportProbe) nextMode = "leaves";
			if (testimonials.getBoundingClientRect().top <= viewportProbe) nextMode = "snow";
			if (faq.getBoundingClientRect().top <= viewportProbe) nextMode = "bubbles";

			if (nextMode !== modeRef.current) {
				const previousMode = modeRef.current;
				const direction =
					PARTICLE_MODE_ORDER.indexOf(nextMode) > PARTICLE_MODE_ORDER.indexOf(previousMode)
						? "down"
						: "up";
				const boundaryMode = (direction === "down" ? nextMode : previousMode) as ParticleType;
				transitionBoundary.current = {
					direction,
					element: boundaries[boundaryMode],
				};
				modeRef.current = nextMode;
				setMode(nextMode);
			}

			const transition = transitionBoundary.current;
			let urgency = 0;
			if (transition) {
				const boundaryTop = transition.element.getBoundingClientRect().top;
				const distance =
					transition.direction === "down"
						? viewportProbe - boundaryTop
						: boundaryTop - viewportProbe;
				urgency = Math.min(Math.max(distance / (window.innerHeight * 0.75), 0), 1);
			}
			const atPageExtreme =
				window.scrollY <= 2 ||
				window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
			if (atPageExtreme) urgency = 1;
			const quantizedUrgency = Math.round(urgency * 20) / 20;
			setFadeUrgency(current =>
				current === quantizedUrgency ? current : quantizedUrgency,
			);
		};

		const requestUpdate = () => {
			if (!frame) frame = window.requestAnimationFrame(updateMode);
		};

		updateMode();
		window.addEventListener("scroll", requestUpdate, { passive: true });
		window.addEventListener("resize", requestUpdate);
		motionQuery.addEventListener("change", requestUpdate);

		return () => {
			window.removeEventListener("scroll", requestUpdate);
			window.removeEventListener("resize", requestUpdate);
			motionQuery.removeEventListener("change", requestUpdate);
			if (frame) window.cancelAnimationFrame(frame);
		};
	}, []);

	useEffect(() => {
		const updateVisibility = () => {
			const isVisible = !document.hidden;
			setIsPageVisible(isVisible);
			if (!isVisible) setParticles([]);
		};

		updateVisibility();
		document.addEventListener("visibilitychange", updateVisibility);
		return () => document.removeEventListener("visibilitychange", updateVisibility);
	}, []);

	useEffect(() => {
		if (mode === "none" || !isPageVisible) return;

		spawnParticle(mode, true);
		const interval = window.setInterval(() => spawnParticle(mode), SPAWN_INTERVALS[mode]);
		return () => window.clearInterval(interval);
	}, [isPageVisible, mode, spawnParticle]);

	useEffect(() => {
		const gracePeriod = Math.round(STALE_PARTICLE_GRACE_PERIOD * (1 - fadeUrgency));
		const timeout = window.setTimeout(
			() => fadeStaleParticles(mode, fadeUrgency),
			gracePeriod,
		);
		return () => window.clearTimeout(timeout);
	}, [fadeStaleParticles, fadeUrgency, mode]);

	return (
		<div ref={effectsRef} className={styles.effects} data-mode={mode} aria-hidden="true">
			{PARTICLE_TYPES.map(particleMode => {
				const visibleParticles = particles.filter(particle => particle.mode === particleMode);
				if (visibleParticles.length === 0) return null;

				return (
					<div key={particleMode} className={`${styles.field} ${styles[particleMode]}`}>
						{visibleParticles.map(particle => (
						<img
							key={particle.id}
							className={styles.particle}
							data-particle-id={particle.id}
							data-exiting={particle.exiting ? "" : undefined}
							src={particle.asset}
							alt=""
							decoding="async"
							style={{
								...particleStyle(particle),
								transitionDelay: particle.exiting ? `${particle.exitDelay}ms` : undefined,
								transitionDuration: particle.exiting
									? `${particle.exitDuration}ms`
									: undefined,
							}}
							onAnimationEnd={() => removeParticle(particle.id)}
							onTransitionEnd={event => {
								if (particle.exiting && event.propertyName === "opacity") {
									removeParticle(particle.id);
								}
							}}
						/>
						))}
					</div>
				);
			})}
		</div>
	);
}

export default ParticleEffects;
