import type { Translate } from "@/i18n";

export function getTestimonials(t: Translate) {
	return [
		{
			id: 3,
			name: t("testimonials.t3.name"),
			content: t("testimonials.t3.content"),
			role: t("testimonials.t3.role"),
			img: "https://cdn1.hackthehill.com/testimonials/britt-hayman.webp",
		},
		{
			id: 6,
			name: t("testimonials.t6.name"),
			content: t("testimonials.t6.content"),
			role: t("testimonials.t6.role"),
			img: "https://cdn1.hackthehill.com/testimonials/greg-suignard.webp",
		},
		{
			id: 7,
			name: t("testimonials.t7.name"),
			content: t("testimonials.t7.content"),
			role: t("testimonials.t7.role"),
			img: "https://cdn1.hackthehill.com/testimonials/elmira-khani.webp",
		},
		{
			id: 1,
			name: t("testimonials.t1.name"),
			content: t("testimonials.t1.content"),
			role: t("testimonials.t1.role"),
			img: "https://cdn1.hackthehill.com/testimonials/maddie-whibbs.webp",
		},
		{
			id: 2,
			name: t("testimonials.t2.name"),
			content: t("testimonials.t2.content"),
			role: t("testimonials.t2.role"),
			img: "https://cdn1.hackthehill.com/testimonials/adam-laderoute.webp",
		},
		{
			id: 4,
			name: t("testimonials.t4.name"),
			content: t("testimonials.t4.content"),
			role: t("testimonials.t4.role"),
			img: "https://cdn1.hackthehill.com/testimonials/nyah-wagner.webp",
		},
	];
}
