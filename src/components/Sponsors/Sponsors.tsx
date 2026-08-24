import { t } from "@/i18n";
import Button from "../Button/Button.jsx";
import styles from "./Sponsors.module.css";
import Ross from "@/assets/Logos/Ross.svg?url";
import Ciena from "@/assets/Logos/Ciena.svg?url";
import CSE from "@/assets/Logos/CSE.svg?url";
import ESS from "@/assets/Logos/ESS.svg?url";
import PG from "@/assets/Logos/P&G.svg?url";
import LiquidIV from "@/assets/Logos/LiquidIV.webp?url";
import Redbull from "@/assets/Logos/Redbull.svg?url";
import SESA from "@/assets/Logos/SESA.svg?url";
import Fantuan from "@/assets/Logos/Fantuan.webp?url";

import CCSS from "@/assets/Logos/ccss.png?url";
import Carleton from "@/assets/Logos/Carleton.svg?url";
import CarletonIEEE from "@/assets/Logos/CarletonIEEE.svg?url";
import uOCyberSec from "@/assets/Logos/uOCyberSec.svg?url";
import CSSA from "@/assets/Logos/CSSA.svg?url";
import uOttawaIEEE from "@/assets/Logos/uOttawaIEEE.svg?url";
import WIE from "@/assets/Logos/WIE.svg?url";
import EEF from "@/assets/Logos/EEF.svg?url";
import telferBTA from "@/assets/Logos/bta-logo.svg?url";
import SCESoc from "@/assets/Logos/SCESoc.svg?url";
import uOttawa from "@/assets/Logos/uOttawa.svg?url";
import uOGDC from "@/assets/Logos/uOttawaGDC.svg?url";
import uOEngiqueers from "@/assets/Logos/uOEngiqueers.svg?url";
import DEsocCarleton from "@/assets/Logos/desocCarleton.webp?url";

const Blackberry = "/Logos/Blackberry.svg";
const CanadianTire = "/Logos/CanadianTire.svg";
const Google = "/Logos/Google.svg";
const Vercel = "/Logos/Vercel.svg";
const DigitalOcean = "/Logos/DigitalOcean.svg";
const Echo3d = "/Logos/echo3d.webp";
const Balsamiq = "/Logos/balsamiq.svg";
const Voiceflow = "/Logos/voiceflow.svg";
const Lonehaven = "/Logos/Lonehaven.svg";
const Ceed = "/Logos/ceed.svg";
const Law = "/Logos/Law.svg";
const CSClub = "/Logos/CSClub.svg";
const uOttawaEsports = "/Logos/uOttawaEsports.svg";
const SNOWBANKS = Array.from(
	{ length: 7 },
	(_, index) => `/art/sponsors/snowbank-${index + 1}.webp`,
);

type Organization = { href: string; src: string; alt: string };
type SponsorTier = "backbencher" | "councillor" | "mayor" | "premier" | "prime-minister";
type SponsorData = {
	sponsors: Record<SponsorTier, Organization[]>;
	collaborators: Organization[];
};
const VISIBLE_SPONSOR_ROWS: SponsorTier[][] = [["prime-minister"], ["premier"], ["mayor", "councillor"]];

