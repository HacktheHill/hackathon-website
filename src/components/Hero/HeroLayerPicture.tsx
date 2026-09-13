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
	const srcSet = heroLayerSrcSet(asset);
	return (
		<picture className={styles["hero-layer-picture"]}>
			{media.map(query => (
				<source key={query} media={query} srcSet={srcSet} sizes={asset.sizes} />
			))}
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
