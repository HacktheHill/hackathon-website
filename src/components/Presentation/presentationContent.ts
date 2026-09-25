// Venue rules supplied by the organizers, grouped into the three road signs.
// Competition rules belong on #rules, not on these venue signs.
export const venueRules = [
	{
		title: "No Eating in Classrooms",
		french: "Ne pas manger en classe",
		details: "Meals in Common Areas\nand Lobbies Only",
		detailsFrench: "Repas dans les\naires communes et\nles halls uniquement",
	},
	{
		title: "Safety First",
		french: "Sécurité",
		details: "No Knives, Guns,\nSharp Objects, Alcohol,\nSmoking or Drugs",
		detailsFrench: "Aucun couteau,\narme à feu,\nobjet tranchant, alcool,\ntabac ou drogue",
	},
	{
		title: "Outlets",
		french: "Prises",
		details: "Plug In Smartphones\nand Laptops Only",
		detailsFrench: "Branchez uniquement\nsmartphones et\nordinateurs portables",
	},
];

export const scheduleEvents = [
	{ day: "Friday", dayFrench: "Vendredi", time: "9:30 p.m.", title: "Hacking begins", french: "Début du hackathon" },
	{
		day: "Friday",
		dayFrench: "Vendredi",
		time: "10:00 p.m.",
		title: "Intro to Web Development",
		french: "Introduction au développement web",
	},
	{
		day: "Saturday",
		dayFrench: "Samedi",
		time: "12:00 a.m.",
		title: "Intro to Hardware",
		french: "Introduction au matériel informatique",
	},
	{
		day: "Saturday",
		dayFrench: "Samedi",
		time: "10:00 a.m.",
		title: "MLH Workshops",
		french: "Ateliers MLH",
	},
	{
		day: "Saturday",
		dayFrench: "Samedi",
		time: "3:00 p.m.",
		title: "Machine Learning Workshop",
		french: "Atelier d’apprentissage automatique",
	},
	{ day: "Saturday", dayFrench: "Samedi", time: "5:00 p.m.", title: "LeetCode Games", french: "Jeux LeetCode" },
	{
		day: "Saturday",
		dayFrench: "Samedi",
		time: "10:00 p.m.",
		title: "Intro to Devpost & Pitching Advice",
		french: "Introduction à Devpost et conseils de présentation",
	},
	{
		day: "Sunday",
		dayFrench: "Dimanche",
		time: "10:00 a.m.",
		title: "Devpost closes",
		french: "Clôture des soumissions sur Devpost",
	},
];

// Supply confirmed destinations and locally generated QR assets together.
// Until then, show clearly labelled spaces rather than nonfunctional QR patterns.
export const resourceLinks = [
	{
		name: "Track the Hack",
		description: "Event schedule",
		french: "Horaire de l’événement",
		url: "https://tracker.hackthehill.com/schedule",
		qrSrc: "/art/presentation/track-the-hack-qr.png",
	},
	{
		name: "Discord",
		description: "Community & support",
		french: "Communauté et soutien",
		url: "https://discord.gg/NNnZ4KYAS",
		qrSrc: "/art/presentation/discord-qr.png",
	},
];
