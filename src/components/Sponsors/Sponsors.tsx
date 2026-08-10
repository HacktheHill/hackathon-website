import { t } from "@/i18n";
import Button from "../Button/Button.jsx";
import styles from "./Sponsors.module.css";
import Ross from "@/assets/Logos/Ross.svg?url";
import Ciena from "@/assets/Logos/Ciena.svg?url";
import CSE from "@/assets/Logos/CSE.svg?url";
import PG from "@/assets/Logos/P&G.svg?url";
import LiquidIV from "@/assets/Logos/LiquidIV.webp?url";
import Redbull from "@/assets/Logos/Redbull.svg?url";
import Fantuan from "@/assets/Logos/Fantuan.webp?url";

import CCSS from "@/assets/Logos/ccss.png?url";
import Carleton from "@/assets/Logos/Carleton.svg?url";
import CarletonIEEE from "@/assets/Logos/CarletonIEEE.svg?url";
import uOCyberSec from "@/assets/Logos/uOCyberSec.svg?url";
import CSSA from "@/assets/Logos/CSSA.svg?url";
import uOttawaIEEE from "@/assets/Logos/uOttawaIEEE.svg?url";
import WIE from "@/assets/Logos/WIE.svg?url";
import EEF from "@/assets/Logos/EEF.svg?url";
import lonehaven from "@/assets/Logos/Lonehaven.webp?url";
import telferBTA from "@/assets/Logos/bta-logo.svg?url";
import SCESoc from "@/assets/Logos/SCESoc.svg?url";
import uOttawa from "@/assets/Logos/uOttawa.svg?url";
import uOGDC from "@/assets/Logos/uOttawaGDC.svg?url";
import maple1 from "@/assets/SVGs/Sponsors/mapleleaf-1.svg?url";
import maple2 from "@/assets/SVGs/Sponsors/mapleleaf-2.svg?url";
import uOEngiqueers from "@/assets/Logos/uOEngiqueers.webp?url";
import AITinkerers from "@/assets/Logos/AITinkerers.avif?url";
import DEsocCarleton from "@/assets/Logos/desocCarleton.webp?url";
import MakerJam from "@/assets/Logos/MakerJam.svg?url";

const Blackberry = "/Logos/Blackberry.svg";
const CanadianTire = "/Logos/CanadianTire.svg";
const Google = "/Logos/Google.svg";
const Vercel = "/Logos/Vercel.svg";
const DigitalOcean = "/Logos/DigitalOcean.svg";
const Echo3d = "/Logos/echo3d.webp";
const Balsamiq = "/Logos/balsamiq.svg";
const Voiceflow = "/Logos/voiceflow.svg";
const Ceed = "/Logos/ceed.svg";
const Law = "/Logos/Law.svg";
const CSClub = "/Logos/CSClub.svg";
const uOttawaEsports = "/Logos/uOttawaEsports.svg";

function Sponsors() {
	const data = {
		sponsors: [
			{
				size: "largest",
				organizations: [
					{ href: "https://ciena.ca/", src: Ciena, alt: "Ciena" },
					{ href: "https://www.rossvideo.com/", src: Ross, alt: "Ross" },
				],
			},
			{
				size: "large",
				organizations: [
					{ href: "https://blackberry.com/", src: Blackberry, alt: "BlackBerry" },
					{ href: "https://canadiantire.ca/", src: CanadianTire, alt: "Canadian Tire" },
				],
			},
			{
				size: "medium",
				organizations: [
					{ href: "https://lonehaven.com/", src: lonehaven, alt: "Lonehaven" },
					{ href: "https://www.cse-cst.gc.ca/", src: CSE, alt: "CSE / CST" },
				],
			},
			{
				size: "small",
				organizations: [
					{ href: "https://redbull.com/", src: Redbull, alt: "Redbull" },
					{ href: "https://www.pg.ca/en-ca/", src: PG, alt: "P&G" },
					{ href: "https://www.liquid-iv.com/", src: LiquidIV, alt: "LiquidIV" },
					{ href: "https://www.fantuan.ca/", src: Fantuan, alt: "Fantuan" },
					{ href: "https://about.google", src: Google, alt: "Google" },
				],
			},
			{
				size: "small",
				organizations: [
					{ href: "https://vercel.com/", src: Vercel, alt: "Vercel" },
					{ href: "https://www.digitalocean.com/", src: DigitalOcean, alt: "DigitalOcean" },
					{ href: "https://www.echo3d.com/", src: Echo3d, alt: "echo3D" },
					{ href: "https://balsamiq.com/", src: Balsamiq, alt: "Balsamiq" },
					{ href: "https://www.voiceflow.com/", src: Voiceflow, alt: "Voiceflow" },
				],
			},
		],
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
			{
				href: "https://www.uottawa.ca/faculty-engineering/events/maker-jam",
				src: MakerJam,
				alt: "Maker Jam",
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
					<img
						className={styles["maple-leaf"]}
						src={maple1}
						alt=""
						data-aos="fade-right"
						data-aos-duration="800"
					></img>
					<div className={styles["header-column"]}>
						<p className={styles.text} data-aos="fade-up" data-aos-duration="800">
							{t("sponsors.p")}
						</p>
						<div data-aos="fade-up" data-aos-duration="800">
							<Button href="mailto:sponsorship@hackthehill.com">{t("sponsors.button")}</Button>
						</div>
					</div>
					<img
						className={styles["maple-leaf"]}
						src={maple2}
						alt=""
						data-aos="fade-left"
						data-aos-duration="800"
					></img>
				</div>

				<div className={styles["icons"]}>
					{data.sponsors.map((row, i) => (
						<div key={i} className={styles["icons-row"]}>
							{row.organizations.map((sponsor, j) => (
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
										className={`${styles["icon"]} ${styles[`icon-${row.size}`]}`}
										alt={`${sponsor.alt} logo`}
										src={sponsor.src}
									></img>
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
			</section>
		</>
	);
}

export default Sponsors;
