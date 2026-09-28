import type { CSSProperties } from "react";
import VenueSigns from "./VenueSigns";
import { closingLinks, closingSlides, closingY } from "./closingContent";
import { CANVAS_WIDTH, SCENE_LAYERS } from "../Scene/sceneLayers";
import opening from "../../../public/art/presentation/opening/manifest.json";

// Cut the posts to the existing foliage silhouette without painting a second bush.
function signMask(join = false): CSSProperties {
	const layers = join
		? opening.layers.filter(item => ["bush1", "bush2"].includes(item.name))
		: SCENE_LAYERS.filter(item => item.name === "bush-3");
	const scale = 1600 / (join ? opening.canvasWidth : CANVAS_WIDTH);
	const camera = closingY(closingSlides.findIndex(slide => slide.id === (join ? "join-ctn" : "clean-up")));
	const folder = join ? "/art/presentation/opening" : "/art/scene/responsive/1920";
	return {
		maskImage: ["linear-gradient(#fff, #fff)", ...layers.map(layer => `url(${folder}/${layer.name}.webp)`)].join(
			", ",
		),
		maskSize: ["100% 100%", ...layers.map(layer => `${layer.width * scale}px auto`)].join(", "),
		maskPosition: [
			"0 0",
			...layers.map(layer => `${layer.x * scale}px ${layer.y * scale - (camera * 1600) / CANVAS_WIDTH}px`),
		].join(", "),
		maskRepeat: "no-repeat",
		maskComposite: layers.length === 1 ? "subtract" : "subtract, add",
	};
}

const rules = [
	{
		title: "Leave Your Room Clean",
		french: "Laissez la salle propre",
		details: "Clear your workspace.\nGarbage & recycling\nin the bins.",
		detailsFrench: "Nettoyez votre espace.\nTriez les déchets\net le recyclage.",
	},
	{
		title: "Take Everything Home",
		french: "N’oubliez rien",
		details: "Laptop. Charger. Bottle.\nCheck your desk\nand under your chair.",
		detailsFrench: "Portable. Chargeur. Bouteille.\nVérifiez votre table\net sous votre chaise.",
	},
	{
		title: "Return Hardware",
		french: "Rapportez le matériel",
		details: "Return borrowed hardware.\nPick up your ID\nbefore you leave.",
		detailsFrench: "Rapportez le matériel.\nRécupérez votre pièce\nd’identité avant de partir.",
	},
];

const pictograms = ["roomclean", "takehome", "return"].map(name => (
	<img key={name} className="closing-supplied-sign" src={`/art/presentation/closing/${name}.png`} alt="" />
));

export default function ClosingSigns({ language }: { language: number }) {
	return (
		<div className="closing-signs" style={signMask()}>
			<header>
				<h1>{language === 0 ? "Before you go" : "Avant de partir"}</h1>
			</header>
			<VenueSigns language={language} rules={rules} pictograms={pictograms} />
		</div>
	);
}

export function ClosingJoin() {
	return (
		<div className="closing-join-simple">
			<header>
				<h1>Join the CTN team</h1>
				<p lang="fr">Rejoignez l’équipe du RTC</p>
			</header>
			<a href={closingLinks.ctn} target="_blank" rel="noreferrer" aria-label="Join the CTN team">
				<img src="/art/presentation/closing/ctn-qr.png" alt="CTN community links QR code" />
			</a>
		</div>
	);
}
