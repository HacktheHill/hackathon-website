import React, { useState, useEffect } from "react";
import { t } from "../../i18n";
import Calendar from "../Calendar/Calendar";
import "../../global.css";
import AOS from "aos";
import "aos/dist/aos.css";
import shape from "../../assets/patterns/ssshape.svg";

export default function EventsPage() {
	const events = t("schedule.events");
	useEffect(() => {
		AOS.init({ once: false, duration: 700 });
	}, []);

	return (
		<div className="flex justify-center items-center w-full bg-background-dark relative overflow-hidden">
			<div className="flex flex-col w-10/12 h-full justify-center items-center gap-20 py-36 text-left max-w-2xl z-[1]">
				<div className="flex flex-col text-left w-full" data-aos="fade-up">
					<h1>{t("events.title")}</h1>
				</div>
				<Calendar />
			</div>
			<img
				src={shape.src}
				alt="shape"
				className="w-full max-w-bg-deco opacity-25 absolute z-[0] -translate-x-1/2 -translate-y-1/4"
			/>
			<img
				src={shape.src}
				alt="shape"
				className="w-full max-w-bg-deco opacity-25 absolute z-[0] translate-x-1/2 translate-y-[10%] -scale-y-75 scale-x-75"
			/>
		</div>
	);
}
