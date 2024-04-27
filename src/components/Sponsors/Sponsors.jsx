import React, { useEffect, useState } from "react";
import { t } from "../../i18n";
import "./Sponsors.css";
import Blackberry from "/src/assets/Logos/Partners/Blackberry.svg";
import CSE from "/src/assets/Logos/Partners/CSE.svg";
import CanadianTire from "/src/assets/Logos/Partners/CanadianTire.svg";
import CCSS from "/src/assets/Logos/Partners/ccss.png";
import Carleton from "/src/assets/Logos/Partners/Carleton.svg";
import CarletonIEEE from "/src/assets/Logos/Partners/CarletonIEEE.svg";
import Ciena from "/src/assets/Logos/Partners/Ciena.svg";
import DigitalOcean from "/src/assets/Logos/Partners/DigitalOcean.svg";
import uOCyberSec from "/src/assets/Logos/Partners/uOCyberSec.svg";
import CSSA from "/src/assets/Logos/Partners/CSSA.svg";
import uOttawaIEEE from "/src/assets/Logos/Partners/uOttawaIEEE.svg";
import WIE from "/src/assets/Logos/Partners/WIE.svg";
import EEF from "/src/assets/Logos/Partners/EEF.svg";
import Google from "/src/assets/Logos/Partners/Google.svg";
import lonehaven from "/src/assets/Logos/Partners/Lonehaven.svg";
import telferBTA from "/src/assets/Logos/Partners/bta-logo.svg";
import SCESoc from "/src/assets/Logos/Partners/SCESoc.svg";
import Vercel from "/src/assets/Logos/Partners/Vercel.svg";
import balsamiq from "/src/assets/Logos/Partners/balsamiq.svg";
import echo3d from "/src/assets/Logos/Partners/echo3d.webp";
import uOttawa from "/src/assets/Logos/Partners/uOttawa.svg";
import uOGDC from "/src/assets/Logos/Partners/uOttawaGDC.svg";
import voiceflow from "/src/assets/Logos/Partners/voiceflow.svg";
import StickerMule from "/src/assets/Logos/Partners/StickerMule.svg";
import OpenProject from "/src/assets/Logos/Partners/OpenProject.svg";
import uOEngiqueers from "/src/assets/Logos/Partners/uOEngiqueers.webp";
import AITinkerers from "/src/assets/Logos/Partners/AITinkerers.avif";
import DEsocCarleton from "/src/assets/Logos/Partners/desocCarleton.webp";

