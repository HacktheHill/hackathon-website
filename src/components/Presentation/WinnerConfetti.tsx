import { useEffect, useRef } from "react";
import { createRandom } from "../ParticleEffects/particles";
import { closingSlides, type ClosingSlide } from "./closingContent";
import { awardMotifs, drawMotif, motifPalettes } from "./confettiMotifs";

const patterns = ["crossfire", "streamers", "stars", "fountain", "rain"] as const;
const palettes = [
	["#a9f5d0", "#31cf9b", "#fff3cb", "#ffffff"],
	["#a9ddff", "#c0a8ff", "#ffacd4", "#ffffff"],
	["#ffcc56", "#ff8260", "#fff3cb", "#ffffff"],
	["#72d9ff", "#45b9e8", "#c9f2ff", "#ffffff"],
	["#e4ccff", "#bd8bff", "#ffc17d", "#ffffff"],
];
type Particle = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	rotation: number;
	spin: number;
	size: number;
	color: string;
	shape: "paper" | "ribbon" | "star" | "disc";
	delay: number;
	motif: string | undefined;
	variant: number;
};

export default function WinnerConfetti({ slide }: { slide: ClosingSlide }) {
	const canvas = useRef<HTMLCanvasElement>(null);
	const motif = awardMotifs[slide.id];
	const ordinal = closingSlides.filter(item => item.kind === "award").findIndex(item => item.id === slide.id);
	const pattern =
		slide.place === 1
			? "stars"
			: slide.place === 2
				? "streamers"
				: slide.place === 3
					? "crossfire"
					: patterns[ordinal % patterns.length];
	useEffect(() => {
		const surface = canvas.current;
		const context = surface?.getContext("2d");
		if (!surface || !context) return;
		const motion = matchMedia("(prefers-reduced-motion: reduce)");
		let frame = 0;
		const stop = () => {
			cancelAnimationFrame(frame);
			context.clearRect(0, 0, 1600, 900);
			surface.dataset.running = "false";
		};
		const onMotion = () => {
			if (motion.matches) stop();
		};
		if (motion.matches) return;
		motion.addEventListener("change", onMotion);
		const random = createRandom(179 + ordinal * 127);
		const colors =
			slide.place === 1
				? ["#ffcd47", "#ffe69a", "#fff3cb", "#ffffff"]
				: slide.place === 2
					? ["#b8d4ea", "#e3edfa", "#91b6d6", "#ffffff"]
					: slide.place === 3
						? ["#e8a571", "#ffcb95", "#d2824e", "#fff3cb"]
						: (motifPalettes[motif] ?? palettes[ordinal % palettes.length]);
		const count = slide.place === 1 ? 240 : 160;
		const particles: Particle[] = Array.from({ length: count }, (_, i) => {
			const side = i % 2 === 0 ? 1 : -1;
			const angle = ((25 + random() * 45) * Math.PI) / 180;
			const speed = 800 + random() * 600;
			const rain = pattern === "rain";
			const fountain = pattern === "fountain";
			return {
				x: rain ? random() * 1600 : fountain ? 800 + (random() - 0.5) * 220 : side === 1 ? -20 : 1620,
				y: rain ? -30 - random() * 160 : 880,
				vx: rain ? (random() - 0.5) * 140 : fountain ? (random() - 0.5) * 950 : side * Math.cos(angle) * speed,
				vy: rain ? 120 + random() * 200 : -Math.sin(angle) * speed - (fountain ? 400 : 100),
				rotation: random() * Math.PI * 2,
				spin: (random() - 0.5) * 10,
				size: 7 + random() * 7,
				color: colors[i % colors.length],
				shape:
					pattern === "stars"
						? "star"
						: pattern === "streamers"
							? "ribbon"
							: fountain && i % 3 === 0
								? "disc"
								: "paper",
				delay: rain ? random() * 1.3 : Math.floor(i / 80) * (slide.place === 1 ? 0.35 : 0.15),
				motif: i % 3 !== 0 ? motif : undefined,
				variant: Math.floor(i / 3) + (i % 3),
			};
		});
		const start = performance.now();
		let previous = start;
		surface.dataset.running = "true";
		const draw = (now: number) => {
			const elapsed = (now - start) / 1000;
			const dt = Math.min((now - previous) / 1000, 0.04);
			previous = now;
			context.clearRect(0, 0, 1600, 900);
			if (elapsed > 5) {
				stop();
				return;
			}
			for (const p of particles) {
				if (elapsed < p.delay) continue;
				p.vx *= Math.exp(-0.7 * dt);
				p.vy += 620 * dt;
				p.x += p.vx * dt;
				p.y += p.vy * dt;
				p.rotation += p.spin * dt;
				context.save();
				context.translate(p.x, p.y);
				context.rotate(p.rotation);
				context.scale(1, 0.45 + Math.abs(Math.cos(elapsed * 8 + p.rotation)) * 0.55);
				context.globalAlpha = Math.min(1, Math.max(0, (5 - elapsed) / 0.8));
				context.fillStyle = p.color;
				if (p.motif) {
					drawMotif(context, p.motif, p.size * 1.2, p.variant);
				} else if (p.shape === "star") {
					context.beginPath();
					for (let j = 0; j < 10; j++) {
						const a = (j * Math.PI) / 5 - Math.PI / 2;
						const r = j % 2 === 0 ? p.size : p.size * 0.45;
						context.lineTo(Math.cos(a) * r, Math.sin(a) * r);
					}
					context.closePath();
					context.fill();
				} else if (p.shape === "disc") {
					context.beginPath();
					context.arc(0, 0, p.size / 2, 0, Math.PI * 2);
					context.fill();
				} else {
					const height = p.shape === "ribbon" ? p.size * 3.5 : p.size * 0.65;
					context.fillRect(-p.size / 2, -height / 2, p.size, height);
				}
				context.restore();
			}
			frame = requestAnimationFrame(draw);
		};
		frame = requestAnimationFrame(draw);
		return () => {
			stop();
			motion.removeEventListener("change", onMotion);
		};
	}, [ordinal, pattern, slide.place, motif]);
	return (
		<canvas
			ref={canvas}
			className="winner-confetti"
			width={1600}
			height={900}
			data-pattern={pattern}
			data-award={slide.id}
			data-motif={motif ?? "classic"}
			aria-hidden="true"
		/>
	);
}
