import React, { useEffect } from "react";
import { t } from "../../i18n";
import { isMobile } from "react-device-detect";
import HtHSolid from "../../assets/Logos/HTH/HackTheHill.svg";
import HtHoutline from "../../assets/Logos/HTH/HackTheHill_Outlined_Red.svg";
import parliament from "../../assets/SVGs/parliament.svg";
import Button from "../Button/Button";

export default function Hero() {
	useEffect(() => {
		if (!isMobile) {
			const outlined = document.getElementById("hth-logo-outline");
			const solid = document.getElementById("hth-logo-solid");
			const content = document.getElementById("content");

			window.addEventListener("mousemove", e => {
				const x = e.clientX / window.innerWidth - 0.5;
				const y = e.clientY / window.innerHeight - 0.5;

				outlined.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
				outlined.style.filter = `drop-shadow(${x * 30}px ${y * 30}px 10px var(--primary))`;
				solid.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
			});
		}
	}, []);

	return (
		<div className="flex justify-center items-center h-screen w-full bg-square-svg bg-center bg-cover bg-no-repeat bg-fixed">
			<div className="flex flex-col justify-center items-center gap-12 translate-y-8 z-10 md:gap-6 max-w-2xl">
				<div id="title" className="flex items-center justify-center" data-aos="fade-up">
					<img id="hth-logo-outline" {...HtHoutline} alt="Hack the Hill Logo" className="absolute w-3/4" />
					<img id="hth-logo-solid" {...HtHSolid} alt="Hack the Hill Logo" className="relative w-3/4" />
				</div>
				<div id="content" className="flex flex-col w-full justify-center items-center gap-8 px-4 md:gap-4">
					<h2 className="font-medium text-3xl text-center md:text-lg" data-aos="fade-up" data-aos-delay="100">
						{t("hero.title")}
					</h2>
					<div data-aos="fade-up" data-aos-delay="200">
						<Button onClick={() => window.open("https://2024.hackthehill.com", "_blank")}>2024</Button>
					</div>
				</div>
			</div>
			<div id="parliament" className="absolute bottom-0 left-0 pointer-events-none w-full">
				<img className="w-full" {...parliament}></img>
			</div>
		</div>
	);
}