export default function Sponsors() {
	const data = {
		sponsors: [
			{ href: "https://ciena.ca/", ...Ciena, alt: "Ciena", darkBg: true, needsShadow: false },
			{ href: "https://blackberry.com/", ...Blackberry, alt: "Blackberry", darkBg: false, needsShadow: true },
			{
				href: "https://canadiantire.ca/",
				...CanadianTire,
				alt: "Canadian Tire",
				darkBg: true,
				needsShadow: false,
			},
			{ href: "https://lonehaven.com/", ...lonehaven, alt: "Lonehaven", darkBg: false, needsShadow: false },
			{ href: "https://www.cse-cst.gc.ca/", ...CSE, alt: "CSE / CST", darkBg: true, needsShadow: true },

			{ href: "https://vercel.com/", ...Vercel, alt: "Vercel", darkBg: false, needsShadow: false },
			{
				href: "https://www.digitalocean.com/",
				...DigitalOcean,
				alt: "DigitalOcean",
				darkBg: true,
				needsShadow: false,
			},
			{ href: "https://www.echo3d.com/", ...echo3d, alt: "echo3D", darkBg: false, needsShadow: false },
			{ href: "https://balsamiq.com/", ...balsamiq, alt: "balsamiq", darkBg: true, needsShadow: false },
			{ href: "https://www.voiceflow.com/", ...voiceflow, alt: "Voiceflow", darkBg: false, needsShadow: false },
			{ href: "https://about.google", ...Google, alt: "Google", darkBg: true, needsShadow: false },

			{
				href: "https://www.openproject.org/",
				...OpenProject,
				alt: "OpenProject",
				darkBg: false,
				needsShadow: false,
			},
			{ href: "https://mule.to/p5ni", ...StickerMule, alt: "StickerMule", darkBg: true, needsShadow: true },
		],
		collaborators: [
			{ href: "https://www2.uottawa.ca/en", ...uOttawa, alt: "uOttawa", darkBg: true, needsShadow: false },
			{ href: "https://carleton.ca/", ...Carleton, alt: "Carleton", darkBg: false, needsShadow: false },
			{ href: "https://www.facebook.com/uottawaeeffdg/", ...EEF, alt: "EEF", darkBg: true, needsShadow: true },
			{ href: "https://ieeeuottawa.ca/", ...uOttawaIEEE, alt: "uOttawa IEEE", darkBg: false, needsShadow: false },
			{ href: "https://wie.ieeeottawa.ca/", ...WIE, alt: "WIE", darkBg: true, needsShadow: true },
			{ href: "https://www.scesoc.ca/", ...SCESoc, alt: "SCESoc", darkBg: false, needsShadow: false },
			{ href: "https://ccss.carleton.ca/", ...CCSS, alt: "CCSS", darkBg: true, needsShadow: true },
			{ href: "https://www.cssa-aei.ca/", ...CSSA, alt: "CSSA", darkBg: false, needsShadow: true },
			{
				href: "https://ieeecarleton.ca/",
				...CarletonIEEE,
				alt: "Carleton IEEE",
				darkBg: true,
				needsShadow: false,
			},
			{ href: "https://www.telferbta.com/", ...telferBTA, alt: "Telfer BTA", darkBg: false, needsShadow: true },
			{ href: "https://www.uogdc.com/", ...uOGDC, alt: "uOttawa GDC", darkBg: true, needsShadow: true },
			{ href: "https://uocybersec.com/", ...uOCyberSec, alt: "uOCyberSec", darkBg: false, needsShadow: true },
			{
				href: "https://linktr.ee/uoengiqueers",
				...uOEngiqueers,
				alt: "uOEngiqueers",
				darkBg: true,
				needsShadow: false,
			},
			{
				href: "https://aitinkerers.org/p/welcome",
				...AITinkerers,
				alt: "AITinker",
				darkBg: false,
				needsShadow: false,
			},
			{
				href: "https://linktr.ee/desoc",
				...DEsocCarleton,
				alt: "DEsoc Carleton",
				darkBg: true,
				needsShadow: false,
			},
		],
	};

	const [hovered, setHovered] = useState(-1);
	const [hovered2, setHovered2] = useState(-1);

	return (
		<>
			<div className="w-full bg-shade-9 justify-center items-center bg-parabol-svg bg-center bg-cover bg-no-repeat bg-fixed">
				<div className="flex flex-col w-full h-full justify-center items-center gap-16 py-36 text-center">
					<div className="flex flex-col px-8 gap-4">
						<h1>{t("sponsors.title")}</h1>
						<h2>{t("sponsors.subtitle")}</h2>
					</div>
					<div className="grid grid-cols-3 gap-12 w-9/12 lg:grid-cols-2 lg:gap-8">
						{data.sponsors.map((sponsor, i) => (
							<a
								key={i}
								href={sponsor.href}
								target="_blank"
								rel="noreferrer"
								className={`flex justify-center items-center border-primary rounded-lg h-[12.5vw] md:h-32 p-8 md:p-4 shadow-grid-card transition-all duration-200
								 ${sponsor.darkBg ? "bg-dark_accent" : "bg-[#FF0000]"}
								 ${
										hovered !== -1 && hovered !== i
											? "opacity-25 translate-x-1 translate-y-1"
											: "bg-opacity-35 translate-x-0 translate-y-0"
									}`}
								onMouseEnter={() => setHovered(i)}
								onMouseLeave={() => setHovered(-1)}
								onBlur={() => setHovered(-1)}
							>
								<img
									alt={`${sponsor.alt} logo`}
									src={sponsor.src}
									className={`max-w-full max-h-full 
									${sponsor.needsShadow && "img-shadow"}`}
								></img>
							</a>
						))}
					</div>
					<div className="flex flex-col px-8 gap-4 mt-16">
						<h1>{t("collaborators.title")}</h1>
						<h2>{t("collaborators.subtitle")}</h2>
					</div>
					<div className="grid grid-cols-3 gap-12 w-9/12 lg:grid-cols-2 lg:gap-8">
						{data.collaborators.map((sponsor, i) => (
							<a
								key={i}
								href={sponsor.href}
								target="_blank"
								rel="noreferrer"
								className={`flex justify-center items-center border-primary rounded-lg h-[12.5vw] md:h-32 p-8 md:p-4 shadow-grid-card transition-all duration-200
								 ${sponsor.darkBg ? "bg-dark_accent" : "bg-[#FF0000]"}
								 ${
										hovered2 !== -1 && hovered2 !== i
											? "opacity-25 translate-x-1 translate-y-1"
											: "bg-opacity-35 translate-x-0 translate-y-0"
									}`}
								onMouseEnter={() => setHovered2(i)}
								onMouseLeave={() => setHovered2(-1)}
								onBlur={() => setHovered2(-1)}
							>
								<img
									alt={`${sponsor.alt} logo`}
									src={sponsor.src}
									className={`max-w-full max-h-full 
									${sponsor.needsShadow && "img-shadow"}`}
								></img>
							</a>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
