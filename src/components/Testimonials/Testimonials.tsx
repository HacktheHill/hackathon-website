import { useTranslations } from "@/i18n";
import { getTestimonials } from "./testimonialData";
import { useTestimonialCarousel } from "./useTestimonialCarousel";
import styles from "./Testimonials.module.css";

function Testimonials() {
	const t = useTranslations();
	const testimonialData = getTestimonials(t);
	const carousel = useTestimonialCarousel(testimonialData.length);
	const previousLabel = t("testimonials.aria_label_prev");
	const nextLabel = t("testimonials.aria_label_next");
	const dotLabel = t("testimonials.aria_label_dot");
	const trackSlides = [
		{ testimonial: testimonialData.at(-1)!, index: testimonialData.length - 1, isClone: true, key: "clone-last" },
		...testimonialData.map((testimonial, index) => ({ testimonial, index, isClone: false, key: testimonial.id })),
		{ testimonial: testimonialData[0], index: 0, isClone: true, key: "clone-first" },
	];

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
				onKeyDown={carousel.onKeyDown}
				onPointerDown={carousel.onPointerDown}
				onPointerMove={carousel.onPointerMove}
				onPointerUp={carousel.onPointerUp}
				onPointerCancel={carousel.onPointerCancel}
			>
				<div
					ref={carousel.trackRef}
					className={styles["testimonial-track"]}
					data-moving={carousel.isMoving ? "" : undefined}
					data-dragging={carousel.isDragging ? "" : undefined}
					style={{
						transform: `translateX(calc(${-carousel.trackIndex * 100}% + ${carousel.dragOffset}px))`,
						transition: carousel.transitionEnabled ? undefined : "none",
					}}
					onTransitionEnd={carousel.onTransitionEnd}
				>
					{trackSlides.map(({ testimonial, index, isClone, key }) => (
						<div
							key={key}
							className={styles["testimonial-container"]}
							aria-hidden={isClone || index !== carousel.activeIndex}
							aria-label={
								isClone ? undefined : `${index + 1}/${testimonialData.length}: ${testimonial.name}`
							}
							role={isClone ? undefined : "group"}
							aria-roledescription={isClone ? undefined : "slide"}
							data-carousel-clone={isClone ? String(key) : undefined}
						>
							<img
								className={styles["testimonial-img"]}
								src={testimonial.img}
								alt={testimonial.name}
								width="256"
								height="256"
								draggable="false"
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
					onClick={carousel.prevSlide}
					className={styles["prev-button"]}
					aria-label={`${previousLabel}: ${testimonialData[carousel.previousIndex].name}`}
				></button>
				<div className={styles["carousel-dots"]}>
					{testimonialData.map((_, index) => (
						<button
							type="button"
							key={testimonialData[index].id}
							className={index === carousel.activeIndex ? styles.active : ""}
							onClick={() => carousel.selectSlide(index)}
							aria-label={`${dotLabel} ${index + 1}: ${testimonialData[index].name}`}
							aria-pressed={index === carousel.activeIndex}
						></button>
					))}
				</div>
				<button
					type="button"
					onClick={carousel.nextSlide}
					className={styles["next-button"]}
					aria-label={`${nextLabel}: ${testimonialData[carousel.nextIndex].name}`}
				></button>
			</div>
		</section>
	);
}

export default Testimonials;
