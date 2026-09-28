// Enter confirmed project titles and member names here.
// Leave winner empty until confirmed; the deck will show “Winner to be announced”.
export const closingWinners: Record<string, { winner: string; members: string }> = {
	// Local mini-challenges
	foss: { winner: "Guitaroids", members: "" },
	"ui-ux": { winner: "Babbli", members: "" },
	hardware: { winner: "Flick Note", members: "" },
	education: { winner: "Babbli", members: "" }, // MathemaTech
	elevenlabs: { winner: "Babbli", members: "" },

	// MLH awards
	gemini: { winner: "Mamdani", members: "" },
	solana: { winner: "Versus", members: "" },
	"tiger-data": { winner: "What the Hill", members: "" },
	presage: { winner: "MindSpace", members: "" },
	vultr: { winner: "Arrive", members: "" },
	auth0: { winner: "Follow the Bill", members: "" },
	godaddy: { winner: "pleasehelpme.study", members: "" },

	// Main tracks: third, second, then first place
	"cgi-3": { winner: "Mk solutions", members: "" },
	"cgi-2": { winner: "TrueSight", members: "" },
	"cgi-1": { winner: "NorthFlow", members: "" },
	"civic-3": { winner: "evidently", members: "" },
	"civic-2": { winner: "Porchlight", members: "" },
	"civic-1": { winner: "VitaSpectra", members: "" },
	"general-3": { winner: "Babbli", members: "" },
	"general-2": { winner: "gymlens", members: "" },
	"general-1": { winner: "Dx – Simulated Patient Diagnosis Platform", members: "" },
};
