import CGI from "@/assets/Logos/CGI.svg?url";
import ElevenLabs from "@/assets/Logos/ElevenLabs.svg?url";
import MathemaTech from "@/assets/Logos/MathemaTech.svg?url";

// Verified against the live Devpost prize list on 2026-09-27. See docs/closing-ceremony.md.
export type ClosingSlide = {
	id: string;
	title: string;
	french: string;
	kind?: "award" | "sponsors" | "partners" | "join" | "aside" | "finale" | "agenda" | "reminders";
	logo?: string;
	sponsor?: string;
	prize?: string;
	prizeFrench?: string;
	place?: number;
	copy?: string;
	copyFrench?: string;
	// Fill confirmed results here; missing results remain explicitly unannounced.
	winner?: string;
	members?: string;
};
const mlh = "/art/presentation/mlh-logo-color.png";
const mini: ClosingSlide[] = [
	{ id: "foss", title: "Best FOSS Project", french: "Meilleur projet libre et open source", prize: "$200 CAD" },
	{ id: "ui-ux", title: "Best UI/UX", french: "Meilleure interface et expérience utilisateur", prize: "$200 CAD" },
	{ id: "hardware", title: "Best Hardware Hack", french: "Meilleur projet matériel", prize: "$200 CAD" },
	{
		id: "education",
		title: "Education for Everyone",
		french: "L’éducation pour tout le monde",
		logo: MathemaTech,
		sponsor: "MathemaTech",
		prize: "$200 CAD",
	},
	{
		id: "elevenlabs",
		title: "Best Project Built with ElevenLabs",
		french: "Meilleur projet créé avec ElevenLabs",
		logo: ElevenLabs,
		sponsor: "ElevenLabs",
		prize: "3 months of ElevenLabs Scale + wireless earbuds / person",
		prizeFrench: "3 mois d’ElevenLabs Scale + écouteurs sans fil / personne",
	},
];
const mlhAwards: ClosingSlide[] = [
	[
		"gemini",
		"Best Use of Gemini API",
		"Meilleure utilisation de l’API Gemini",
		"MLH swag kits",
		"Ensembles d’articles MLH",
	],
	["solana", "Best Use of Solana", "Meilleure utilisation de Solana", "Ledger Nano S Plus", "Ledger Nano S Plus"],
	[
		"tiger-data",
		"Best Use of Tiger Data",
		"Meilleure utilisation de Tiger Data",
		"Stream Deck Mini",
		"Stream Deck Mini",
	],
	[
		"presage",
		"Best Use of Presage",
		"Meilleure utilisation de Presage",
		"Fitbit Inspire + Presage perks",
		"Fitbit Inspire + avantages Presage",
	],
	["vultr", "Best Use of Vultr", "Meilleure utilisation de Vultr", "Portable screens", "Écrans portables"],
	["auth0", "Best Use of Auth0", "Meilleure utilisation d’Auth0", "Wireless headphones", "Casques sans fil"],
	[
		"godaddy",
		"Best Domain Name from GoDaddy Registry",
		"Meilleur nom de domaine GoDaddy Registry",
		"Digital gift card",
		"Carte-cadeau numérique",
	],
].map(([id, title, french, prize, prizeFrench]) => ({
	id,
	title,
	french,
	prize,
	prizeFrench,
	logo: mlh,
	sponsor: "Major League Hacking",
}));
const main: ClosingSlide[] = [
	{
		id: "cgi",
		title: "CGI Challenge",
		french: "Défi CGI",
		logo: CGI,
		sponsor: "CGI",
		copy: "The Northwind Brief",
		copyFrench: "Le mandat Northwind",
	},
	{ id: "civic", title: "Civic Technology", french: "Technologie civique" },
	{ id: "general", title: "General Challenge", french: "Défi général" },
].flatMap(track =>
	[3, 2, 1].map(place => ({
		...track,
		id: `${track.id}-${place}`,
		place,
		kind: "award" as const,
		prize: `$${place === 1 ? 500 : place === 2 ? 300 : 200} CAD`,
		...(track.id === "general" && place === 1
			? {
					copy: "+ 3 months of ElevenLabs Pro per team member",
					copyFrench: "+ 3 mois d’ElevenLabs Pro par membre de l’équipe",
				}
			: {}),
	})),
);

export const closingLinks = {
	ctn: "https://linktr.ee/hackthehill",
	stupid: "https://www.instagram.com/stupideas_com/",
};
export const closingSlides: ClosingSlide[] = [
	{
		id: "closing",
		title: "Closing ceremony",
		french: "Cérémonie de clôture",
		copy: "Hack the Hill III · September 27, 2026",
		copyFrench: "Hack the Hill III · 27 septembre 2026",
	},
	{ id: "programme", title: "One last climb", french: "Une dernière ascension", kind: "agenda" },
	{
		id: "hackers",
		title: "Look what you built",
		french: "Regardez ce que vous avez créé",
		copy: "To every hacker, mentor, judge and volunteer: thank you.",
		copyFrench: "À chaque personne qui a créé, accompagné, évalué ou aidé : merci.",
	},
	{ id: "mini-tracks", title: "Mini-challenge awards", french: "Prix des mini-défis" },
	...mini.map(item => ({ ...item, kind: "award" as const })),
	{ id: "mlh-awards", title: "MLH awards", french: "Prix MLH", logo: mlh, sponsor: "Major League Hacking" },
	...mlhAwards.map(item => ({ ...item, kind: "award" as const })),
	{ id: "main-tracks", title: "Main-track awards", french: "Prix des volets principaux" },
	...main,
	{ id: "sponsors", title: "Thank you, sponsors", french: "Merci à nos sponsors", kind: "sponsors" },
	{ id: "partners", title: "Made possible together", french: "Ensemble, tout devient possible", kind: "partners" },
	{ id: "clean-up", title: "Before you go", french: "Avant de partir", kind: "reminders" },
	{ id: "stupid-ideas", title: "Stupid Ideas Hackathon", french: "", kind: "aside" },
	{ id: "join-ctn", title: "Join the CTN team", french: "Rejoignez l’équipe du RTC", kind: "join" },
	{ id: "closing-logo", title: "Hack the Hill III", french: "", kind: "finale" },
];

// Compose each section on a quiet part of the original landscape. Cross the ice
// edge and road during transitions, never through the body of a settled slide.
const cameraStops = [
	10550, 10100, 9900, 9770, 9700, 9630, 9550, 9475, 9400, 7550, 7475, 7400, 7325, 7250, 7175, 7100, 7000, 6800, 6750,
	6700, 6650, 3300, 3250, 3200, 3150, 3100, 3050, 3000, 2900, 2000, 0, 0, 0,
];
export const closingY = (index: number) => cameraStops[index];
export const closingTone = (index: number) => {
	const y = closingY(index);
	return y >= 9000 ? "water" : y >= 6300 ? "ice" : y >= 4000 ? "cream" : y === 0 ? "clear" : "red";
};
