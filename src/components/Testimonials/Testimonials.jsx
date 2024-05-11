import React, { useEffect, useRef, useState } from "react";
import { t } from "../../i18n";
import quote from "../../assets/icons/quote.svg";
import Button from "../Button/Button";
import beaver4 from "../../assets/Beaver4.svg";

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

	return (
		<div className="flex justify-center items-center w-full bg-background-dark">
			<div className="flex flex-col w-10/12 h-full justify-center items-center gap-20 py-36 text-left max-w-2xl">
				<div className="flex flex-col text-left w-full" data-aos="fade-up">
					<h1>{t("testimonials.title")}</h1>
					<h3 className="text-shadow_text">{t("testimonials.subtitle")}</h3>
				</div>
				<div className="grid gap-4 grid-rows-12 grid-cols-12 w-full max-w-2xl xl:flex xl:flex-col xl:px-4 xl:gap-2">
					<div
						className="flex flex-col justify-between items-start gap-8 bg-blur-svg rounded-3xl p-8 row-start-1 col-start-8 row-end-10 col-end-13"
						data-aos="fade-left"
					>
						<div className="flex flex-row items-center gap-4">
							<img
								className="box-border h-20 w-20 aspect-square object-cover rounded-[50%]"
								src={testimonialData[2].img}
								alt={testimonialData[2].name}
							/>
							<div>
								<h4>{testimonialData[2].name}</h4>
								<p>{testimonialData[2].role}</p>
							</div>
						</div>
						<div className="flex flex-row gap-6">
							<img {...quote} alt="quote" className="w-6 aspect-square self-start opacity-85" />
							<p>{testimonialData[2].content}</p>
							<img {...quote} alt="quote" className="-scale-100 w-6 aspect-square self-end opacity-85" />
						</div>
						<div className="absolute -top-16 right-0 h-24">
							<img src={beaver4.src} alt="Beaver" className="h-full" />
						</div>
					</div>
					<div
						className="flex flex-col justify-between items-start gap-8 bg-[#020106] overflow-hidden rounded-3xl p-8 row-start-1 col-start-1 row-end-8 col-end-8"
						data-aos="fade-right"
					>
						<div className="flex flex-row items-center gap-4">
							<img
								className="box-border h-20 w-20 aspect-square object-cover rounded-[50%] shadow-glow"
								src={testimonialData[0].img}
								alt={testimonialData[0].name}
							/>
							<div>
								<h4>{testimonialData[0].name}</h4>
								<p>{testimonialData[0].role}</p>
							</div>
						</div>
						<div className="flex flex-row gap-6">
							<img {...quote} alt="quote" className="w-6 aspect-square self-start opacity-85" />
							<p>{testimonialData[0].content}</p>
							<img {...quote} alt="quote" className="-scale-100 w-6 aspect-square self-end opacity-85" />
						</div>
					</div>
					<div
						className="flex flex-col justify-between items-start gap-8 bg-blur-svg overflow-hidden rounded-3xl p-8 row-start-8 col-start-1 row-end-13 col-end-8"
						data-aos="fade-up"
					>
						<div className="flex flex-row items-center gap-4">
							<img
								className="box-border h-20 w-20 aspect-square object-cover rounded-[50%]"
								src={testimonialData[1].img}
								alt={testimonialData[1].name}
							/>
							<div>
								<h4>{testimonialData[1].name}</h4>
								<p>{testimonialData[1].role}</p>
							</div>
						</div>
						<div className="flex flex-row gap-6">
							<img {...quote} alt="quote" className="w-6 aspect-square self-start opacity-85" />
							<p>{testimonialData[1].content}</p>
							<img {...quote} alt="quote" className="-scale-100 w-6 aspect-square self-end opacity-85" />
						</div>
					</div>
					<div
						className="flex flex-col justify-center items-between text-end bg-[#020106] rounded-3xl p-8 row-start-10 col-start-8 row-end-13 col-end-13"
						data-aos="fade-up"
					>
						<div className="self-end">
							<Button
								onClick={() => window.open("https://www.instagram.com/hackthehill", "_blank")}
								fill={false}
							>
								<h4>{t("testimonials.button_text")}</h4>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
