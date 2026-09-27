// Small silhouettes only: keep these legible as tumbling paper, not tiny illustrations.
export const awardMotifs: Record<string, string> = {
	foss: "code",
	"ui-ux": "cursor",
	hardware: "bolt",
	education: "math",
	elevenlabs: "elevenlabs",
	gemini: "gemini",
	solana: "solana",
};
export const motifPalettes: Record<string, string[]> = {
	gemini: ["#4285f4", "#78b7ff", "#b2d1ff", "#ffffff"],
	solana: ["#14f195", "#b38aff", "#80eedf", "#ffffff"],
	math: ["#72d9ff", "#ffe6a7", "#c9f2ff", "#ffffff"],
};
const paths = {
	gemini: "M0 -1 C.12 -.4 .4 -.12 1 0 C.4 .12 .12 .4 0 1 C-.12 .4 -.4 .12 -1 0 C-.4 -.12 -.12 -.4 0 -1Z",
	cursor: "M-.6 -1 .85 .2 .18 .3 .5 .9 .1 1 -.22 .4 -.65 .85Z",
	bolt: "M.1 -1 -.8 .15 -.15 .15 -.35 1 .8 -.25 .1 -.25Z",
};
const cachedPaths: Partial<Record<keyof typeof paths, Path2D>> = {};
const path = (name: keyof typeof paths) => cachedPaths[name] ?? (cachedPaths[name] = new Path2D(paths[name]));
const math = ["ƒ", "∑", "π", "∫", "+", "x²"];
const code = ["{", "}", "<", ">"];

export function drawMotif(ctx: CanvasRenderingContext2D, motif: string, size: number, variant: number) {
	if (motif === "math" || motif === "code") {
		ctx.font = `bold ${size * 2.2}px ${motif === "math" ? "Georgia" : "monospace"}`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		const symbols = motif === "math" ? math : code;
		ctx.fillText(symbols[variant % symbols.length], 0, 0);
		return;
	}
	ctx.scale(size, size);
	if (motif === "gemini") {
		// Gemini's simple four-point spark; Google color treatment, no wordmark.
		const gradient = ctx.createLinearGradient(-1, -0.8, 1, 1);
		gradient.addColorStop(0, "#4285f4");
		gradient.addColorStop(0.4, "#4285f4");
		gradient.addColorStop(0.6, "#ea4335");
		gradient.addColorStop(0.8, "#fbbc04");
		gradient.addColorStop(1, "#34a853");
		ctx.fillStyle = gradient;
		ctx.fill(path("gemini"));
	} else if (motif === "cursor") ctx.fill(path("cursor"));
	else if (motif === "bolt") ctx.fill(path("bolt"));
	else if (motif === "elevenlabs") {
		ctx.fillRect(-0.65, -1, 0.45, 2);
		ctx.fillRect(0.2, -1, 0.45, 2);
	} else if (motif === "solana") {
		for (let i = 0; i < 3; i++) {
			const y = -0.9 + i * 0.7;
			const lean = i === 1 ? -0.3 : 0.3;
			ctx.beginPath();
			ctx.moveTo(-0.8 + lean, y);
			ctx.lineTo(0.8 + lean, y);
			ctx.lineTo(0.8 - lean, y + 0.4);
			ctx.lineTo(-0.8 - lean, y + 0.4);
			ctx.closePath();
			ctx.fill();
		}
	}
}