function Sponsors() {
	const data: SponsorData = {
		sponsors: {
			"prime-minister": [
				{ href: "https://ciena.ca/", src: Ciena, alt: "Ciena" },
				{ href: "https://www.rossvideo.com/", src: Ross, alt: "Ross" },
			],
			premier: [
				{ href: "https://blackberry.com/", src: Blackberry, alt: "BlackBerry" },
				{ href: "https://canadiantire.ca/", src: CanadianTire, alt: "Canadian Tire" },
			],
			mayor: [
				{ href: "https://lonehaven.com/", src: Lonehaven, alt: "Lonehaven" },
				{ href: "https://www.cse-cst.gc.ca/", src: CSE, alt: "CSE / CST" },
			],
			councillor: [
				{ href: "https://redbull.com/", src: Redbull, alt: "Redbull" },
				{ href: "https://www.liquid-iv.com/", src: LiquidIV, alt: "LiquidIV" },
				{ href: "https://www.fantuan.ca/", src: Fantuan, alt: "Fantuan" },
			],
			backbencher: [
				{ href: "https://www.pg.ca/en-ca/", src: PG, alt: "P&G" },
				{ href: "https://about.google", src: Google, alt: "Google" },
				{ href: "https://vercel.com/", src: Vercel, alt: "Vercel" },
				{ href: "https://www.digitalocean.com/", src: DigitalOcean, alt: "DigitalOcean" },
				{ href: "https://www.echo3d.com/", src: Echo3d, alt: "echo3D" },
				{ href: "https://balsamiq.com/", src: Balsamiq, alt: "Balsamiq" },
				{ href: "https://www.voiceflow.com/", src: Voiceflow, alt: "Voiceflow" },
			],
		},
		collaborators: [
			{ href: "https://www2.uottawa.ca/en", src: uOttawa, alt: "University of Ottawa" },
			{ href: "https://carleton.ca/", src: Carleton, alt: "Carleton University" },
			{ href: "https://www.essaeg.ca/", src: ESS, alt: "uOttawa Engineering Students' Society" },
			{ href: "https://www.facebook.com/uottawaeeffdg/", src: EEF, alt: "Engineering Endowment Fund" },
			{ href: "https://ieeeuottawa.ca/", src: uOttawaIEEE, alt: "IEEE uOttawa Student Branch" },
			{ href: "https://wie.ieeeottawa.ca/", src: WIE, alt: "Women in Engineering uOttawa" },
			{ href: "https://www.scesoc.ca/", src: SCESoc, alt: "Carleton Systems and Computer Engineering Society" },
			{ href: "https://www.sesa-aegl.ca/", src: SESA, alt: "uOttawa Software Engineering Students' Association" },
			{ href: "https://ccss.carleton.ca/", src: CCSS, alt: "Carleton Computer Science Society" },
			{ href: "https://www.cssa-aei.ca/", src: CSSA, alt: "Computer Science Students' Association" },
			{ href: "https://ieeecarleton.ca/", src: CarletonIEEE, alt: "IEEE Carleton University" },
			{ href: "https://www.telferbta.com/", src: telferBTA, alt: "Telfer Business Technology Association" },
			{ href: "https://www.uogdc.com/", src: uOGDC, alt: "uOttawa Game Development Club" },
			{ href: "https://uocybersec.com/", src: uOCyberSec, alt: "uOttawa Cybersecurity Club" },
			{ href: "https://linktr.ee/uoengiqueers", src: uOEngiqueers, alt: "uOttawa EngiQueers" },
			{ href: "https://linktr.ee/desoc", src: DEsocCarleton, alt: "Carleton Department of Electronics Society" },
			{
				href: "https://www.uottawa.ca/faculty-engineering/centre-entrepreneurship-engineering-design",
				src: Ceed,
				alt: "uOttawa CEED",
			},
			{
				href: "https://www.uottawa.ca/faculty-law/common-law/centre-environmental-law-global-sustainability",
				src: Law,
				alt: "uOttawa Centre for Environmental Law and Global Sustainability",
			},
			{ href: "https://uocsclub.net/", src: CSClub, alt: "uOttawa Computer Science Club" },
			{ href: "https://linktr.ee/uottawaesports", src: uOttawaEsports, alt: "uOttawa Esports" },
		],
	};
	return (
		<>
			<section
				id="sponsors"
				className={`${styles["sponsors-collaborators"]} ${styles["sponsors"]}`}
				aria-labelledby="sponsors-title"
			>
				<h2 id="sponsors-title" className="section-heading" data-aos="fade-up" data-aos-duration="800">
					{t("sponsors.title")}
				</h2>
				<div className={styles.header}>
					<div className={styles["header-column"]}>
						<p className={styles.text} data-aos="fade-up" data-aos-duration="800">
							{t("sponsors.p")}
						</p>
						<div className={styles["sponsor-cta-container"]} data-aos="fade-up" data-aos-duration="800">
							<Button className={styles["sponsor-cta"]} href="mailto:sponsorship@hackthehill.com">
								{t("sponsors.button")}
							</Button>
						</div>
					</div>
				</div>

				<div className={styles["icons"]}>
					{VISIBLE_SPONSOR_ROWS.map((tiers, rowIndex) => (
						<div
							key={tiers.join("-")}
							className={styles["sponsor-tier-row"]}
							data-sponsor-tier-row={tiers.join(" ")}
						>
							{tiers
								.flatMap(tier => data.sponsors[tier].map(sponsor => ({ sponsor, tier })))
								.map(({ sponsor, tier }, index) => (
									<a
										key={sponsor.href}
										href={sponsor.href}
										target="_blank"
										rel="noreferrer"
										data-sponsor-card
										data-sponsor-tier={tier}
										className={styles["sponsor-card"]}
										data-aos="fade-up"
										data-aos-duration="800"
									>
										<img
											className={styles.snowbank}
											src={SNOWBANKS[(rowIndex + index) % SNOWBANKS.length]}
											alt=""
											aria-hidden="true"
											loading="lazy"
											decoding="async"
										/>
										<img
											className={styles.icon}
											alt={`${sponsor.alt} logo`}
											src={sponsor.src}
											loading="lazy"
											decoding="async"
										/>
									</a>
								))}
						</div>
					))}
				</div>
			</section>
			<section
				id="collaborators"
				className={`${styles["sponsors-collaborators"]} ${styles["collaborators"]}`}
				aria-labelledby="collaborators-title"
			>
				<h2
					id="collaborators-title"
					className="section-heading"
					data-aos="fade-up"
					data-aos-duration="800"
				>
					{t("collaborators.title")}
				</h2>
				<div className={`${styles["icons-row"]} ${styles["collaborator-icons"]}`}>
					{data.collaborators.map((sponsor, i) => (
						<a
							key={i}
							href={sponsor.href}
							target="_blank"
							rel="noreferrer"
							className={styles["collaborator-card"]}
							data-aos="fade-up"
							data-aos-duration="800"
						>
							<img
								className={`${styles["icon"]} ${styles["icon-medium"]}`}
								alt={`${sponsor.alt} logo`}
								src={sponsor.src}
								loading="lazy"
								decoding="async"
							></img>
						</a>
					))}
				</div>
			</section>
		</>
	);
}

export default Sponsors;
