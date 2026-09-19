import { locale, t } from "@/i18n";
import { useStore } from "@nanostores/react";
import Button from "../Button/Button.jsx";
import styles from "./Sponsors.module.css";
import CGI from "@/assets/Logos/CGI.svg?url";
import Ciena from "@/assets/Logos/Ciena.svg?url";
import ElevenLabs from "@/assets/Logos/ElevenLabs.svg?url";
import CAIS from "@/assets/Logos/CAIS.svg?url";
import EEF from "@/assets/Logos/EEF.svg?url";
import ESS from "@/assets/Logos/ESS.svg?url";
import SESA from "@/assets/Logos/SESA.svg?url";
import UOSU from "@/assets/Logos/UOSU.svg?url";
import uODPA from "@/assets/Logos/uODPA.svg?url";
import uOttawa from "@/assets/Logos/uOttawa.svg?url";
import uOttawaIEEE from "@/assets/Logos/uOttawaIEEE.svg?url";
const SNOWBANKS = Array.from(
	{ length: 7 },
	(_, index) => `/art/sponsors/snowbank-${index + 1}.webp`,
);

type Organization = { href: string; src: string; alt: string };
type Sponsor = Organization & { size: "largest" | "large" | "small" };
type SponsorData = {
	sponsors: Sponsor[];
	collaborators: Organization[];
};

function Sponsors() {
	const currentLocale = useStore(locale);
	const data: SponsorData = {
		sponsors: [
			{ href: "https://www.cgi.com/", src: CGI, alt: "CGI", size: "largest" },
			{ href: "https://www.ciena.ca/", src: Ciena, alt: "Ciena", size: "large" },
			{ href: "https://elevenlabs.io/", src: ElevenLabs, alt: "ElevenLabs", size: "small" },
		],
		collaborators: [
			{ href: "https://www.uottawa.ca/en", src: uOttawa, alt: "uOttawa" },
			{ href: "https://www.essaeg.ca/", src: ESS, alt: "Engineering Students' Society" },
			{ href: "https://www.facebook.com/uottawaeeffdg/", src: EEF, alt: "Engineering Endowment Fund" },
			{ href: "https://ieeeuottawa.ca/", src: uOttawaIEEE, alt: "IEEE uOttawa" },
			{ href: "https://www.sesa-aegl.ca/", src: SESA, alt: "Software Engineering Students' Association" },
			{ href: "https://www.seuo-uosu.com/", src: UOSU, alt: "UOSU" },
			{ href: "https://uodpa-apnuo.org/", src: uODPA, alt: "uODPA APNuO" },
			{ href: "https://carletonai.com/", src: CAIS, alt: "Carleton AI Society" },
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
					{data.sponsors.map((sponsor, rowIndex) => (
						<div
							key={sponsor.href}
							className={styles["sponsor-tier-row"]}
							data-sponsor-tier-row={sponsor.size}
						>
							<a
								href={sponsor.href}
								target="_blank"
								rel="noreferrer"
								data-sponsor-card
								data-sponsor-tier={sponsor.size}
								className={styles["sponsor-card"]}
								data-aos="fade-up"
								data-aos-duration="800"
							>
								<img
									className={styles.snowbank}
									src={SNOWBANKS[rowIndex % SNOWBANKS.length]}
									alt=""
									aria-hidden="true"
									loading="lazy"
									decoding="async"
								/>
								<img
									className={styles.icon}
									alt={currentLocale === "fr" ? `Logo de ${sponsor.alt}` : `${sponsor.alt} logo`}
									src={sponsor.src}
									loading="lazy"
									decoding="async"
								/>
							</a>
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
					{data.collaborators.map(collaborator => (
						<a
							key={collaborator.href}
							href={collaborator.href}
							target="_blank"
							rel="noreferrer"
							className={styles["collaborator-card"]}
							data-collaborator-card
							data-aos="fade-up"
							data-aos-duration="800"
						>
							<img
								className={`${styles["icon"]} ${styles["icon-medium"]}`}
								alt={currentLocale === "fr" ? `Logo de ${collaborator.alt}` : `${collaborator.alt} logo`}
								src={collaborator.src}
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
