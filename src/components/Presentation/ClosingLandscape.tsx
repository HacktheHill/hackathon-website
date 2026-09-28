import { CANVAS_HEIGHT, CANVAS_WIDTH, HERO_SCENE_LAYERS, SCENE_LAYERS } from "../Scene/sceneLayers";
import { OpeningArtwork } from "./OpeningScene";
import PresentationAnchor from "./PresentationAnchor";

export default function ClosingLandscape({ y }: { y: number }) {
	const scale = 1600 / CANVAS_WIDTH;
	return (
		<div
			className="landscape"
			aria-hidden="true"
			style={{ height: CANVAS_HEIGHT * scale, transform: `translate3d(0, ${-y * scale}px, 0)` }}
		>
			<OpeningArtwork />
			{SCENE_LAYERS.filter(layer => layer.name !== "logs" && !HERO_SCENE_LAYERS.has(layer.name)).map(layer => (
				<img
					key={layer.name}
					src={`/art/scene/responsive/1920/${layer.name}.webp`}
					alt=""
					width={layer.width}
					height={layer.height}
					draggable={false}
					style={{ left: layer.x * scale, top: layer.y * scale, width: layer.width * scale }}
				/>
			))}
			<PresentationAnchor />
		</div>
	);
}
