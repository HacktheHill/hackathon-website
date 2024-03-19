import React, { useEffect, useRef, useState } from "react";
import { t } from "../../i18n";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
	const testimonialData = [
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

	const [activeIndex, setActiveIndex] = useState(0);
	const ref = useRef(null);

	const nextSlide = () => {
		setActiveIndex(prevIndex => (prevIndex + 1) % testimonialData.length);
	};

	const prevSlide = () => {
		setActiveIndex(prevIndex => (prevIndex - 1 + testimonialData.length) % testimonialData.length);
	};

	// Enable swiping on mobile devices
	useEffect(() => {
		const carousel = ref.current;
		let touchstartX = 0;
		let touchendX = 0;

		const handleGesture = () => {
			if (touchendX < touchstartX) nextSlide();
			if (touchendX > touchstartX) prevSlide();
		};

		const handleTouchStart = event => {
			touchstartX = event.changedTouches[0].screenX;
		};

		const handleTouchEnd = event => {
			touchendX = event.changedTouches[0].screenX;
			handleGesture();
		};

		carousel.addEventListener("touchstart", handleTouchStart, false);
		carousel.addEventListener("touchend", handleTouchEnd, false);

		return () => {
			carousel.removeEventListener("touchstart", handleTouchStart, false);
			carousel.removeEventListener("touchend", handleTouchEnd, false);
		};
	}, []);

	return (
		<div id="testimonials" className={styles["testimonials"]}>
			<h1>{t("testimonials.title")}</h1>
			<h2>{t("testimonials.sub_heading")}</h2>
			<div className={styles["testimonial-body"]} ref={ref}>
				{testimonialData.map((_, index) => (
					<div
						key={index}
						className={styles["testimonial-container"]}
						style={{
							transform: `translateX(calc(${-activeIndex * 100}% - ${activeIndex * 4}rem))`,
						}}
					>
						<img
							className={styles["testimonial-img"]}
							src={testimonialData[index].img}
							alt={testimonialData[index].name}
						/>
						<div className={styles["testimonial-text"]}>
							<p className={styles["testimonial-content"]}>{testimonialData[index].content}</p>
							<p className={styles["testimonial-provider"]}>
								{testimonialData[index].name}, {testimonialData[index].role}
							</p>
						</div>
					</div>
				))}
			</div>
			<div className={styles["carousel-control"]}>
				<button
					onClick={prevSlide}
					className={styles["prev-button"]}
					aria-label={t("testimonials.aria_label_prev")}
				></button>
				<div className={styles["carousel-dots"]}>
					{testimonialData.map((_, index) => (
						<button
							key={index}
							className={index === activeIndex ? styles.active : ""}
							onClick={() => setActiveIndex(index)}
							onKeyDown={() => setActiveIndex(index)}
							aria-label={t("testimonials.aria_label_dot")}
						></button>
					))}
				</div>
				<button
					onClick={nextSlide}
					className={styles["next-button"]}
					aria-label={t("testimonials.aria_label_next")}
				></button>
				<button onClick={nextSlide} className="bg-primary font-bold text-white px-4 py-2 rounded-md">
					yo
				</button>
			</div>
		</div>
	);
}
