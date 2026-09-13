import type { CSSProperties } from "react";

export type ParticleMode = "none" | "leaves" | "snow" | "bubbles";
export type ParticleType = Exclude<ParticleMode, "none">;

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

export type ActiveParticle = Particle & {
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
	leaves: Array.from({ length: 5 }, (_, index) => `/art/particles/leaf-${index + 1}.webp`),
	snow: Array.from({ length: 7 }, (_, index) => `/art/particles/snow-${index + 1}.webp`),
	bubbles: Array.from({ length: 6 }, (_, index) => `/art/particles/bubble-${index + 1}.webp`),
};

export const PARTICLE_TYPES = ["leaves", "snow", "bubbles"] as const;
export const PARTICLE_MODE_ORDER: ParticleMode[] = ["none", ...PARTICLE_TYPES];
export const SPAWN_INTERVALS: Record<ParticleType, number> = {
	leaves: 3500,
	snow: 550,
	bubbles: 1100,
};
export const MAX_ACTIVE_PARTICLES: Record<ParticleType, number> = {
	leaves: 10,
	snow: 37,
	bubbles: 24,
};
export const PARTICLE_EXPIRY_GRACE_PERIOD = 1000;
export const INITIAL_PARTICLE_PROGRESS = 0.15;
export const STALE_PARTICLE_GRACE_PERIOD = 2500;
export const STALE_PARTICLE_FADE_STAGGER = 90;
export const MIN_STALE_PARTICLE_FADE_STAGGER = 20;
export const STALE_PARTICLE_FADE_DURATION = 700;
export const MIN_STALE_PARTICLE_FADE_DURATION = 180;
const GOLDEN_RATIO_CONJUGATE = 0.618033988749895;

export const createRandom = (seed: number) => () => {
	seed |= 0;
	seed = (seed + 0x6d2b79f5) | 0;
	let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
	return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
};

export const createParticle = (mode: ParticleType, sequence: number, random: () => number): Particle => {
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

export const particleStyle = (particle: Particle): ParticleStyle => ({
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
