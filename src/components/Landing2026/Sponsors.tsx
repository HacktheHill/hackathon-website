import { t } from "@/i18n";
import Ciena from "@/assets/Logos/Ciena.svg?url";
import CSE from "@/assets/Logos/CSE.svg?url";
import Fantuan from "@/assets/Logos/Fantuan.png?url";
import LiquidIV from "@/assets/Logos/LiquidIV.png?url";
import Lonehaven from "@/assets/Logos/Lonehaven.svg?url";
import PG from "@/assets/Logos/P&G.svg?url";
import Redbull from "@/assets/Logos/Redbull.svg?url";
import Ross from "@/assets/Logos/Ross.svg?url";
import styles from "./Landing2026.module.css";

const sponsors = [
	{ name: "Ross Video", href: "https://www.rossvideo.com/", logo: Ross, logoShape: "wide" },
	{ name: "Ciena", href: "https://ciena.ca/", logo: Ciena, logoShape: "wide" },
	{ name: "Lonehaven", href: "https://lonehaven.com/", logo: Lonehaven, logoShape: "landscape" },
	{ name: "CSE / CST", href: "https://www.cse-cst.gc.ca/", logo: CSE, logoShape: "compact" },
	{ name: "Red Bull", href: "https://redbull.com/", logo: Redbull, logoShape: "compact" },
	{ name: "P&G", href: "https://www.pg.ca/en-ca/", logo: PG, logoShape: "compact" },
	{ name: "Liquid I.V.", href: "https://www.liquid-iv.com/", logo: LiquidIV, logoShape: "landscape" },
	{ name: "Fantuan", href: "https://www.fantuan.ca/", logo: Fantuan, logoShape: "landscape" },
] as const;

function Sponsors() {
	return (
		<section id="sponsors" className={styles.section} aria-labelledby="landing-2026-sponsors-title">
			<div className={styles.sectionHeading} data-scroll-reveal="up" data-reveal-order="0">
				<p className={styles.eyebrow}>{t("landing2026.eyebrow")}</p>
				<h2 id="landing-2026-sponsors-title">{t("landing2026.sponsors.title")}</h2>
				<p>{t("landing2026.sponsors.introduction")}</p>
			</div>

			<div className={styles.sponsorGrid}>
				{sponsors.map((sponsor, index) => (
					<a
						className={styles.sponsorCard}
						href={sponsor.href}
						target="_blank"
						rel="noreferrer"
						key={sponsor.name}
						data-scroll-reveal="up"
						data-reveal-order={index}
					>
						<img
							className={styles.sponsorLogo}
							src={sponsor.logo}
							alt={`${sponsor.name} logo`}
							data-logo-shape={sponsor.logoShape}
						/>
					</a>
				))}
			</div>
		</section>
	);
}

export default Sponsors;
