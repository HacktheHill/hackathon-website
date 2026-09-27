import { CANVAS_WIDTH, SCENE_LAYERS } from "../Scene/sceneLayers";
import anchor from "../../../public/art/presentation/anchor/manifest.json";

const sceneScale = 1600 / CANVAS_WIDTH;
const anchorScale = sceneScale * 0.82;
const anchorSceneTop = SCENE_LAYERS.find(layer => layer.name === "ice-1")!.y;
const bounds = {
	x: Math.min(...anchor.layers.map(layer => layer.x)),
	y: Math.min(...anchor.layers.map(layer => layer.y)),
	right: Math.max(...anchor.layers.map(layer => layer.x + layer.width)),
	bottom: Math.max(...anchor.layers.map(layer => layer.y + layer.height)),
};

// Shared with the opening deck: original PSD placement and independent chain motion.
export default function PresentationAnchor() {
	return (
		<div
			className="anchor-assembly"
			style={{
				left: 1310,
				top: (anchorSceneTop + bounds.y) * sceneScale + 40,
				width: (bounds.right - bounds.x) * anchorScale,
				height: (bounds.bottom - bounds.y) * anchorScale,
			}}
		>
			{anchor.layers.map((layer, index) => (
				<img
					key={layer.name}
					className={`anchor-layer${layer.name === "layer-15" ? "" : " anchor-chain"}`}
					data-anchor-layer={layer.name}
					src={`/art/presentation/anchor/${layer.name}.webp`}
					alt=""
					width={layer.width}
					height={layer.height}
					draggable={false}
					style={{
						left: (layer.x - bounds.x) * anchorScale,
						top: (layer.y - bounds.y) * anchorScale,
						width: layer.width * anchorScale,
						animationDelay: `${-index * 0.2}s`,
					}}
				/>
			))}
		</div>
	);
}
