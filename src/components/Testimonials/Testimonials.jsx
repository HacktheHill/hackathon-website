import { useEffect, useRef, useState } from "react";
import { t } from "../../i18n";
import styles from "./Testimonials.module.css";

function Testimonials() {
	const testimonialData = [
		{
			id: 1,
			name: t("testimonials.t1.name"),
			content: t("testimonials.t1.content"),
			role: t("testimonials.t1.role"),
			img: t("testimonials.t1.img"),
		},
		{
			id: 2,
			name: t("testimonials.t2.name"),
			content: t("testimonials.t2.content"),
			role: t("testimonials.t2.role"),
			img: t("testimonials.t2.img"),
		},
		{
			id: 3,
			name: t("testimonials.t3.name"),
			content: t("testimonials.t3.content"),
			role: t("testimonials.t3.role"),
			img: t("testimonials.t3.img"),
		},
		{
			id: 4,
			name: t("testimonials.t4.name"),
			content: t("testimonials.t4.content"),
			role: t("testimonials.t4.role"),
			img: t("testimonials.t4.img"),
		},
		{
			id: 5,
			name: t("testimonials.t5.name"),
			content: t("testimonials.t5.content"),
			role: t("testimonials.t5.role"),
			img: t("testimonials.t5.img"),
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

		// Auto slide
		const interval = setInterval(() => {
			nextSlide();
		}, 5000);

		return () => {
			carousel.removeEventListener("touchstart", handleTouchStart, false);
			carousel.removeEventListener("touchend", handleTouchEnd, false);
			clearInterval(interval);
		};
	}, []);

	return (
		<div className={styles["testimonials"]}>
			<h1 className={styles["testimonials-heading-title"]}>{t("testimonials.title")}</h1>
			<h3 className={styles["testimonial-sub-heading"]}>{t("testimonials.sub_heading")}</h3>
			<div className={styles["testimonial-body"]} ref={ref}>
				<img
					className={styles["testimonial-img"]}
					src={testimonialData[activeIndex].img}
					alt={testimonialData[activeIndex].name}
				/>
				<div className={styles["testimonial-container"]}>
					<div className={styles["testimonial-content-container"]}>
						<p className={styles["testimonial-content"]}>{testimonialData[activeIndex].content}</p>
						<p className={styles["testimonial-provider"]}>
							<strong>
								{testimonialData[activeIndex].name}, {testimonialData[activeIndex].role}
							</strong>
						</p>
					</div>
					<div className={styles["carousel-control"]}>
						<button onClick={prevSlide} className={styles["prev-button"]}></button>
						<div className={styles["carousel-dots"]}>
							{testimonialData.map((_, index) => (
								<span
									key={index}
									className={`${styles.dot} ${index === activeIndex ? styles.active : ""}`}
									onClick={() => setActiveIndex(index)}
								></span>
							))}
						</div>
						<button onClick={nextSlide} className={styles["next-button"]}></button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Testimonials;
