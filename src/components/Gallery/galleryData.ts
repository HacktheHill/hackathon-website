import type { TranslationKey } from "@/i18n/translate";

export type GalleryItem = { id: string; alt: TranslationKey; caption: TranslationKey };

export const galleryItems: readonly GalleryItem[] = [
	{ id: "821c3c1abf7c754dd95a", alt: "gallery.photos.p0.alt", caption: "gallery.photos.p0.caption" },
	{ id: "909b40f1abd42c5e2537", alt: "gallery.photos.p1.alt", caption: "gallery.photos.p1.caption" },
	{ id: "55f7bcf8992b3ea30f87", alt: "gallery.photos.p2.alt", caption: "gallery.photos.p2.caption" },
	{ id: "40de7c20d86166a8bd3f", alt: "gallery.photos.p3.alt", caption: "gallery.photos.p3.caption" },
	{ id: "b53b5cb0ba46d9715708", alt: "gallery.photos.p4.alt", caption: "gallery.photos.p4.caption" },
	{ id: "d41b00e9e1bdc7a611fd", alt: "gallery.photos.p5.alt", caption: "gallery.photos.p5.caption" },
	{ id: "52c358fc620e6f0fc63a", alt: "gallery.photos.p6.alt", caption: "gallery.photos.p6.caption" },
	{ id: "5c95bd0a1137fd68b42f", alt: "gallery.photos.p7.alt", caption: "gallery.photos.p7.caption" },
];

const photoAlbumUrl = "https://photos.hackthehill.com/";
export const highlightUrl = (id: string) => `${photoAlbumUrl}?action=highlight&photo=${id}`;
