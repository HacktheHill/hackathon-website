import React from "react";
import { t } from "../../i18n";
import HtHSolid from "../../assets/Logos/HTH/HackTheHill.svg";
import HtHoutline from "../../assets/Logos/HTH/HackTheHill_Outlined_Red.svg";
import parliament from "../../assets/SVGs/parliament.svg";

export default function Hero() {
	return (
		<div className="flex justify-center items-center h-screen w-full bg-square-svg bg-center bg-cover bg-no-repeat bg-fixed">
			<div className="flex flex-col justify-center items-center gap-12 translate-y-8 z-10 md:gap-6">
				<div id="title" className="flex items-center justify-center">
					<img id="hth-logo-outline" {...HtHoutline} alt="Hack the Hill Logo" className="absolute w-3/4" />
					<img id="hth-logo-solid" {...HtHSolid} alt="Hack the Hill Logo" className="relative w-3/4" />
				</div>
				<div id="content" className="flex flex-col w-full justify-center items-center gap-8 md:gap-0">
					<h2 className="font-medium text-center">{t("hero.title")}</h2>
					<button
						className="bg-transparent border-none p-4 cursor-pointer font-bold transition-all duration-100 hover:text-shade-1 underline"
						type="submit"
						onClick={() => window.open("https://2024.hackthehill.com", "_blank")}
					>
						<h3 className="font-medium">2024</h3>
					</button>
				</div>
			</div>
			<div className="absolute bottom-0 left-0 pointer-events-none">
				<img {...parliament}></img>
			</div>
		</div>
	);
}
