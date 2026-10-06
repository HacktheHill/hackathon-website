import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/i18n";
import { useCarousel } from "../Carousel/useCarousel";
import { galleryItems, highlightUrl, type GalleryItem } from "./galleryData";
import styles from "./Gallery.module.css";

function PhotoCarousel({ items, unavailable }: { items: readonly GalleryItem[]; unavailable: (id: string) => void }) {
	const t = useTranslations();
	const viewport = useRef<HTMLDivElement>(null);
	const carousel = useCarousel(items.length);
	const slides = [
		{ item: items.at(-1)!, index: items.length - 1, clone: true, key: "clone-last" },
		...items.map((item, index) => ({ item, index, clone: false, key: item.id })),
		{ item: items[0], index: 0, clone: true, key: "clone-first" },
	];
	useEffect(() => {
		// Image errors can occur before React attaches its event handlers.
		viewport.current?.querySelectorAll<HTMLImageElement>("img").forEach(image => {
			if (image.complete && image.naturalWidth === 0) unavailable(image.dataset.photoId!);
		});
	}, [unavailable]);
	return (
		<div className={styles.carousel}>
			<div
				ref={viewport}
				className={styles.viewport}
				role="region"
				aria-label={t("gallery.carousel")}
				aria-live="polite"
				tabIndex={0}
				onKeyDown={carousel.onKeyDown}
				onPointerDown={carousel.onPointerDown}
				onPointerMove={carousel.onPointerMove}
				onPointerUp={carousel.onPointerUp}
				onPointerCancel={carousel.onPointerCancel}
			>
				<div
					ref={carousel.trackRef}
					className={styles.track}
					data-moving={carousel.isMoving ? "" : undefined}
					data-dragging={carousel.isDragging ? "" : undefined}
					style={{
						transform: `translateX(calc(${-carousel.trackIndex * 100}% + ${carousel.dragOffset}px))`,
						transition: carousel.transitionEnabled ? undefined : "none",
					}}
					onTransitionEnd={carousel.onTransitionEnd}
				>
					{slides.map(({ item, index, clone, key }) => (
						<figure
							key={key}
							className={styles.slide}
							aria-hidden={clone || index !== carousel.activeIndex}
							role={clone ? undefined : "group"}
							aria-roledescription={clone ? undefined : "slide"}
							aria-label={clone ? undefined : `${index + 1}/${items.length}: ${t(item.caption)}`}
							data-carousel-clone={clone ? key : undefined}
						>
							<div className={styles.frame}>
								<img
									src={highlightUrl(item.id)}
									alt={t(item.alt)}
									data-photo-id={item.id}
									width="1600"
									height="1067"
									loading="lazy"
									decoding="async"
									draggable="false"
									onError={() => unavailable(item.id)}
								/>
							</div>
							<figcaption>{t(item.caption)}</figcaption>
						</figure>
					))}
				</div>
			</div>
			{items.length > 1 && (
				<div className={styles.controls}>
					<button
						type="button"
						className={styles.previous}
						onClick={carousel.prevSlide}
						aria-label={t("gallery.previous")}
					/>
					<div className={styles.dots}>
						{items.map((item, index) => (
							<button
								type="button"
								key={item.id}
								className={index === carousel.activeIndex ? styles.active : ""}
								onClick={() => carousel.selectSlide(index)}
								aria-label={`${t("gallery.show_photo")} ${index + 1}: ${t(item.caption)}`}
								aria-pressed={index === carousel.activeIndex}
							/>
						))}
					</div>
					<button
						type="button"
						className={styles.next}
						onClick={carousel.nextSlide}
						aria-label={t("gallery.next")}
					/>
				</div>
			)}
		</div>
	);
}

export default function Gallery() {
	const t = useTranslations();
	const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
	const items = galleryItems.filter(item => !unavailable.has(item.id));
	return (
		<section id="gallery" className={styles.gallery} aria-labelledby="gallery-title">
			<div className={styles.header}>
				<h2 id="gallery-title" className="section-heading">
					{t("gallery.title")}
				</h2>
				<p>{t("gallery.intro")}</p>
			</div>
			{items.length ? (
				<PhotoCarousel
					key={items.map(item => item.id).join()}
					items={items}
					unavailable={id =>
						setUnavailable(current => (current.has(id) ? current : new Set([...current, id])))
					}
				/>
			) : (
				<p role="status">{t("gallery.unavailable")}</p>
			)}
		</section>
	);
}
