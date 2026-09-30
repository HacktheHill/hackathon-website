import { useTranslations } from "@/i18n";
import Button from "../Button/Button";
import styles from "./Highlights.module.css";

const WINNERS = [
	{
		challengeKey: "general",
		project: "Dx – Simulated Patient Diagnosis Platform",
		href: "https://devpost.com/software/dx-patient-diagnosis-platform",
	},
	{
		challengeKey: "civic",
		project: "VitaSpectra",
		href: "https://devpost.com/software/tempname-sfk4wn",
	},
	{
		challengeKey: "cgi",
		project: "NorthFlow",
		href: "https://devpost.com/software/northflow",
	},
] as const;

export default function Highlights() {
	const t = useTranslations();

	return (
		<section id="highlights" className={styles.highlights} aria-labelledby="highlights-title">
			<div className={styles.header}>
				<h2 id="highlights-title" className="section-heading">
					{t("highlights.title")}
				</h2>
			</div>

			<ul className={styles.projects}>
				{WINNERS.map(winner => (
					<li key={winner.project} className={styles.card}>
						<p className={styles.challenge}>{t(`highlights.${winner.challengeKey}`)}</p>
						<h3>{winner.project}</h3>
						<a href={winner.href} target="_blank" rel="noreferrer">
							{t("highlights.view_project")}
						</a>
					</li>
				))}
			</ul>

			<Button href="https://tracker.hackthehill.com/winners" target="_blank">
				{t("highlights.all_winners")}
			</Button>
		</section>
	);
}
