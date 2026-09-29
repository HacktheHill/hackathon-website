import { useTranslations } from "@/i18n";
import styles from "./FAQ.module.css";

export default function FAQ() {
	const t = useTranslations();
	const quesAns = [
		{
			q: t("faq.q1"),
			a: t("faq.a1"),
			key: "0",
		},
		{
			q: t("faq.q2"),
			a: t("faq.a2"),
			key: "1",
		},
		{
			q: t("faq.q3"),
			a: t("faq.a3"),
			key: "2",
		},
		{
			q: t("faq.q4"),
			a: t("faq.a4"),
			key: "3",
		},
	];
	const renderAccordions = (items: typeof quesAns) =>
		items.map(item => (
			<details key={item.key} className={styles["question-container"]}>
				<summary className={styles.question}>{item.q}</summary>
				<div className={styles.answer}>{item.a}</div>
			</details>
		));

	return (
		<section id="faq" className={styles.container} aria-labelledby="faq-title">
			<div className={styles.header}>
				<h2 id="faq-title" className="section-heading" data-aos="fade-right" data-aos-duration="800">
					{t("faq.title")}
				</h2>
			</div>
			<div className={styles["faq-columns"]}>
				<div className={styles.column} data-aos="fade-right" data-aos-duration="800">
					{renderAccordions(quesAns.slice(0, Math.ceil(quesAns.length / 2)))}
				</div>
				<div className={styles.column} data-aos="fade-right" data-aos-duration="800">
					{renderAccordions(quesAns.slice(Math.ceil(quesAns.length / 2)))}
				</div>
			</div>
		</section>
	);
}
