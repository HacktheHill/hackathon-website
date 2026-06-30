import React, { useEffect } from "react";
import { t } from "@/i18n";
import Button from "../Button/Button.jsx";
import styles from "./Sponsors.module.css";
import Ross from "@/assets/Logos/Ross.svg?url";
import Ciena from "@/assets/Logos/Ciena.svg?url";
import CSE from "@/assets/Logos/CSE.svg?url";
import PG from "@/assets/Logos/P&G.svg?url";
import LiquidIV from "@/assets/Logos/LiquidIV.png?url";
import Redbull from "@/assets/Logos/Redbull.svg?url";
import Fantuan from "@/assets/Logos/Fantuan.png?url";

import CCSS from "@/assets/Logos/ccss.png?url";
import Carleton from "@/assets/Logos/Carleton.svg?url";
import CarletonIEEE from "@/assets/Logos/CarletonIEEE.svg?url";
import uOCyberSec from "@/assets/Logos/uOCyberSec.svg?url";
import CSSA from "@/assets/Logos/CSSA.svg?url";
import uOttawaIEEE from "@/assets/Logos/uOttawaIEEE.svg?url";
import WIE from "@/assets/Logos/WIE.svg?url";
import EEF from "@/assets/Logos/EEF.svg?url";
import lonehaven from "@/assets/Logos/Lonehaven.svg?url";
import telferBTA from "@/assets/Logos/bta-logo.svg?url";
import SCESoc from "@/assets/Logos/SCESoc.svg?url";
import uOttawa from "@/assets/Logos/uOttawa.svg?url";
import uOGDC from "@/assets/Logos/uOttawaGDC.svg?url";
import maple1 from "@/assets/SVGs/Sponsors/mapleleaf-1.svg?url";
import maple2 from "@/assets/SVGs/Sponsors/mapleleaf-2.svg?url";
import uOEngiqueers from "@/assets/Logos/uOEngiqueers.webp?url";
import AITinkerers from "@/assets/Logos/AITinkerers.avif?url";
import DEsocCarleton from "@/assets/Logos/desocCarleton.webp?url";

//animations
import AOS from "aos";
import "aos/dist/aos.css";

function Sponsors() {
	const data = {
		sponsors: {
			large: [
				{ href: "https://www.rossvideo.com/", src: Ross, alt: "Ross" },
				{ href: "https://ciena.ca/", src: Ciena, alt: "Ciena" },
				{ href: "https://lonehaven.com/", src: lonehaven, alt: "Lonehaven" },
			],
			medium: [
				{ href: "https://www.cse-cst.gc.ca/", src: CSE, alt: "CSE / CST" },
				{ href: "https://redbull.com/", src: Redbull, alt: "Redbull" },
			],
			small: [
				{ href: "https://www.pg.ca/en-ca/", src: PG, alt: "P&G" },
				{ href: "https://www.liquid-iv.com/", src: LiquidIV, alt: "LiquidIV" },
				{ href: "https://www.fantuan.ca/", src: Fantuan, alt: "Fantuan" },
			],
		},
		collaborators: [
			{ href: "https://www2.uottawa.ca/en", src: uOttawa, alt: "University of Ottawa" },
			{ href: "https://carleton.ca/", src: Carleton, alt: "Carleton University" },
			{ href: "https://www.facebook.com/uottawaeeffdg/", src: EEF, alt: "Engineering Endowment Fund" },
			{ href: "https://ieeeuottawa.ca/", src: uOttawaIEEE, alt: "IEEE uOttawa Student Branch" },
			{ href: "https://wie.ieeeottawa.ca/", src: WIE, alt: "Women in Engineering uOttawa" },
			{ href: "https://www.scesoc.ca/", src: SCESoc, alt: "Carleton Systems and Computer Engineering Society" },
			{ href: "https://ccss.carleton.ca/", src: CCSS, alt: "Carleton Computer Science Society" },
			{ href: "https://www.cssa-aei.ca/", src: CSSA, alt: "Computer Science Students' Association" },
			{ href: "https://ieeecarleton.ca/", src: CarletonIEEE, alt: "IEEE Carleton University" },
			{ href: "https://www.telferbta.com/", src: telferBTA, alt: "Telfer Business Technology Association" },
			{ href: "https://www.uogdc.com/", src: uOGDC, alt: "uOttawa Game Development Club" },
			{ href: "https://uocybersec.com/", src: uOCyberSec, alt: "uOttawa Cybersecurity Club" },
			{ href: "https://linktr.ee/uoengiqueers", src: uOEngiqueers, alt: "uOttawa EngiQueers" },
			{ href: "https://aitinkerers.org/p/welcome", src: AITinkerers, alt: "AI Tinkerers Ottawa" },
			{ href: "https://linktr.ee/desoc", src: DEsocCarleton, alt: "Carleton Department of Electronics Society" },
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
								alt={`${sponsor.alt} logo`}
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
