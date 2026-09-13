// Coordinates come from the original 3049 × 12301 artwork canvas.
export const CANVAS_WIDTH = 3049;
export const CANVAS_HEIGHT = 12301;

export const SCENE_LAYERS = [
	{ name: "sky", x: 0, y: 0, width: 3049, height: 2005 },
	{ name: "cloud-1", x: 976, y: -315, width: 2182, height: 1069 },
	{ name: "cloud-2", x: -167, y: 544, width: 435, height: 290 },
	{ name: "cloud-3", x: 241, y: 274, width: 803, height: 403 },
	{ name: "cloud-4", x: -331, y: -142, width: 1884, height: 632 },
	{ name: "cloud-5", x: 2627, y: 434, width: 1182, height: 640 },
	{ name: "cloud-6", x: 1128, y: 430, width: 1489, height: 829 },
	{ name: "hill-near", x: 0, y: 680, width: 3049, height: 1143 },
	{ name: "hill-far", x: 1483, y: 821, width: 1566, height: 670 },
	{ name: "parliament-tower", x: 907, y: 253, width: 394, height: 1392 },
	{ name: "parliament-roof", x: 0, y: 980, width: 3049, height: 846 },
	{ name: "parliament-towers", x: 364, y: 834, width: 2431, height: 1270 },
	{ name: "bush-1", x: 0, y: 1316, width: 3049, height: 1581 },
	{ name: "bush-2", x: 0, y: 1443, width: 3049, height: 3216 },
	{ name: "bush-3", x: 0, y: 3129, width: 3049, height: 2870 },
	{ name: "bush-4", x: 0, y: 4568, width: 3049, height: 2018 },
	{ name: "road", x: 0, y: 5989, width: 3049, height: 814 },
	{ name: "water", x: 0, y: 8404, width: 3049, height: 3597 },
	{ name: "ice-1", x: 0, y: 6393, width: 3049, height: 3153 },
	{ name: "ice-2", x: 0, y: 7619, width: 3049, height: 1926 },
	{ name: "logs", x: 1436, y: 2080, width: 1342, height: 900 },
	{ name: "footer-water", x: 374, y: 11310, width: 2675, height: 991 },
	{ name: "footer-water-2", x: 0, y: 11553, width: 3049, height: 748 },
] as const;

export type SceneLayer = (typeof SCENE_LAYERS)[number];
type SceneLayerPlacement = {
	x: number;
	y: number;
	width: number;
	height: number;
};

const SCENE_LAYER_PLACEMENTS: Partial<Record<SceneLayer["name"], SceneLayerPlacement>> = {
	/* Scale the frame with its video while keeping the artwork's right edge in
		the intended scene position. */
	logs: {
		x: 1504.693966,
		y: 2087.238449,
		width: 1308.306034,
		height: 855.101983,
	},
};

export const sceneLayerPlacement = (layer: SceneLayer) => SCENE_LAYER_PLACEMENTS[layer.name] ?? layer;

export const HERO_SCENE_LAYERS: ReadonlySet<string> = new Set([
	"sky",
	"cloud-1",
	"cloud-2",
	"cloud-3",
	"cloud-4",
	"cloud-5",
	"cloud-6",
	"hill-near",
	"hill-far",
	"parliament-tower",
	"parliament-roof",
	"parliament-towers",
	"bush-1",
	"bush-2",
]);

export const HERO_PARALLAX_SPEEDS: Record<string, number> = {
	sky: 0.008,
	"cloud-1": 0.02,
	"cloud-2": 0.024,
	"cloud-3": 0.018,
	"cloud-4": 0.016,
	"cloud-5": 0.022,
	"cloud-6": 0.026,
	"hill-far": 0.06,
	"hill-near": 0.075,
	"parliament-tower": 0.045,
	"parliament-roof": 0.04,
	"parliament-towers": 0.035,
	"bush-1": 0.025,
	"bush-2": 0.018,
};
