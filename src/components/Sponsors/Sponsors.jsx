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

export default function Sponsors() {
	const data = {
		sponsors: [
			{ href: "https://ciena.ca/", ...Ciena, alt: "Ciena" },
			{ href: "https://blackberry.com/", ...Blackberry, alt: "Blackberry" },
			{
				href: "https://canadiantire.ca/",
				...CanadianTire,
				alt: "Canadian Tire",
			},
			{ href: "https://lonehaven.com/", ...lonehaven, alt: "Lonehaven" },
			{ href: "https://www.cse-cst.gc.ca/", ...CSE, alt: "CSE / CST" },

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
	};

	const [hovered, setHovered] = useState(-1);

	return (
		<>
			<div className="w-full flex justify-center items-center">
				<div className="flex flex-col w-full h-full justify-center items-center gap-16 py-36 text-center max-w-2xl">
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
								className={`flex justify-center items-center rounded-lg h-52 md:h-32 p-8 md:p-4 transition-all duration-200
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
									className="max-w-full max-h-full"
								></img>
							</a>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
