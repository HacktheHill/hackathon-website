import React, { useEffect, useRef, useState } from "react";
import { t } from "../../i18n";
import quote from "../../assets/icons/quote.svg";
import Button from "../Button/Button";

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
		<div className="w-full flex flex-col justify-center items-center gap-16">
			<div className="flex flex-col w-[70%] px-8 gap-4 text-center lg:w-full">
				<h1>{t("testimonials.title")}</h1>
				<h2>{t("testimonials.sub_heading")}</h2>
			</div>
			<div className="grid gap-4 grid-rows-12 grid-cols-12 w-full px-32 max-w-2xl md:flex md:flex-col xl:px-4 md:gap-2">
				<div className="flex flex-col justify-start items-between bg-blur-svg rounded-3xl p-8 row-start-1 col-start-1 row-end-6 col-end-8">
					<h3>{t("testimonials.description")}</h3>
				</div>
				<div className="flex flex-col justify-between items-start gap-8 bg-[#020106] overflow-hidden rounded-3xl p-8 row-start-6 col-start-1 row-end-13 col-end-8">
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
				<div className="flex flex-col justify-between items-start gap-8 bg-[#020106] overflow-hidden rounded-3xl p-8 row-start-1 col-start-8 row-end-11 col-end-13">
					<div className="flex flex-row items-center gap-4">
						<img
							className="box-border h-20 w-20 aspect-square object-cover rounded-[50%] shadow-glow"
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
				</div>
				<div className="flex flex-col justify-start items-between text-end bg-blur-svg rounded-3xl p-8 row-start-11 col-start-8 row-end-13 col-end-13">
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
	);
}
