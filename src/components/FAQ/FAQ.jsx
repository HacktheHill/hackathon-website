import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { useState } from "react";
import faq from "../../assets/faq-leaves.svg?raw";
import { t } from "../../i18n";
import styles from "./FAQ.module.css";

export default function FAQ() {
	const [expandedList, setExpandedList] = useState([]);

	const handleKeyList = (event, e) => {
		if (expandedList.includes(e.key)) {
			setExpandedList(prev => prev.filter(keys => keys !== e.key));
		} else {
			setExpandedList(arr => [...arr, `${e.key}`]);
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
		<div id="faq" className={styles.container}>
			<div className={styles.header}>
				<h1>{t("faq.title")}</h1>
				<div
					className={styles["faq-img"]}
					dangerouslySetInnerHTML={{
						__html: faq,
					}}
				></div>
			</div>
			<div className={styles["faq-columns"]}>
				<div className={styles.column}>
					{quesAns.slice(0, Math.ceil(quesAns.length / 2)).map((item, i) => (
						<Accordion
							key={i}
							className={styles["question-container"]}
							sx={{
								backgroundColor: expandedList.includes(item.key) ? "transparent" : "transparent",
								justifyContent: "left",
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
								onClick={event => handleKeyList(event, item)}
								sx={{
									color: "var(--text-color)",
									"&:hover": {
										color: "var(--question-container-hover-color)",
									},
								}}
							>
								{expandedList.includes(item.key) ? (
									<svg
										style={{ marginRight: "0.5rem" }}
										stroke="currentColor"
										fill="var(--text-color)"
										strokeWidth="0"
										viewBox="0 0 1024 1024"
										height="1em"
										width="1em"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
									</svg>
								) : (
									<svg
										style={{ marginRight: "0.5rem" }}
										stroke="currentColor"
										fill="var(--text-color)"
										strokeWidth="0"
										t="1551322312294"
										viewBox="0 0 1024 1024"
										version="1.1"
										height="1em"
										width="1em"
										xmlns="http://www.w3.org/2000/svg"
									>
										<defs></defs>
										<path d="M474 152m8 0l60 0q8 0 8 8l0 704q0 8-8 8l-60 0q-8 0-8-8l0-704q0-8 8-8Z"></path>
										<path d="M168 474m8 0l672 0q8 0 8 8l0 60q0 8-8 8l-672 0q-8 0-8-8l0-60q0-8 8-8Z"></path>
									</svg>
								)}
								{item.q}
							</AccordionSummary>

							<AccordionDetails
								className={styles.answer}
								sx={{
									marginLeft: "1.5rem",
									pt: 0,
								}}
							>
								<Typography align={"left"}>{item.a}</Typography>
							</AccordionDetails>
						</Accordion>
					))}
				</div>
				<div className={styles.column}>
					{quesAns.slice(Math.ceil(quesAns.length / 2)).map((item, i) => (
						<Accordion
							key={i}
							className={styles["question-container"]}
							sx={{
								backgroundColor: expandedList.includes(item.key) ? "transparent" : "transparent",
								justifyContent: "left",
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
								onClick={event => handleKeyList(event, item)}
								sx={{
									color: "var(--text-color)",
									"&:hover": {
										color: "var(--question-container-hover-color)",
									},
								}}
							>
								{expandedList.includes(item.key) ? (
									<svg
										style={{ marginRight: "0.5rem" }}
										stroke="currentColor"
										fill="var(--text-color)"
										strokeWidth="0"
										viewBox="0 0 1024 1024"
										height="1em"
										width="1em"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
									</svg>
								) : (
									<svg
										style={{ marginRight: "0.5rem" }}
										stroke="currentColor"
										fill="var(--text-color)"
										strokeWidth="0"
										t="1551322312294"
										viewBox="0 0 1024 1024"
										version="1.1"
										height="1em"
										width="1em"
										xmlns="http://www.w3.org/2000/svg"
									>
										<defs></defs>
										<path d="M474 152m8 0l60 0q8 0 8 8l0 704q0 8-8 8l-60 0q-8 0-8-8l0-704q0-8 8-8Z"></path>
										<path d="M168 474m8 0l672 0q8 0 8 8l0 60q0 8-8 8l-672 0q-8 0-8-8l0-60q0-8 8-8Z"></path>
									</svg>
								)}
								{item.q}
							</AccordionSummary>

							<AccordionDetails
								className={styles.answer}
								sx={{
									marginLeft: "1.5rem",
									pt: 0,
								}}
							>
								<Typography align={"left"}>{item.a}</Typography>
							</AccordionDetails>
						</Accordion>
					))}
				</div>
			</div>
		</div>
	);
}
