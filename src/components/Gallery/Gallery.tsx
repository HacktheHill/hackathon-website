import { useTranslations } from "@/i18n";
import styles from "./Gallery.module.css";

type GalleryItem = {
	src: string;
	alt: string;
	caption?: string;
};

// Add approved event photos here as they become available. A single organising-
// team photo is welcome; individual organiser portraits are not required.
const galleryItems: readonly GalleryItem[] = [];

export default function Gallery() {
	const t = useTranslations();

	return (
		<section id="gallery" className={styles.gallery} aria-labelledby="gallery-title">
			<div className={styles.header}>
				<h2 id="gallery-title" className="section-heading">
					{t("gallery.title")}
				</h2>
				<p>{t("gallery.intro")}</p>
			</div>

			{galleryItems.length ? (
				<ul className={styles.grid}>
					{galleryItems.map(item => (
						<li key={item.src}>
							<figure>
								<img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
								{item.caption && <figcaption>{item.caption}</figcaption>}
							</figure>
						</li>
					))}
				</ul>
			) : (
				<div className={styles.placeholder} role="status">
					<div className={styles.frames} aria-hidden="true">
						<span></span>
						<span></span>
						<span></span>
					</div>
					<div>
						<h3>{t("gallery.empty_title")}</h3>
						<p>{t("gallery.empty_body")}</p>
					</div>
				</div>
			)}
		</section>
	);
}
