import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { t } from "../../i18n";
import styles from "./Testimonials.module.css";

//animations
import AOS from "aos";
import "aos/dist/aos.css";

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
	const ref = useRef(null);

	const nextSlide = useCallback(() => {
		setActiveIndex((prevIndex) => (prevIndex + 1) % testimonialData.length);
	}, [testimonialData.length]);

	const prevSlide = useCallback(() => {
		setActiveIndex((prevIndex) => (prevIndex - 1 + testimonialData.length) % testimonialData.length);
	}, [testimonialData.length]);

	// Enable swiping on mobile devices
	useEffect(() => {
		const carousel = ref.current;
		if (!carousel) return;
		let touchstartX = 0;
		let touchendX = 0;

		const handleGesture = () => {
			if (touchendX < touchstartX) nextSlide();
			if (touchendX > touchstartX) prevSlide();
		};

		const handleTouchStart = (event) => {
			touchstartX = event.changedTouches[0].screenX;
		};

		const handleTouchEnd = (event) => {
			touchendX = event.changedTouches[0].screenX;
			handleGesture();
		};

		carousel.addEventListener("touchstart", handleTouchStart, false);
		carousel.addEventListener("touchend", handleTouchEnd, false);

		return () => {
			carousel.removeEventListener("touchstart", handleTouchStart, false);
			carousel.removeEventListener("touchend", handleTouchEnd, false);
		};
	}, [nextSlide, prevSlide]);

	// Keyboard arrows for accessibility
	useEffect(() => {
		const keyHandler = (e) => {
			if (e.key === "ArrowLeft") prevSlide();
			if (e.key === "ArrowRight") nextSlide();
		};
		window.addEventListener("keydown", keyHandler);
		return () => window.removeEventListener("keydown", keyHandler);
	}, [nextSlide, prevSlide]);

	useEffect(() => {
		AOS.init({});
	}, []);

	const getPositionClass = useCallback(
		(index) => {
			if (index === activeIndex) return styles.active;
			const prev = (activeIndex - 1 + testimonialData.length) % testimonialData.length;
			const next = (activeIndex + 1) % testimonialData.length;
			if (index === prev) return styles.prev;
			if (index === next) return styles.next;
			return styles.ghost;
		},
		[activeIndex, testimonialData.length]
	);

	return (
		<div id="testimonials" className={styles["testimonials"]}>
			<h1 data-aos="fade-up" data-aos-duration="800">{t("testimonials.title")}</h1>
			<h2 data-aos="fade-up" data-aos-duration="800">{t("testimonials.sub_heading")}</h2>

			<div className={styles.viewport} ref={ref} aria-live="polite">
				{testimonialData.map((item, index) => (
					<div key={item.id} className={`${styles.card} ${getPositionClass(index)}`}>
						<div className={styles.avatarWrap}>
							<img className={styles.avatar} src={item.img} alt={item.name} loading="lazy" />
						</div>
						<div className={styles.cardInner} data-aos="zoom-in" data-aos-duration="700">
							<blockquote className={styles.quote}>
								<p className={styles.content}>{item.content}</p>
								<p className={styles.provider}>
									<strong>{item.name}</strong>
									{item.role ? <span className={styles.role}>, {item.role}</span> : null}
								</p>
							</blockquote>
						</div>
					</div>
				))}

				<div className={styles.controls}>
					<button onClick={prevSlide} className={`${styles.navBtn} ${styles.prevBtn}`} aria-label={t("testimonials.aria_label_prev")}>
						<span aria-hidden>‹</span>
					</button>
					<div className={styles.dots}>
						{testimonialData.map((_, index) => (
							<button
								key={index}
								className={index === activeIndex ? styles.activeDot : ""}
								onClick={() => setActiveIndex(index)}
								aria-label={t("testimonials.aria_label_dot")}
							/>
						))}
					</div>
					<button onClick={nextSlide} className={`${styles.navBtn} ${styles.nextBtn}`} aria-label={t("testimonials.aria_label_next")}>
						<span aria-hidden>›</span>
					</button>
				</div>
			</div>

			<img className={styles["right-leaves"]} src="/SVGs/Testimonials/right-leaves.svg" alt="right-leaves" />
		</div>
	);
}

export default Testimonials;
