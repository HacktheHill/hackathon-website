import { useState } from "react";
import { t } from "../../i18n";
import styles from "./FAQ.module.css";

export default function FAQ() {
	const [expandedList, setExpandedList] = useState([]);

	const handleKeyList = item => {
		const key = item.key;
		if (expandedList.includes(key)) {
			setExpandedList(prevList => prevList.filter(k => k !== key));
		} else {
			setExpandedList(prevList => [...prevList, key]);
		}
	};

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
	];
	return (
		<div className={styles.container}>
			<div id="faq" className={styles.header}>
				{t("faq.title")}
			</div>
			{quesAns.map(item => (
				<div
					key={item.key}
					className={`${styles["question-container"]} ${styles.itemSpacing} ${
						expandedList.includes(item.key) ? styles["faq"] : ""
					}`}
				>
					<div className={`${styles["question-and-answer"]} `} onClick={() => handleKeyList(item)}>
						<div
							className={`${styles.plusminus} ${expandedList.includes(item.key) ? styles.active : ""}`}
						></div>
						<div
							className={`${styles.question} ${
								expandedList.includes(item.key)
									? styles["question-with-clicked-margins"]
									: styles["question-with-margins"]
							}`}
						>
							{item.q}
						</div>
						{expandedList.includes(item.key) && (
							<div
								className={`${styles.answer} ${styles.answerOpen} ${
									expandedList.includes(item.key) ? styles["answer-margins"] : ""
								}`}
							>
								{item.a}
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
