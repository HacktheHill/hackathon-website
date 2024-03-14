import React, { useEffect } from "react";
import { t } from "../../i18n";
import Button from "../Button/Button.jsx";
import styles from "./Sponsors.module.css";
import Blackberry from "/Logos/Blackberry.svg";
import CSE from "/Logos/CSE.svg";
import CanadianTire from "/Logos/CanadianTire.svg";
import CCSS from "/Logos/CCSS.png";
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
import lonehaven from "/Logos/Lonehaven.svg";
import telferBTA from "/Logos/bta-logo.svg";
import SCESoc from "/Logos/SCESoc.svg";
import Vercel from "/Logos/Vercel.svg";
import balsamiq from "/Logos/balsamiq.svg";
import echo3d from "/Logos/echo3d.webp";
import uOttawa from "/Logos/uOttawa.svg";
import uOGDC from "/Logos/uOttawaGDC.svg";
import voiceflow from "/Logos/voiceflow.svg";
import StickerMule from "/Logos/StickerMule.svg";
import OpenProject from "/Logos/OpenProject.svg";
import maple1 from "/SVGs/Sponsors/mapleleaf-1.svg";
import maple2 from "/SVGs/Sponsors/mapleleaf-2.svg";
import uOEngiqueers from "/Logos/uOEngiqueers.webp";
import CUHacking from "/Logos/CUHacking.svg";
import AITinkerers from "/Logos/AITinkerers.avif";
import DEsocCarleton from "/Logos/desocCarleton.webp";

//animations
import AOS from "aos";
import "aos/dist/aos.css";

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
				{ href: "https://lonehaven.com/", src: lonehaven, alt: "Lonehaven" },
			],
			small: [
				{ href: "https://about.google", src: Google, alt: "Google" },
				{ href: "https://vercel.com/", src: Vercel, alt: "Vercel" },
				{ href: "https://www.digitalocean.com/", src: DigitalOcean, alt: "DigitalOcean" },
				{ href: "https://www.echo3d.com/", src: echo3d, alt: "echo3D" },
				{ href: "https://balsamiq.com/", src: balsamiq, alt: "balsamiq" },
				{ href: "https://www.voiceflow.com/", src: voiceflow, alt: "Voiceflow" },
				{ href: "https://mule.to/p5ni", src: StickerMule, alt: "StickerMule" },
				{ href: "https://www.openproject.org/", src: OpenProject, alt: "OpenProject" }
			],
		},
		collaborators: [
			{ href: "https://www.facebook.com/uottawaeeffdg/", src: EEF },
			{ href: "https://www.cssa-aei.ca/", src: CSSA },
			{ href: "https://ieeecarleton.ca/", src: CarletonIEEE },
			{ href: "https://www.uogdc.com/", src: uOGDC },
			{ href: "https://uocybersec.com/", src: uOCyberSec },
			{ href: "https://wie.ieeeottawa.ca/", src: WIE },
			{ href: "https://ieeeuottawa.ca/", src: uOttawaIEEE },
			{ href: "https://www.scesoc.ca/", src: SCESoc },
			{ href: "https://ccss.carleton.ca/", src: CCSS},
			{ href: "https://carleton.ca/", src: Carleton },
			{ href: "https://www.telferbta.com", src: telferBTA },
			{ href: "https://www2.uottawa.ca/en", src: uOttawa },
			{ href: "https://linktr.ee/uoengiqueers", src: uOEngiqueers },
			{ href: "https://www.cuhacking.ca/", src: CUHacking},
			{ href: "https://aitinkerers.org/p/welcome", src: AITinkerers},
			{ href: "https://linktr.ee/desoc", src: DEsocCarleton }
		],
	};

	useEffect(() => {
		AOS.init({});
	}, []);

	return (
		<>
			<div id="sponsors" className={`${styles["sponsors-collaborators"]} ${styles["sponsors"]}`}>
				<h1 data-aos="fade-up" data-aos-duration="800">
					{t("sponsors.title")}
				</h1>
				<div className={styles.header}>
					<img
						className={styles["maple-leaf"]}
						src={maple1}
						alt="maple leaf"
						data-aos="fade-right"
						data-aos-duration="800"
					></img>
					<div className={styles["header-column"]}>
						<p className={styles.text} data-aos="fade-up" data-aos-duration="800">
							{t("sponsors.p")}
						</p>
						<Button href="mailto:sponsorship@hackthehill.com" data-aos="fade-up" data-aos-duration="800">
							{t("sponsors.button")}
						</Button>
					</div>
					<img
						className={styles["maple-leaf"]}
						src={maple2}
						alt="maple leaf"
						data-aos="fade-left"
						data-aos-duration="800"
					></img>
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
									data-aos="fade-up"
									data-aos-duration="800"
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
				<h1 data-aos="fade-up" data-aos-duration="800">
					{t("collaborators.title")}
				</h1>
				<div className={styles["icons-row"]}>
					{data.collaborators.map((sponsor, i) => (
						<a
							key={i}
							href={sponsor.href}
							target="_blank"
							rel="noreferrer"
							className={styles["icon-box"]}
							data-aos="fade-up"
							data-aos-duration="800"
						>
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

export default Sponsors;
