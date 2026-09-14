import { Fragment, type RefObject } from "react";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	HERO_PARALLAX_SPEEDS,
	HERO_SCENE_LAYERS,
	SCENE_LAYERS,
	sceneLayerPlacement,
	type SceneLayer,
} from "./sceneLayers";
import { percent, sceneLayerSizes, sceneLayerSrcSet } from "./sceneImages";
import styles from "./Scene.module.css";

type SceneArtworkProps = {
	artworkRef: RefObject<HTMLDivElement>;
};

const RESPONSIVE_LAYER_CLASSES: Partial<Record<SceneLayer["name"], string>> = {
	road: styles["tablet-road-shift"],
	"ice-1": styles["tablet-ice-top"],
	"ice-2": styles["tablet-ice-cracks"],
};

function layerClassName(layer: SceneLayer) {
	return [
		styles.layer,
		...(layer.name.startsWith("cloud-") ? [styles["scene-cloud"], styles[layer.name]] : []),
		RESPONSIVE_LAYER_CLASSES[layer.name],
	]
		.filter(Boolean)
		.join(" ");
}

export default function SceneArtwork({ artworkRef }: SceneArtworkProps) {
	return (
		<div ref={artworkRef} className={styles.artwork} data-scene-artwork aria-hidden="true">
			{SCENE_LAYERS.map((layer, index) => (
				<Fragment key={layer.name}>
					<picture>
						<source
							type="image/avif"
							media="(min-width: 1025px)"
							srcSet={sceneLayerSrcSet(layer, "avif")}
							sizes={sceneLayerSizes(layer)}
						/>
						<source
							type="image/webp"
							media="(min-width: 1025px)"
							srcSet={sceneLayerSrcSet(layer, "webp")}
							sizes={sceneLayerSizes(layer)}
						/>
						<img
							className={layerClassName(layer)}
							data-scene-layer={layer.name}
							data-parallax-speed={HERO_PARALLAX_SPEEDS[layer.name]}
							alt=""
							width={layer.width}
							height={layer.height}
							loading={HERO_SCENE_LAYERS.has(layer.name) ? "eager" : "lazy"}
							{...(layer.name === "sky" ? { fetchpriority: "high" } : {})}
							decoding={HERO_SCENE_LAYERS.has(layer.name) ? "sync" : "async"}
							style={{
								left: percent(sceneLayerPlacement(layer).x, CANVAS_WIDTH),
								top: percent(sceneLayerPlacement(layer).y, CANVAS_HEIGHT),
								width: percent(sceneLayerPlacement(layer).width, CANVAS_WIDTH),
								zIndex: (index + 1) * 10,
							}}
						/>
					</picture>
					{layer.name === "ice-1" && (
						<picture>
							<source
								type="image/avif"
								media="(min-width: 1025px)"
								srcSet={sceneLayerSrcSet(layer, "avif")}
								sizes={sceneLayerSizes(layer)}
							/>
							<source
								type="image/webp"
								media="(min-width: 1025px)"
								srcSet={sceneLayerSrcSet(layer, "webp")}
								sizes={sceneLayerSizes(layer)}
							/>
							<img
								className={`${styles.layer} ${styles["tablet-ice-bottom"]}`}
								data-scene-slice="ice-bottom"
								alt=""
								width={layer.width}
								height={layer.height}
								loading="lazy"
								decoding="async"
								style={{
									left: percent(layer.x, CANVAS_WIDTH),
									top: percent(layer.y, CANVAS_HEIGHT),
									width: percent(layer.width, CANVAS_WIDTH),
									zIndex: (index + 1) * 10,
								}}
							/>
						</picture>
					)}
				</Fragment>
			))}
			<div className={styles["tablet-ice-middle"]}></div>
		</div>
	);
}
