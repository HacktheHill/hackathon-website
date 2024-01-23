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
			img: "https://media.licdn.com/dms/image/C5603AQFpgrXO0Lnvdw/profile-displayphoto-shrink_800_800/0/1575907293069?e=1710979200&v=beta&t=WASkaJhAytMkAv2IvasoS4N7wrf2hIjym7RfSofckJY",
		},
		{
			id: 2,
			name: t("testimonials.t2.name"),
			content: t("testimonials.t2.content"),
			role: t("testimonials.t2.role"),
			img: "https://media.licdn.com/dms/image/D4E03AQFmj_vlNBKr9g/profile-displayphoto-shrink_800_800/0/1678194204883?e=1710979200&v=beta&t=-8_THT5DFd97CeXlJEluQo74uEr-Rjgq2XEi-gerw8k",
		},
		{
			id: 3,
			name: t("testimonials.t3.name"),
			content: t("testimonials.t3.content"),
			role: t("testimonials.t3.role"),
			img: "https://media.licdn.com/dms/image/D4E03AQF5bPQP0O7QOw/profile-displayphoto-shrink_800_800/0/1683226303156?e=1710979200&v=beta&t=vnScv9JWtj90T32hAy2RCqJTloT1hzF9Pq_sMyiMZ1w",
		},
		{
			id: 4,
			name: t("testimonials.t4.name"),
			content: t("testimonials.t4.content"),
			role: t("testimonials.t4.role"),
			img: "https://cdn.discordapp.com/attachments/1045803128869634088/1180289992568881182/nyah.png",
		},
		{
			id: 5,
			name: t("testimonials.t5.name"),
			content: t("testimonials.t5.content"),
			role: t("testimonials.t5.role"),
			img: "https://media.licdn.com/dms/image/D4E03AQH_j8ydFFqCDQ/profile-displayphoto-shrink_800_800/0/1680969580815?e=1710979200&v=beta&t=vOXZS26XmwPPU2ZRG2n-JY-kYlemw9dhVLh80We2DA4",
		},
		{
			id: 6,
			name: t("testimonials.t6.name"),
			content: t("testimonials.t6.content"),
			role: t("testimonials.t6.role"),
			img: "headshots/testimonials/greg.png",
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
			clearInterval(interval);
		};
	}, []);

	return (
		<div id="testimonials" className={styles["testimonials"]}>
			<img className={styles["left-leaves"]} src="/SVGs/Testimonials/left-leaves.svg" alt="left-leaves" />
			<h1>{t("testimonials.title")}</h1>
			<h3>{t("testimonials.sub_heading")}</h3>
			<div className={styles["testimonial-body"]} ref={ref}>
				<img
					className={styles["testimonial-img"]}
					src={testimonialData[activeIndex].img}
					alt={testimonialData[activeIndex].name}
				/>
				<div className={styles["testimonial-container"]}>
					<div className={styles["testimonial-content-container"]}>
						<h4 className={styles["testimonial-content"]}>{testimonialData[activeIndex].content}</h4>
						<h4 className={styles["testimonial-provider"]}>
							{testimonialData[activeIndex].name}, {testimonialData[activeIndex].role}
						</h4>
					</div>
					<div className={styles["carousel-control"]}>
						<button
							onClick={prevSlide}
							className={styles["prev-button"]}
							aria-label="Previous Icon"
						></button>
						<div className={styles["carousel-dots"]}>
							{testimonialData.map((_, index) => (
								<span
									key={index}
									className={`${styles.dot} ${index === activeIndex ? styles.active : ""}`}
									onClick={() => setActiveIndex(index)}
									onKeyDown={() => setActiveIndex(index)}
								></span>
							))}
						</div>
						<button onClick={nextSlide} className={styles["next-button"]} aria-label="Next Icon"></button>
					</div>
				</div>
			</div>
			<img className={styles["right-leaves"]} src="/SVGs/Testimonials/right-leaves.svg" alt="right-leaves" />
		</div>
	);
}

export default Testimonials;
