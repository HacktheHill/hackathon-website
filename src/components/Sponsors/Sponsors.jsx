import React, { useEffect, useState } from "react";
import { t } from "../../i18n";
import Blackberry from "/src/assets/Logos/Partners/Blackberry.svg";
import CSE from "/src/assets/Logos/Partners/CSE.svg";
import CanadianTire from "/src/assets/Logos/Partners/CanadianTire.svg";
import Ciena from "/src/assets/Logos/Partners/Ciena.svg";
import DigitalOcean from "/src/assets/Logos/Partners/DigitalOcean.svg";
import Google from "/src/assets/Logos/Partners/Google.svg";
import lonehaven from "/src/assets/Logos/Partners/Lonehaven.svg";
import Vercel from "/src/assets/Logos/Partners/Vercel.svg";
import balsamiq from "/src/assets/Logos/Partners/Balsamiq.svg";
import echo3d from "/src/assets/Logos/Partners/Echo3d.svg";
import voiceflow from "/src/assets/Logos/Partners/Voiceflow.svg";
import StickerMule from "/src/assets/Logos/Partners/StickerMule.svg";
import OpenProject from "/src/assets/Logos/Partners/OpenProject.svg";
import "./Sponsors.css";

export default function Sponsors() {
	const data = {
		sponsors: [
			{ href: "https://ciena.ca/", ...Ciena, alt: "Ciena" },
			{ href: "https://blackberry.com/", ...Blackberry, alt: "Blackberry" },
			{ href: "https://canadiantire.ca/", ...CanadianTire, alt: "Canadian Tire" },
			{ href: "https://lonehaven.com/", ...lonehaven, alt: "Lonehaven" },
			{ href: "https://www.cse-cst.gc.ca/", ...CSE, alt: "CSE / CST" },
			{ href: "https://vercel.com/", ...Vercel, alt: "Vercel" },
			{ href: "https://www.digitalocean.com/", ...DigitalOcean, alt: "DigitalOcean" },
			{ href: "https://www.echo3d.com/", ...echo3d, alt: "echo3D" },
			{ href: "https://balsamiq.com/", ...balsamiq, alt: "balsamiq" },
			{ href: "https://www.voiceflow.com/", ...voiceflow, alt: "Voiceflow" },
			{ href: "https://about.google", ...Google, alt: "Google" },
			{ href: "https://www.openproject.org/", ...OpenProject, alt: "OpenProject" },
			{ href: "https://mule.to/p5ni", ...StickerMule, alt: "StickerMule" },
		],
	};

	const [hovered, setHovered] = useState(-1);

	const marqueeGroup = (data, index, pauseAnimation, startAnimation) => {
		return (
			<div
				id={`marquee${index}`}
				className="marquee-group"
				onMouseEnter={pauseAnimation}
				onMouseLeave={startAnimation}
				onFocus={pauseAnimation}
				onBlur={startAnimation}
			>
				{data.sponsors.map((sponsor, i) => (
					<a
						key={i}
						href={sponsor.href}
						target="_blank"
						rel="noreferrer"
						className={`sponsor flex aspect-[3/2] justify-center items-center rounded-lg h-52 md:h-36 p-8 md:p-4 transition-all duration-200
					 ${
							hovered !== -1 && hovered !== i
								? "opacity-25 translate-x-1 translate-y-1"
								: "bg-opacity-35 translate-x-0 translate-y-0"
						}`}
						onMouseEnter={() => setHovered(i)}
						onMouseLeave={() => setHovered(-1)}
						onBlur={() => setHovered(-1)}
					>
						<img {...sponsor} alt={`${sponsor.alt} logo`} className="max-w-full max-h-full"></img>
					</a>
				))}
			</div>
		);
	};

	function pauseAnimation() {
		document.getElementById("marquee1").style.animationPlayState = "paused";
		document.getElementById("marquee2").style.animationPlayState = "paused";
	}

	function startAnimation() {
		document.getElementById("marquee1").style.animationPlayState = "running";
		document.getElementById("marquee2").style.animationPlayState = "running";
	}

	return (
		<>
			<div className="w-full flex justify-center items-center">
				<div className="flex flex-col w-full h-full justify-center items-center gap-16 text-center max-w-2xl">
					<div className="flex flex-col px-8 gap-4">
						<h1>{t("sponsors.title")}</h1>
						<h2>{t("sponsors.subtitle")}</h2>
					</div>
					<div className="carousel-track">
						{marqueeGroup(data, 1, pauseAnimation, startAnimation)}
						{marqueeGroup(data, 2, pauseAnimation, startAnimation)}
					</div>
				</div>
			</div>
		</>
	);
}
