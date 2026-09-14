import { CANVAS_WIDTH, type SceneLayer } from "./sceneLayers";

const RESPONSIVE_CANVAS_WIDTHS = [1280, 1920] as const;

export const percent = (value: number, total: number) => `${(value / total) * 100}%`;
const responsiveLayerWidth = (layerWidth: number, canvasWidth: number) =>
	Math.round((layerWidth * canvasWidth) / CANVAS_WIDTH);
export const sceneLayerSrcSet = (layer: SceneLayer, ext: string = "webp") =>
	[
		...RESPONSIVE_CANVAS_WIDTHS.map(
			canvasWidth =>
				`/art/scene/responsive/${canvasWidth}/${layer.name}.${ext} ${responsiveLayerWidth(
					layer.width,
					canvasWidth,
				)}w`,
		),
		`/art/scene/${layer.name}.${ext} ${layer.width}w`,
	].join(", ");
export const sceneLayerSizes = (layer: SceneLayer) =>
	`(min-width: ${CANVAS_WIDTH}px) ${layer.width}px, ${((layer.width / CANVAS_WIDTH) * 100).toFixed(4)}vw`;
