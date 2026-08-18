import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { useState } from "react";
import { t } from "@/i18n";
import styles from "./FAQ.module.css";

const CODE_OF_CONDUCT_URL =
	"https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md";

export default function FAQ() {
	const [expandedList, setExpandedList] = useState<string[]>([]);

	const handleKeyList = (key: string, expanded: boolean) => {
		setExpandedList(prev => (expanded ? [...prev, key] : prev.filter(itemKey => itemKey !== key)));
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
	];
	const renderAccordions = (items: typeof quesAns) =>
		items.map(item => {
			const expanded = expandedList.includes(item.key);

			return (
				<Accordion
					key={item.key}
					className={styles["question-container"]}
					expanded={expanded}
					onChange={(_, isExpanded) => handleKeyList(item.key, isExpanded)}
					sx={{
						justifyContent: "left",
						backgroundColor: "transparent",
						backgroundImage: "none",
						mb: "10px",
						mt: "10px",
						boxShadow: "none",
						"&:before": {
							display: "none",
						},
					}}
				>
					<AccordionSummary
						className={styles.question}
						sx={{
							color: "var(--text-color)",
							"&:hover": {
								color: "var(--question-container-hover-color)",
							},
						}}
					>
						<svg
							aria-hidden="true"
							focusable="false"
							style={{ marginRight: "0.5rem" }}
							stroke="currentColor"
							fill="var(--text-color)"
							strokeWidth="0"
							viewBox="0 0 1024 1024"
							height="1em"
							width="1em"
							xmlns="http://www.w3.org/2000/svg"
						>
							{expanded ? (
								<path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
							) : (
								<>
									<path d="M474 152m8 0l60 0q8 0 8 8l0 704q0 8-8 8l-60 0q-8 0-8-8l0-704q0-8 8-8Z"></path>
									<path d="M168 474m8 0l672 0q8 0 8 8l0 60q0 8-8 8l-672 0q-8 0-8-8l0-60q0-8 8-8Z"></path>
								</>
							)}
						</svg>
						{item.q}
					</AccordionSummary>

					<AccordionDetails
						className={styles.answer}
						sx={{
							marginLeft: "1.5rem",
							pt: 0,
						}}
					>
						<Typography align="left">{item.a}</Typography>
					</AccordionDetails>
				</Accordion>
			);
		});

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
