import { useEffect, useState, type CSSProperties } from "react";
import styles from "./ParticleEffects.module.css";

type ParticleMode = "none" | "leaves" | "snow" | "bubbles";

type Particle = {
	asset: string;
	delay: number;
	duration: number;
	left: number;
	opacity: number;
	rotations: number[];
	size: number;
	x: number[];
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

const createRandom = (seed: number) => () => {
	seed |= 0;
	seed = (seed + 0x6d2b79f5) | 0;
	let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
	return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
};

const createParticles = (
	mode: Exclude<ParticleMode, "none">,
	count: number,
	seed: number,
): Particle[] => {
	const random = createRandom(seed);
	const assets = PARTICLE_ASSETS[mode];
	const ranges = {
		leaves: { duration: [17, 28], opacity: [0.28, 0.58], size: [30, 64] },
		snow: { duration: [11, 19], opacity: [0.38, 0.78], size: [7, 18] },
		bubbles: { duration: [14, 24], opacity: [0.38, 0.72], size: [18, 54] },
	}[mode];

	return Array.from({ length: count }, (_, index) => {
		const duration = ranges.duration[0] + random() * (ranges.duration[1] - ranges.duration[0]);
		const drift = (random() - 0.5) * 90;
		const sway = mode === "leaves" ? 32 + random() * 48 : 8 + random() * 26;
		const direction = random() > 0.5 ? 1 : -1;
		const turn = direction * (180 + random() * 420);
		const leafTilt = direction * (6 + random() * 8);

		return {
			asset: assets[index % assets.length],
			delay: -random() * duration,
			duration,
			left: ((index + random()) / count) * 100,
			opacity:
				ranges.opacity[0] + random() * (ranges.opacity[1] - ranges.opacity[0]),
			rotations:
				mode === "leaves"
					? [leafTilt, -leafTilt * 0.8, leafTilt * 0.7, -leafTilt * 0.45]
					: mode === "bubbles"
						? [0, 0, 0, 0]
						: [turn * 0.18, turn * 0.45, turn * 0.72, turn],
			size: ranges.size[0] + random() * (ranges.size[1] - ranges.size[0]),
			x: [drift * 0.2 + sway, drift * 0.5 - sway, drift * 0.75 + sway, drift],
		};
	});
};

const PARTICLES = {
	leaves: createParticles("leaves", 13, 1729),
	snow: createParticles("snow", 30, 2843),
	bubbles: createParticles("bubbles", 18, 3917),
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
	width: `${particle.size}px`,
});

function ParticleEffects() {
	const [mode, setMode] = useState<ParticleMode>("none");

	useEffect(() => {
		const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		let frame = 0;

		const updateMode = () => {
			frame = 0;
			if (motionQuery.matches) {
				setMode("none");
				return;
			}

			const welcome = document.querySelector<HTMLElement>("#about");
			const testimonials = document.querySelector<HTMLElement>("#testimonials");
			const faq = document.querySelector<HTMLElement>("#faq");
			if (!welcome || !testimonials || !faq) return;

			const viewportProbe = window.innerHeight * 0.52;
			let nextMode: ParticleMode = "none";
			if (welcome.getBoundingClientRect().top <= viewportProbe) nextMode = "leaves";
			if (testimonials.getBoundingClientRect().top <= viewportProbe) nextMode = "snow";
			if (faq.getBoundingClientRect().top <= viewportProbe) nextMode = "bubbles";
			setMode(current => (current === nextMode ? current : nextMode));
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

	return (
		<div className={styles.effects} data-mode={mode} aria-hidden="true">
			{mode !== "none" && (
				<div className={`${styles.field} ${styles[mode]}`}>
					{PARTICLES[mode].map((particle, index) => (
						<img
							key={`${mode}-${index}`}
							className={styles.particle}
							src={particle.asset}
							alt=""
							decoding="async"
							style={particleStyle(particle)}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default ParticleEffects;
