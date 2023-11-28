import React from "react";
import { t } from "../../i18n";
import Button from "../Button/Button.jsx";
import styles from "./Sponsors.module.css";
import Blackberry from "/Logos/Blackberry.svg";
import CSE from "/Logos/CSE.svg";
import CanadianTire from "/Logos/CanadianTire.svg";
import Carleton from "/Logos/Carleton.svg";
import CarletonIEEE from "/Logos/CarletonIEEE.svg";
import Ciena from "/Logos/Ciena.svg";
import DigitalOcean from "/Logos/DigitalOcean.svg";
import uOCyberSec from "/Logos/uOCyberSec.svg";
import CSSA from "/Logos/CSSA.svg";
import uOttawaIEEE from "/Logos/uOttawaIEEE.svg";
import WIE from "/Logos/WIE.svg";
import EEF from "/Logos/EEF.svg";
import Google from "/Logos/Google.svg";
import Law from "/Logos/Law.svg";
import lonehaven from "/Logos/Lonehaven.svg";
import MakerJam from "/Logos/MakerJam.svg";
import SCESoc from "/Logos/SCESoc.svg";
import Vercel from "/Logos/Vercel.svg";
import balsamiq from "/Logos/balsamiq.svg";
import Ceed from "/Logos/ceed.svg";
import echo3d from "/Logos/echo3d.webp";
import uOttawa from "/Logos/uOttawa.svg";
import uOGDC from "/Logos/uOttawaGDC.svg";
import voiceflow from "/Logos/voiceflow.svg";
import maple1 from "/SVGs/Sponsors/mapleleaf-1.svg";
import maple2 from "/SVGs/Sponsors/mapleleaf-2.svg";

function Sponsors() {
	const data = {
		sponsors: {
			large: [
				{ href: "https://ciena.ca/", src: Ciena, alt: "Ciena" },
				{ href: "https://canadiantire.ca/", src: CanadianTire, alt: "Canadian Tire" },
			],
			medium: [
				{ href: "https://blackberry.com/", src: Blackberry, alt: "Blackberry" },
				{ href: "https://www.cse-cst.gc.ca/", src: CSE, alt: "CSE / CST" },
				{ href: "https://www.lonehaven.com/", src: lonehaven, alt: "Lonehaven" },
			],
			small: [
				{ href: "https://about.google", src: Google, alt: "Google" },
				{ href: "https://vercel.com/", src: Vercel, alt: "Vercel" },
				{ href: "https://www.digitalocean.com/", src: DigitalOcean, alt: "DigitalOcean" },
				{ href: "https://www.echo3d.com/", src: echo3d, alt: "echo3D" },
				{ href: "https://balsamiq.com/", src: balsamiq, alt: "balsamiq" },
				{ href: "https://www.voiceflow.com/", src: voiceflow, alt: "Voiceflow" },
			],
		},
		collaborators: [
			{ href: "https://ceed-uottawa.ca/", src: Ceed },
			{
				href: "https://www.uottawa.ca/faculty-law/common-law/centre-environmental-law-global-sustainability",
				src: Law,
			},
			{ href: "https://www.uottawa.ca/faculty-engineering/events/maker-jam", src: MakerJam },
			{ href: "https://www2.uottawa.ca/en", src: uOttawa },
			{ href: "https://carleton.ca/", src: Carleton },
			{ href: "https://ieeecarleton.ca/", src: CarletonIEEE },
			{ href: "https://www.scesoc.ca/", src: SCESoc },
			{ href: "https://www.facebook.com/uottawaeeffdg/", src: EEF },
			{ href: "https://www.uogdc.com/", src: uOGDC },
			{ href: "https://www.cssa-aei.ca/", src: CSSA },
			{ href: "https://ieeeuottawa.ca/", src: uOttawaIEEE },
			{ href: "https://uocybersec.com/", src: uOCyberSec },
			{ href: "https://wie.ieeeottawa.ca/", src: WIE },
		],
	};

	return (
		<>
			<div id="sponsors" className={`${styles["sponsors-collaborators"]} ${styles["sponsors"]}`}>
				<h1>{t("sponsors.title")}</h1>
				<div className={styles.header}>
					<img className={styles["maple-leaf"]} src={maple1} alt="maple leaf"></img>
					<div className={styles["header-column"]}>
						<p className={styles.text}>{t("sponsors.p")}</p>
						<Button href="mailto:sponsorship@hackthehill.com">{t("sponsors.button")}</Button>
					</div>
					<img className={styles["maple-leaf"]} src={maple2} alt="maple leaf"></img>
				</div>

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
								alt={t("partners.icon_alt")}
								src={sponsor.src}
							></img>
						</a>
					))}
				</div>
			</div>
		</>
	);
}

export default Sponsors;
