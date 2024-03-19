import React, { useEffect } from "react";
import { t } from "../../i18n";
import styles from "./Sponsors.module.css";
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
		sponsors: {
			large: [
				{ href: "https://ciena.ca/", ...Ciena, alt: "Ciena" },
				{ href: "https://canadiantire.ca/", ...CanadianTire, alt: "Canadian Tire" },
			],
			medium: [
				{ href: "https://blackberry.com/", ...Blackberry, alt: "Blackberry" },
				{ href: "https://www.cse-cst.gc.ca/", ...CSE, alt: "CSE / CST" },
				{ href: "https://lonehaven.com/", ...lonehaven, alt: "Lonehaven" },
			],
			small: [
				{ href: "https://about.google", ...Google, alt: "Google" },
				{ href: "https://vercel.com/", ...Vercel, alt: "Vercel" },
				{ href: "https://www.digitalocean.com/", ...DigitalOcean, alt: "DigitalOcean" },
				{ href: "https://www.echo3d.com/", ...echo3d, alt: "echo3D" },
				{ href: "https://balsamiq.com/", ...balsamiq, alt: "balsamiq" },
				{ href: "https://www.voiceflow.com/", ...voiceflow, alt: "Voiceflow" },
				{ href: "https://mule.to/p5ni", ...StickerMule, alt: "StickerMule" },
				{ href: "https://www.openproject.org/", ...OpenProject, alt: "OpenProject" },
			],
		},
		collaborators: [
			{ href: "https://www2.uottawa.ca/en", ...uOttawa },
			{ href: "https://carleton.ca/", ...Carleton },
			{ href: "https://www.facebook.com/uottawaeeffdg/", ...EEF },
			{ href: "https://ieeeuottawa.ca/", ...uOttawaIEEE },
			{ href: "https://wie.ieeeottawa.ca/", ...WIE },
			{ href: "https://www.scesoc.ca/", ...SCESoc },
			{ href: "https://ccss.carleton.ca/", ...CCSS },
			{ href: "https://www.cssa-aei.ca/", ...CSSA },
			{ href: "https://ieeecarleton.ca/", ...CarletonIEEE },
			{ href: "https://www.telferbta.com/", ...telferBTA },
			{ href: "https://www.uogdc.com/", ...uOGDC },
			{ href: "https://uocybersec.com/", ...uOCyberSec },
			{ href: "https://linktr.ee/uoengiqueers", ...uOEngiqueers },
			{ href: "https://aitinkerers.org/p/welcome", ...AITinkerers },
			{ href: "https://linktr.ee/desoc", ...DEsocCarleton },
		],
	};

	return (
		<>
			<div id="sponsors" className={`${styles["sponsors-collaborators"]} ${styles["sponsors"]}`}>
				<h1>{t("sponsors.title")}</h1>
				<div className={styles["icons"]}>
					{Object.values(data.sponsors).map((tier, i) => (
						<div key={i} className={styles["icons-row"]}>
							{tier.map((sponsor, j) => (
								<a
									key={j}
									href={sponsor.href}
									target="_blank"
									rel="noreferrer"
									className={styles["icon-box"]}
								>
									<img
										className={`${styles["icon"]} ${
											styles[`icon-${Object.keys(data.sponsors)[i]}`]
										}`}
										alt={`${sponsor.alt} logo`}
										src={sponsor.src}
									></img>
								</a>
							))}
						</div>
					))}
				</div>
			</div>
			<div id="collaborators" className={`${styles["sponsors-collaborators"]} ${styles["collaborators"]}`}>
				<h1>{t("collaborators.title")}</h1>
				<div className={styles["icons-row"]}>
					{data.collaborators.map((sponsor, i) => (
						<a key={i} href={sponsor.href} target="_blank" rel="noreferrer" className={styles["icon-box"]}>
							<img
								className={`${styles["icon"]} ${styles["icon-medium"]}`}
								alt={t("collaborators.icon_alt")}
								src={sponsor.src}
							></img>
						</a>
					))}
				</div>
			</div>
		</>
	);
}
