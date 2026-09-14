import skySrc from "@/assets/Hero/sky.webp?url";
import cloud1Src from "@/assets/Hero/cloud1.webp?url";
import cloud2Src from "@/assets/Hero/cloud2.webp?url";
import cloud3Src from "@/assets/Hero/cloud3.webp?url";
import cloud4Src from "@/assets/Hero/cloud4.webp?url";
import cloud5Src from "@/assets/Hero/cloud5.webp?url";
import cloud6Src from "@/assets/Hero/cloud6.webp?url";
import hill1Src from "@/assets/Hero/hill1.webp?url";
import hill2Src from "@/assets/Hero/hill2.webp?url";
import foregroundSrc from "@/assets/Hero/foreground.webp?url";

import skyAvif from "@/assets/Hero/sky.avif?url";
import cloud1Avif from "@/assets/Hero/cloud1.avif?url";
import cloud2Avif from "@/assets/Hero/cloud2.avif?url";
import cloud3Avif from "@/assets/Hero/cloud3.avif?url";
import cloud4Avif from "@/assets/Hero/cloud4.avif?url";
import cloud5Avif from "@/assets/Hero/cloud5.avif?url";
import cloud6Avif from "@/assets/Hero/cloud6.avif?url";
import hill1Avif from "@/assets/Hero/hill1.avif?url";
import hill2Avif from "@/assets/Hero/hill2.avif?url";
import foregroundAvif from "@/assets/Hero/foreground.avif?url";

const HERO_DESIGN_WIDTH = 1920;
const HERO_RESPONSIVE_CANVAS_WIDTHS = [480, 768, 1024, 1280] as const;
export const MOBILE_HERO_MEDIA = ["(max-width: 1024px)"] as const;
const MID_MOBILE_HERO_MEDIA = ["(min-width: 601px) and (max-width: 1024px)"] as const;
const WIDE_OR_LANDSCAPE_MOBILE_HERO_MEDIA = [
	"(min-width: 601px) and (max-width: 1024px)",
	"(max-width: 600px) and (orientation: landscape)",
] as const;
const NARROW_TABLET_HERO_MEDIA = ["(min-width: 1001px) and (max-width: 1024px)"] as const;

export type HeroLayerAsset = {
	name: string;
	src: string;
	srcAvif: string;
	width: number;
	height: number;
	sizes: string;
};

export const HERO_ASSETS = {
	sky: { name: "sky", src: skySrc, srcAvif: skyAvif, width: 1920, height: 1179, sizes: "max(100vw, 166.11svh)" },
	cloud1: {
		name: "cloud1",
		src: cloud1Src,
		srcAvif: cloud1Avif,
		width: 1100,
		height: 539,
		sizes: "clamp(460px, 54vw, 960px)",
	},
	cloud2: {
		name: "cloud2",
		src: cloud2Src,
		srcAvif: cloud2Avif,
		width: 435,
		height: 290,
		sizes: "clamp(340px, 36vw, 620px)",
	},
	cloud3: {
		name: "cloud3",
		src: cloud3Src,
		srcAvif: cloud3Avif,
		width: 803,
		height: 403,
		sizes: "clamp(380px, 44vw, 820px)",
	},
	cloud4: {
		name: "cloud4",
		src: cloud4Src,
		srcAvif: cloud4Avif,
		width: 950,
		height: 319,
		sizes: "clamp(420px, 50vw, 880px)",
	},
	cloud5: {
		name: "cloud5",
		src: cloud5Src,
		srcAvif: cloud5Avif,
		width: 800,
		height: 450,
		sizes: "clamp(360px, 42vw, 760px)",
	},
	cloud6: {
		name: "cloud6",
		src: cloud6Src,
		srcAvif: cloud6Avif,
		width: 800,
		height: 452,
		sizes: "clamp(210px, 58vw, 440px)",
	},
	hill1: { name: "hill1", src: hill1Src, srcAvif: hill1Avif, width: 1920, height: 571, sizes: "max(242.10vh, 104.24vw)" },
	hill2: { name: "hill2", src: hill2Src, srcAvif: hill2Avif, width: 1920, height: 588, sizes: "max(235.10vh, 101.22vw)" },
	foreground: {
		name: "foreground",
		src: foregroundSrc,
		srcAvif: foregroundAvif,
		width: 1920,
		height: 1070,
		sizes: "(orientation: portrait) 200vw, 100vw",
	},
} satisfies Record<string, HeroLayerAsset>;

export const heroLayerSrcSet = (asset: HeroLayerAsset, ext: string = "webp") =>
	[
		...HERO_RESPONSIVE_CANVAS_WIDTHS.map(canvasWidth => {
			const candidateWidth = Math.round((asset.width * canvasWidth) / HERO_DESIGN_WIDTH);
			return `/art/hero/responsive/${canvasWidth}/${asset.name}.${ext} ${candidateWidth}w`;
		}),
		`${ext === "avif" ? asset.srcAvif : asset.src} ${asset.width}w`,
	].join(", ");

export const HERO_CLOUDS = [
	{
		className: "cloud-1",
		asset: HERO_ASSETS.cloud1,
		media: WIDE_OR_LANDSCAPE_MOBILE_HERO_MEDIA,
	},
	{ className: "cloud-2", asset: HERO_ASSETS.cloud2, media: MID_MOBILE_HERO_MEDIA },
	{ className: "cloud-3", asset: HERO_ASSETS.cloud3, media: MID_MOBILE_HERO_MEDIA },
	{ className: "cloud-4", asset: HERO_ASSETS.cloud4, media: NARROW_TABLET_HERO_MEDIA },
	{
		className: "cloud-5",
		asset: HERO_ASSETS.cloud5,
		media: WIDE_OR_LANDSCAPE_MOBILE_HERO_MEDIA,
	},
	{ className: "cloud-6", asset: HERO_ASSETS.cloud6, media: MOBILE_HERO_MEDIA },
];
