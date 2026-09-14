import { heroLayerSrcSet, MOBILE_HERO_MEDIA, type HeroLayerAsset } from "./assets";
import styles from "./Hero.module.css";

export default function HeroLayerPicture({
	asset,
	media = MOBILE_HERO_MEDIA,
	highPriority = false,
}: {
	asset: HeroLayerAsset;
	media?: readonly string[];
	highPriority?: boolean;
}) {
	return (
		<picture className={styles["hero-layer-picture"]}>
			{media.flatMap(query => [
				<source key={`${query}-avif`} type="image/avif" media={query} srcSet={heroLayerSrcSet(asset, "avif")} sizes={asset.sizes} />,
				<source key={`${query}-webp`} type="image/webp" media={query} srcSet={heroLayerSrcSet(asset, "webp")} sizes={asset.sizes} />
			])}
			<img
				className={styles["hero-layer-image"]}
				data-hero-layer={asset.name}
				alt=""
				width={asset.width}
				height={asset.height}
				loading="eager"
				decoding="auto"
				{...(highPriority ? { fetchpriority: "high" } : {})}
			/>
		</picture>
	);
}
