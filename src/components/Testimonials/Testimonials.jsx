import React, { useEffect, useRef, useState } from "react";
import { t } from "../../i18n";

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
		<div className="w-full bg-shade-9 justify-center items-center bg-pentagon-svg bg-center bg-cover bg-no-repeat">
			<div className="flex flex-col w-full h-full justify-center items-center gap-20 py-36 text-center lg:gap-8">
				<div className="flex flex-col w-[70%] px-8 gap-4 md:w-full">
					<h1>{t("testimonials.title")}</h1>
					<h2>{t("testimonials.sub_heading")}</h2>
				</div>
				<div
					ref={ref}
					className="flex w-9/12 h-4/6 flex-row justify-center items-center flex-wrap xl:gap-16 xl:w-11/12"
				>
					<div className="grid grid-flow-col auto-cols-[100%] w-[70%] gap-16 overflow-hidden md:w-[90%]">
						{testimonialData.map((_, index) => (
							<div
								key={index}
								className="flex flex-row items-center justify-center gap-[5vw] lg:flex lg:flex-wrap lg:items-start lg:gap-8"
								style={{
									transform: `translateX(calc(${-activeIndex * 100}% - ${activeIndex * 4}rem))`,
								}}
							>
								<img
									className="box-border h-64 w-64 aspect-square object-cover rounded-[50%] p-4 border-4 border-primary bg-light_accent bg-opacity-50 md:h-48 md:w-48"
									src={testimonialData[index].img}
									alt={testimonialData[index].name}
								/>
								<div className="basis-2/3 flex flex-col justify-center gap-4 text-left border-2 bg-opacity-100 border-shade-3 rounded-sm bg-shade-8 z-20 px-8 py-12 sm:basis-full">
									<p className="">{testimonialData[index].content}</p>
									<p className="font-bold">
										{testimonialData[index].name}, {testimonialData[index].role}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="flex gap-8">
					<button
						onClick={prevSlide}
						className="border-r-[0.375rem] border-b-[0.375rem] border-primary rounded-[20%] inline-block p-[0.375rem] bg-none cursor-pointer transition-all duration-300 rotate-[135deg] opacity-80 hover:opacity-100"
						aria-label={t("testimonials.aria_label_prev")}
					></button>
					<div className="flex justify-evenly items-center gap-3">
						{testimonialData.map((_, index) => (
							<button
								key={index}
								className={`block h-4 w-4 border-none bg-light_accent rounded-md cursor-pointer transition-all duration-300 hover:opacity-100
								${index === activeIndex ? "opacity-100" : "opacity-50"}`}
								onClick={() => setActiveIndex(index)}
								onKeyDown={() => setActiveIndex(index)}
								aria-label={t("testimonials.aria_label_dot")}
							></button>
						))}
					</div>
					<button
						onClick={nextSlide}
						className="border-r-[0.375rem] border-b-[0.375rem] border-primary rounded-[20%] inline-block p-[0.375rem] bg-none cursor-pointer transition-all duration-300 rotate-[-45deg] opacity-80 hover:opacity-100"
						aria-label={t("testimonials.aria_label_next")}
					></button>
				</div>
			</div>
		</div>
	);
}
