import { useCallback, useEffect, useRef, useState } from "react";
import {
	INITIAL_PARTICLE_PROGRESS,
	MAX_ACTIVE_PARTICLES,
	MIN_STALE_PARTICLE_FADE_DURATION,
	MIN_STALE_PARTICLE_FADE_STAGGER,
	PARTICLE_EXPIRY_GRACE_PERIOD,
	PARTICLE_MODE_ORDER,
	PARTICLE_TYPES,
	SPAWN_INTERVALS,
	STALE_PARTICLE_FADE_DURATION,
	STALE_PARTICLE_FADE_STAGGER,
	STALE_PARTICLE_GRACE_PERIOD,
	createParticle,
	createRandom,
	type ActiveParticle,
	type ParticleMode,
	type ParticleType,
} from "./particles";

// Mode, visibility, spawning and fading effects run in this order.
export function useParticles() {
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
				unexpired.filter(existing => existing.mode === particleMode).length +
					1 -
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
			STALE_PARTICLE_FADE_STAGGER - (STALE_PARTICLE_FADE_STAGGER - MIN_STALE_PARTICLE_FADE_STAGGER) * urgency,
		);
		const fadeDuration = Math.round(
			STALE_PARTICLE_FADE_DURATION - (STALE_PARTICLE_FADE_DURATION - MIN_STALE_PARTICLE_FADE_DURATION) * urgency,
		);

		setParticles(current => {
			const exitDelays = new Map<number, number>();

			PARTICLE_TYPES.forEach(particleMode => {
				current
					.filter(
						particle => particle.mode === particleMode && particle.mode !== activeMode && !particle.exiting,
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
					PARTICLE_MODE_ORDER.indexOf(nextMode) > PARTICLE_MODE_ORDER.indexOf(previousMode) ? "down" : "up";
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
					transition.direction === "down" ? viewportProbe - boundaryTop : boundaryTop - viewportProbe;
				urgency = Math.min(Math.max(distance / (window.innerHeight * 0.75), 0), 1);
			}
			const atPageExtreme =
				window.scrollY <= 2 || window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
			if (atPageExtreme) urgency = 1;
			const quantizedUrgency = Math.round(urgency * 20) / 20;
			setFadeUrgency(current => (current === quantizedUrgency ? current : quantizedUrgency));
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
		const timeout = window.setTimeout(() => fadeStaleParticles(mode, fadeUrgency), gracePeriod);
		return () => window.clearTimeout(timeout);
	}, [fadeStaleParticles, fadeUrgency, mode]);

	return { effectsRef, mode, particles, removeParticle };
}
