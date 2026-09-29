import { useTranslations } from "@/i18n";
import Button from "../Button/Button";
import styles from "./Highlights.module.css";

const WINNERS = [
	{
		placeKey: "first",
		project: "Dx – Simulated Patient Diagnosis Platform",
		href: "https://devpost.com/software/dx-patient-diagnosis-platform",
	},
	{
		placeKey: "second",
		project: "gymlens",
		href: "https://devpost.com/software/gymlens-rplve4",
	},
	{
		placeKey: "third",
		project: "Babbli",
		href: "https://devpost.com/software/babbli",
	},
] as const;

export default function Highlights() {
	const t = useTranslations();

	return (
		<section id="highlights" className={styles.highlights} aria-labelledby="highlights-title">
			<div className={styles.header}>
				<p className={styles.eyebrow}>{t("highlights.eyebrow")}</p>
				<h2 id="highlights-title" className="section-heading">
					{t("highlights.title")}
				</h2>
				<p className={styles.intro}>{t("highlights.intro")}</p>
			</div>

			<ol className={styles.projects}>
				{WINNERS.map(winner => (
					<li key={winner.project} className={styles.card}>
						<span className={styles.placement}>{t(`highlights.${winner.placeKey}`)}</span>
						<h3>{winner.project}</h3>
						<a href={winner.href} target="_blank" rel="noreferrer">
							{t("highlights.view_project")}
						</a>
					</li>
				))}
			</ol>

			<Button href="https://tracker.hackthehill.com/winners" target="_blank">
				{t("highlights.all_winners")}
			</Button>
		</section>
	);
}
