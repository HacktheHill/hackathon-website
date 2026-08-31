import { t } from "@/i18n";
import styles from "./FAQ.module.css";

const CODE_OF_CONDUCT_URL =
	"https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md";

export default function FAQ() {
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
		{
			q: t("faq.q5"),
			a: t("faq.a5"),
			key: "4",
		},
		{
			q: t("faq.q6"),
			a: t("faq.a6"),
			key: "5",
		},
		{
			q: t("faq.q7"),
			a: t("faq.a7"),
			key: "6",
		},
		{
			q: t("faq.q8"),
			a: t("faq.a8"),
			key: "7",
		},
		{
			q: t("faq.q9"),
			a: t("faq.a9"),
			key: "8",
		},
		{
			q: t("faq.q10"),
			a: t("faq.a10"),
			key: "9",
		},
		{
			q: t("faq.q11"),
			a: t("faq.a11"),
			key: "10",
		},
		{
			q: t("faq.q12"),
			a: (
				<>
					{t("faq.a12")}{" "}
					<a href={CODE_OF_CONDUCT_URL} target="_blank" rel="noreferrer">
						{t("faq.a12_link")}
					</a>
					.
				</>
			),
			key: "11",
		},
		{
			q: t("faq.q13"),
			a: (
				<>
					{t("faq.a13")}{" "}
					<a href={t("faq.a13_url")} target="_blank" rel="noreferrer">
						{t("faq.a13_link")}
					</a>
					.
				</>
			),
			key: "12",
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
