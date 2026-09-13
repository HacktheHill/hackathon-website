import { PARTICLE_TYPES, particleStyle } from "./particles";
import { useParticles } from "./useParticles";
import styles from "./ParticleEffects.module.css";

function ParticleEffects() {
	const { effectsRef, mode, particles, removeParticle } = useParticles();

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
									transitionDuration: particle.exiting ? `${particle.exitDuration}ms` : undefined,
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
