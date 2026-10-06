import { useTranslations } from "@/i18n";
import Button from "@/components/Button/Button";
import { highlightUrl, photoAlbumUrl } from "./galleryData";
import { usePhotoCarousel } from "./usePhotoCarousel";
import styles from "./Gallery.module.css";

export default function Gallery() {
	const t = useTranslations();
	const carousel = usePhotoCarousel();
	return (
		<section id="gallery" ref={carousel.sectionRef} className={styles.gallery} aria-labelledby="gallery-title">
			<div className={styles.header}>
				<h2 id="gallery-title" className="section-heading">
					{t("gallery.title")}
				</h2>
				<p>{t("gallery.intro")}</p>
			</div>
			{carousel.item ? (
				<div
					className={styles.carousel}
					role="region"
					aria-label={t("gallery.carousel")}
					onMouseEnter={() => carousel.setHovered(true)}
					onMouseLeave={() => carousel.setHovered(false)}
					onFocusCapture={() => carousel.setFocused(true)}
					onBlurCapture={event => {
						if (!event.currentTarget.contains(event.relatedTarget as Node | null))
							carousel.setFocused(false);
					}}
					onKeyDown={event => {
						if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
							event.preventDefault();
							carousel.move(event.key === "ArrowLeft" ? -1 : 1);
						}
					}}
				>
					<figure>
						<div className={styles.frame}>
							<img
								key={carousel.item.id}
								src={highlightUrl(carousel.item.id)}
								alt={t(carousel.item.alt)}
								width="1600"
								height="1067"
								loading="lazy"
								decoding="async"
								onLoad={carousel.loaded}
								onError={carousel.failed}
							/>
						</div>
						<figcaption aria-live={carousel.paused || carousel.reducedMotion ? "polite" : "off"}>
							{t(carousel.item.caption)}
						</figcaption>
					</figure>
					{carousel.count > 1 && (
						<div className={styles.controls}>
							<button type="button" onClick={() => carousel.move(-1)} aria-label={t("gallery.previous")}>
								←
							</button>
							<span className={styles.counter}>
								{carousel.activeIndex + 1} / {carousel.count}
							</span>
							<button type="button" onClick={() => carousel.move(1)} aria-label={t("gallery.next")}>
								→
							</button>
							{!carousel.reducedMotion && (
								<button
									type="button"
									className={styles.pause}
									onClick={() => carousel.setPaused(!carousel.paused)}
								>
									{t(carousel.paused ? "gallery.play" : "gallery.pause")}
								</button>
							)}
						</div>
					)}
				</div>
			) : (
				<p role="status">{t("gallery.unavailable")}</p>
			)}
			<Button href={photoAlbumUrl}>{t("gallery.view_album")}</Button>
		</section>
	);
}
