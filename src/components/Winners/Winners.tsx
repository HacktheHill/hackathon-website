import { useTranslations } from "@/i18n";
import Button from "../Button/Button";
import styles from "./Winners.module.css";

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

export default function Winners() {
	const t = useTranslations();

	return (
		<section id="winners" className={styles.winners} aria-labelledby="winners-title">
			<div className={styles.header}>
				<h2 id="winners-title" className="section-heading">
					{t("winners.title")}
				</h2>
			</div>

			<ul className={styles.projects}>
				{WINNERS.map(winner => (
					<li key={winner.project} className={styles.card}>
						<p className={styles.challenge}>{t(`winners.${winner.challengeKey}`)}</p>
						<h3>{winner.project}</h3>
						<a href={winner.href} target="_blank" rel="noreferrer">
							{t("winners.view_project")}
						</a>
					</li>
				))}
			</ul>

			<Button href="https://tracker.hackthehill.com/winners" target="_blank">
				{t("winners.all_winners")}
			</Button>
		</section>
	);
}
