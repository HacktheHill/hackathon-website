import React from "react";
import Button from "../Button/Button.jsx";
import styles from "./Sponsors.module.css";
import { t } from "../../i18n";
import balsamiq from "/Logos/balsamiq.svg";
import Blackberry from "/Logos/Blackberry.svg";
import CSClub from "/Logos/CSClub.svg";
import CSE from "/Logos/CSE.svg";
import CanadianTire from "/Logos/CanadianTire.svg";
import Carleton from "/Logos/Carleton.svg";
import CarletonIEEE from "/Logos/CarletonIEEE.svg";
import Ciena from "/Logos/Ciena.svg";
import DigitalOcean from "/Logos/DigitalOcean.svg";
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
import uOttawaEsports from "/Logos/uOttawaEsports.svg";
import uOGDC from "/Logos/uOttawaGDC.svg";
import voiceflow from "/Logos/voiceflow.svg";

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
			{ href: "https://www.eventbrite.ca/e/maker-jam-tickets-510317221547", src: MakerJam },
			{ href: "https://www2.uottawa.ca/en", src: uOttawa },
			{ href: "https://carleton.ca/", src: Carleton },
			{ href: "https://ieeecarleton.ca/", src: CarletonIEEE },
			{ href: "https://www.scesoc.ca/", src: SCESoc },
			{ href: "https://www.facebook.com/uottawaeeffdg/", src: EEF },
			{ href: "https://uocsclub.ca/", src: CSClub },
			{ href: "https://www.instagram.com/uogamedev/", src: uOGDC },
			{ href: "https://www.uottawaesports.ca/", src: uOttawaEsports },
		],
	};

	return (
		<div>
			<section id="sponsors" className={styles["sponsors"]}>
				<h1>{t("sponsors.title")}</h1>
				<div>
					<p className={styles["sponsors-text"]}>{t("sponsors.p")}</p>
					<Button href="/assets/Hack-the-Hill-Sponsorship.pdf">{t("sponsors.button")}</Button>
				</div>

				<div className={styles["sponsors-col"]}>
					{Object.values(data.sponsors).map((tier, i) => (
						<div key={i} className={styles["sponsors-row"]}>
							{tier.map((sponsor, j) => (
								<a
									key={j}
									href={sponsor.href}
									target="_blank"
									rel="noreferrer"
									className={styles["sponsors-icon-box"]}
								>
									<img
										className={`${styles["sponsor-icon"]} ${
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
			</section>

			<section className={styles["sponsors"]}>
				<h1 id="community">{t("partners.title")}</h1>
				<div className={styles["sponsors-row"]}>
					{data.collaborators.map((sponsor, i) => (
						<a
							key={i}
							href={sponsor.href}
							target="_blank"
							rel="noreferrer"
							className={styles["sponsor-icon-box"]}
						>
							<img
								className={`${styles["sponsor-icon"]} ${styles[`icon-medium`]}`}
								alt={t("partners.icon_alt")}
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
