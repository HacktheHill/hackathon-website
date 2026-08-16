import { useRef, useState } from "react";
import { t } from "@/i18n";
import styles from "./Testimonials.module.css";

function Testimonials() {
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
	const pointerStartRef = useRef<{ id: number; x: number; y: number } | null>(null);
	const previousLabel = t("testimonials.aria_label_prev");
	const nextLabel = t("testimonials.aria_label_next");
	const dotLabel = t("testimonials.aria_label_dot");
	const previousIndex = (activeIndex - 1 + testimonialData.length) % testimonialData.length;
	const nextIndex = (activeIndex + 1) % testimonialData.length;

	const nextSlide = () => {
		setActiveIndex(prevIndex => (prevIndex + 1) % testimonialData.length);
	};

	const prevSlide = () => {
		setActiveIndex(prevIndex => (prevIndex - 1 + testimonialData.length) % testimonialData.length);
	};

	return (
		<section id="testimonials" className={styles["testimonials"]} aria-labelledby="testimonials-title">
			<h2 id="testimonials-title" className="section-heading" data-aos="fade-up" data-aos-duration="800">
				{t("testimonials.title")}
			</h2>
			<p className={styles["sub-heading"]} data-aos="fade-up" data-aos-duration="800">
				{t("testimonials.sub_heading")}
			</p>
			<div
				className={styles["testimonial-body"]}
				aria-live="polite"
				tabIndex={0}
				data-aos="fade-up"
				data-aos-duration="800"
				onKeyDown={event => {
					if (event.key === "ArrowLeft") prevSlide();
					if (event.key === "ArrowRight") nextSlide();
				}}
				onPointerDown={event => {
					if (!event.isPrimary) return;
					pointerStartRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
					event.currentTarget.setPointerCapture(event.pointerId);
				}}
				onPointerUp={event => {
					const start = pointerStartRef.current;
					if (!start || start.id !== event.pointerId) return;

					const deltaX = event.clientX - start.x;
					const deltaY = event.clientY - start.y;
					pointerStartRef.current = null;
					if (event.currentTarget.hasPointerCapture(event.pointerId)) {
						event.currentTarget.releasePointerCapture(event.pointerId);
					}

					if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
					if (deltaX < 0) nextSlide();
					else prevSlide();
				}}
				onPointerCancel={() => {
					pointerStartRef.current = null;
				}}
			>
				<div
					className={styles["testimonial-track"]}
					style={{ transform: `translateX(${-activeIndex * 100}%)` }}
				>
					{testimonialData.map((testimonial, index) => (
						<div
							key={testimonial.id}
							className={styles["testimonial-container"]}
							aria-hidden={index !== activeIndex}
							aria-label={`${index + 1}/${testimonialData.length}: ${testimonial.name}`}
							role="group"
							aria-roledescription="slide"
						>
							<img
								className={styles["testimonial-img"]}
								src={testimonial.img}
								alt={testimonial.name}
								width="256"
								height="256"
								loading="lazy"
								decoding="async"
							/>
							<div className={styles["testimonial-text"]}>
								<p className={styles["testimonial-content"]}>{testimonial.content}</p>
								<p className={styles["testimonial-provider"]}>
									{testimonial.name}, {testimonial.role}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
			<div
				className={styles["carousel-control"]}
				data-aos="fade-up"
				data-aos-duration="800"
				data-aos-offset="-100"
			>
				<button
					type="button"
					onClick={prevSlide}
					className={styles["prev-button"]}
					aria-label={`${previousLabel}: ${testimonialData[previousIndex].name}`}
				></button>
				<div className={styles["carousel-dots"]}>
					{testimonialData.map((_, index) => (
						<button
							type="button"
							key={testimonialData[index].id}
							className={index === activeIndex ? styles.active : ""}
							onClick={() => setActiveIndex(index)}
							aria-label={`${dotLabel} ${index + 1}: ${testimonialData[index].name}`}
							aria-pressed={index === activeIndex}
						></button>
					))}
				</div>
				<button
					type="button"
					onClick={nextSlide}
					className={styles["next-button"]}
					aria-label={`${nextLabel}: ${testimonialData[nextIndex].name}`}
				></button>
			</div>
		</section>
	);
}

export default Testimonials;
