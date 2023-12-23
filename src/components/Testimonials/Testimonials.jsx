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
			img: "https://media.licdn.com/dms/image/C5603AQFpgrXO0Lnvdw/profile-displayphoto-shrink_800_800/0/1575907293069?e=1705536000&v=beta&t=1K2Kd8p-TfaFfF6hUbarN9tFV-GMVwXZ-kljdEaKx_A",
		},
		{
			id: 2,
			name: t("testimonials.t2.name"),
			content: t("testimonials.t2.content"),
			role: t("testimonials.t2.role"),
			img: "https://media.licdn.com/dms/image/D4E03AQFmj_vlNBKr9g/profile-displayphoto-shrink_800_800/0/1678194204883?e=1705536000&v=beta&t=0S90XmZooLflJp7t8PNKX9Jz6Uo_E7zcth8zhuPEcSI",
		},
		{
			id: 3,
			name: t("testimonials.t3.name"),
			content: t("testimonials.t3.content"),
			role: t("testimonials.t3.role"),
			img: "https://media.licdn.com/dms/image/D4E03AQF5bPQP0O7QOw/profile-displayphoto-shrink_800_800/0/1683226303156?e=1705536000&v=beta&t=yF8-O_Ztk04r-fu2HwVs-SGbB9QoXC9IjRZKByvFqzI",
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
			img: "https://media.licdn.com/dms/image/D4E03AQH_j8ydFFqCDQ/profile-displayphoto-shrink_800_800/0/1680969580815?e=1705536000&v=beta&t=nmITo1calz345C1Uqh_-om8nDE-u28pxrIjKs3oUEWo",
		},
		{
			id: 6,
			name: t("testimonials.t6.name"),
			content: t("testimonials.t6.content"),
			role: t("testimonials.t6.role"),
			img: "https://media.licdn.com/dms/image/C5603AQFm5P9rsCZ8vw/profile-displayphoto-shrink_800_800/0/1594058389892?e=1708560000&v=beta&t=5kBwFlhCXnJ0ayiKwqhxGcKiESR-G005rtdvi3Vl_sw",
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
						<p className={styles["testimonial-content"]}>{testimonialData[activeIndex].content}</p>
						<p className={styles["testimonial-provider"]}>
							{testimonialData[activeIndex].name}, {testimonialData[activeIndex].role}
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
									onKeyDown={() => setActiveIndex(index)}
								></span>
							))}
						</div>
						<button onClick={nextSlide} className={styles["next-button"]}></button>
					</div>
				</div>
			</div>
			<img className={styles["right-leaves"]} src="/SVGs/Testimonials/right-leaves.svg" alt="right-leaves" />
		</div>
	);
}

export default Testimonials;
