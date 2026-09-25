import { sponsorData } from "../Sponsors/sponsorData";
import cgiDeck from "../../../public/art/presentation/cgi-50/manifest.json";
import mlhDeck from "../../../public/art/presentation/mlh-opening/manifest.json";

export type Slide = {
	id: string;
	title: string;
	french: string;
	kind:
		| "cover"
		| "black"
		| "imported"
		| "agenda"
		| "title"
		| "welcome"
		| "guidelines"
		| "challenges"
		| "sponsors"
		| "sponsor"
		| "schedule"
		| "resources"
		| "rules"
		| "closing";
	y: number;
	tone: "clear" | "cream" | "red" | "ice" | "water";
	note?: string;
	placeholder?: [string, string];
	logos?: { src: string; alt: string; href?: string }[];
	image?: { src: string; alt: string };
	video?: { src: string; label: string; top: number; height: number };
};

// Ceremony order: the supplied opening ceremony PDF. Current event details and
// sponsors: the website. Title-only sections intentionally leave the speech to
// the presenter; no speaker names, challenges, or judging rules are invented.
export const slides: Slide[] = [
	{ id: "opening", title: "Opening ceremony", french: "Cérémonie d’ouverture", kind: "cover", y: 0, tone: "clear" },
	{
		id: "tonight",
		title: "Tonight’s programme",
		french: "Au programme ce soir",
		kind: "agenda",
		y: 1350,
		tone: "red",
	},
	{
		id: "land",
		title: "Land\nacknowledgement",
		french: "Reconnaissance des\nterritoires",
		kind: "title",
		y: 2000,
		tone: "red",
		note: "Land acknowledgement section from reference PDF, page 3. Add the approved spoken acknowledgement before presenting.",
	},
	{
		id: "welcome",
		title: "Welcome to\nHack the Hill III",
		french: "Bienvenue à\nHack the Hill III",
		kind: "welcome",
		y: 2700,
		tone: "red",
	},
	{
		id: "president",
		title: "Presidents’\naddress",
		french: "Discours des\nprésidents",
		kind: "title",
		y: 3200,
		tone: "red",
		note: "President’s address: reference PDF, page 5. Speaker name and speech are not supplied.",
	},
	{
		id: "guidelines",
		title: "Venue rules",
		french: "Règles des lieux",
		kind: "guidelines",
		y: 3300,
		tone: "cream",
	},
	{
		id: "sponsors",
		title: "Made possible by",
		french: "Grâce à nos sponsors",
		kind: "sponsors",
		y: 4900,
		tone: "cream",
		logos: [...sponsorData.sponsors.largest, ...sponsorData.sponsors.large, ...sponsorData.sponsors.small],
	},
	{
		id: "cgi",
		title: "Welcome, CGI",
		french: "Bienvenue à CGI",
		kind: "sponsor",
		y: 6800,
		tone: "ice",
		logos: sponsorData.sponsors.largest,
	},
	...cgiDeck.map<Slide>(page => ({
		id: `cgi-deck-${page.number}`,
		title: page.title,
		french: "Présentation CGI",
		kind: "imported",
		y: 6800,
		tone: "clear",
		image: { src: page.src, alt: page.text },
	})),
	{
		id: "ciena",
		title: "Welcome, Ciena",
		french: "Bienvenue à Ciena",
		kind: "sponsor",
		y: 6940,
		tone: "ice",
		logos: sponsorData.sponsors.large.filter(organization => organization.alt === "Ciena"),
	},
	{
		id: "mlh",
		title: "Welcome, MLH",
		french: "Bienvenue à MLH",
		kind: "sponsor",
		y: 7140,
		tone: "ice",
		logos: [{ src: "/art/presentation/mlh-logo-color.png", alt: "Major League Hacking" }],
	},
	...mlhDeck.map<Slide>(page => ({
		id: `mlh-deck-${page.number}`,
		title: page.title,
		french: "Présentation MLH",
		kind: "imported",
		y: 7140,
		tone: "clear",
		image: { src: page.src, alt: page.text },
		video: page.video ?? undefined,
	})),
	{
		id: "partners",
		title: "Our collaborators",
		french: "Nos collaborateurs",
		kind: "sponsor",
		y: 7350,
		tone: "ice",
		logos: sponsorData.collaborators,
	},
	{
		id: "challenges",
		title: "The challenges",
		french: "Les défis",
		kind: "challenges",
		y: 7550,
		tone: "ice",
		note: "General: any hardware or software project. Civic tech: bring people and government closer together. CGI: an AI-powered complaint triage and response solution, plus an implementation plan for the fictional client. Best FOSS Project must use only open source technology.",
	},
	{
		id: "schedule",
		title: "Run of show",
		french: "Horaire",
		kind: "schedule",
		y: 8150,
		tone: "ice",
		note: "Eight scheduled timeline events in presentationContent.ts. Advance through each event before continuing to hackathon rules.",
	},
	{
		id: "blackout",
		title: "Training video",
		french: "Vidéo de formation",
		kind: "black",
		y: 9300,
		tone: "water",
		note: "Preloaded training video with captions in the spoken language and a three-second black pause before playback. Tape distortion starts at 36.5 seconds and cuts to black at 39.5 seconds. Advance manually through three numbered black slides before hackathon rules.",
	},
	{ id: "blackout-1", title: "1. SHORT, FOCUSED, AND IN SCOPE", french: "", kind: "black", y: 9300, tone: "water" },
	{ id: "blackout-2", title: "2. MANAGE YOUR TIME", french: "", kind: "black", y: 9300, tone: "water" },
	{ id: "blackout-3", title: "3. WHAT GOES IN?\nWHAT GOES OUT?", french: "", kind: "black", y: 9300, tone: "water" },
	{
		id: "rules",
		title: "Hackathon rules",
		french: "Règles du hackathon",
		kind: "rules",
		y: 9300,
		tone: "water",
		note: "Team size and project start rules come from the website FAQ. The attribution rule was added at the organizers’ request for a third rule.",
	},
	{
		id: "judging",
		title: "Judging &\nproject submission",
		french: "Jugement et\nsoumission des projets",
		kind: "title",
		y: 9600,
		tone: "water",
		note: "Judging and submission section: reference PDF, page 20. Add the confirmed judging rubric, submission link, and requirements when available.",
	},
	{ id: "next", title: "What’s next?", french: "Prochaines étapes", kind: "closing", y: 10100, tone: "water" },
	{
		id: "resources",
		title: "Stay connected",
		french: "Restons en contact",
		kind: "resources",
		y: 10550,
		tone: "water",
		note: "Final QR slide: organizer-supplied Discord invite and Track the Hack schedule links.",
	},
];

export const programme = [
	["Welcome & presidents’ address", "Bienvenue et discours des présidents"],
	["Venue rules", "Règles des lieux"],
	["Sponsors & collaborators", "Commanditaires et collaborateurs"],
	["Challenges & key times", "Défis et moments clés"],
	["Hackathon rules & judging", "Règles du hackathon et évaluation"],
	["Next steps & useful links", "Prochaines étapes et liens utiles"],
];
