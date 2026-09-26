import { useEffect, useState } from "react";
import {
	createParticle,
	createRandom,
	particleStyle,
	PARTICLE_TYPES,
	type ParticleType,
} from "../ParticleEffects/particles";

// Reuse the site's painted particles and motion parameters. All measurements
// live in the 1600 x 900 slide canvas, so projecting at 720p or 4K preserves scale.
const fields = PARTICLE_TYPES.filter(mode => mode !== "leaves").map(mode => {
	const random = createRandom(1729);
	return {
		mode,
		particles: Array.from({ length: mode === "snow" ? 30 : 18 }, (_, i) => {
			const particle = createParticle(mode, i, random);
			return { ...particle, delay: -particle.duration * random() };
		}),
	};
});

export default function PresentationParticles({ mode }: { mode: ParticleType | "none" }) {
	const [paused, setPaused] = useState(false);
	useEffect(() => {
		const update = () => setPaused(document.hidden);
		update();
		document.addEventListener("visibilitychange", update);
		return () => document.removeEventListener("visibilitychange", update);
	}, []);
	return (
		<div className="presentation-particles" aria-hidden="true" data-mode={mode} data-paused={paused}>
			{fields.map(field => (
				<div
					key={field.mode}
					className={`particle-field particles-${field.mode}`}
					data-active={mode === field.mode}
				>
					{field.particles.map((particle, i) => (
						<img
							key={i}
							src={particle.asset}
							alt=""
							className="presentation-particle"
							style={particleStyle(particle)}
						/>
					))}
				</div>
			))}
		</div>
	);
}
