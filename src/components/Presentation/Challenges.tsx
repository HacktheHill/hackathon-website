import CGI from "@/assets/Logos/CGI.svg?url";
import ElevenLabs from "@/assets/Logos/ElevenLabs.svg?url";
import MathemaTech from "@/assets/Logos/MathemaTech.svg?url";

const miniChallenges = [
	{
		name: "Best Project Built with ElevenLabs",
		french: "Meilleur projet créé avec ElevenLabs",
		logo: ElevenLabs,
		sponsor: "ElevenLabs",
	},
	{
		name: "MLH Mini-Challenges",
		french: "Mini-défis MLH",
		logo: "/art/presentation/mlh-logo-color.png",
		sponsor: "Major League Hacking",
	},
	{ name: "Best Educational Project", french: "Meilleur projet éducatif", logo: MathemaTech, sponsor: "MathemaTech" },
	{ name: "Best FOSS Project", french: "Meilleur projet libre et open source" },
	{ name: "Best UI/UX", french: "Meilleure interface et expérience utilisateur" },
	{ name: "Best Hardware Hack", french: "Meilleur projet matériel" },
];

const mainTracks = [
	{ name: "General challenge", french: "Défi général" },
	{ name: "Civic tech challenge", french: "Défi de technologie civique" },
	{ name: "CGI challenge", french: "Défi CGI", logo: CGI, sponsor: "CGI" },
];

export const challengeCount = mainTracks.length + miniChallenges.length;
const challenges = [...mainTracks, ...miniChallenges];

export default function Challenges({ stage }: { stage: number }) {
	const challenge = challenges[stage - 1];
	return (
		<section
			className={`challenge-view ${stage === 0 ? "challenge-overview" : "challenge-detail"}`}
			data-stage={stage}
			aria-live="polite"
		>
			{stage === 0 ? (
				<>
					{[
						{ items: miniChallenges, name: "Mini-challenges", french: "Mini-défis" },
						{ items: mainTracks, name: "Main tracks", french: "Volets principaux" },
					].map(group => (
						<div key={group.name}>
							<h3>
								{group.name} <span lang="fr">/ {group.french}</span>
							</h3>
							<ul>
								{group.items.map(item => (
									<li key={item.name}>
										<div>
											<p>{item.name}</p>
											<p lang="fr">{item.french}</p>
										</div>
										{item.logo && <img src={item.logo} alt={item.sponsor} />}
									</li>
								))}
							</ul>
						</div>
					))}
				</>
			) : (
				<>
					<h3>
						{stage <= mainTracks.length ? "Main tracks" : "Mini-challenges"}{" "}
						<span lang="fr">/ {stage <= mainTracks.length ? "Volets principaux" : "Mini-défis"}</span>
					</h3>
					<div className="challenge-focus" key={stage}>
						<p>{challenge.name}</p>
						<p lang="fr">{challenge.french}</p>
						{challenge.logo && <img src={challenge.logo} alt={challenge.sponsor} />}
					</div>
				</>
			)}
		</section>
	);
}
