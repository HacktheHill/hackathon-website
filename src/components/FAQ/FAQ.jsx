import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { useState } from "react";
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
		<div className={styles.container}>
			<div id="faq" className={styles.header}>
				{t("faq.title")}
			</div>
			{quesAns.map((item, i) => (
				<Accordion
					key={i}
					className={styles["question-container"]}
					sx={{
						backgroundColor: expandedList.includes(item.key) ? "var(--question-container-hover-color)" : "",
						justifyContent: "left",
						mb: "10px",
						mt: "10px",
						boxShadow: "none",
						borderRadius: "10px",
						"&:hover": {
							backgroundColor: "var(--question-container-hover-color)",
						},
						"&:before": {
							display: "none",
						},
					}}
				>
					<AccordionSummary
						expandIcon={<box-icon name="chevron-down"></box-icon>}
						className={styles.question}
						onClick={event => handleKeyList(event, item)}
						sx={{
							color: "var(--question-text-color)",
						}}
					>
						{item.q}
					</AccordionSummary>
					<AccordionDetails
						className={styles.answer}
						sx={{
							pt: 0,
						}}
					>
						<Typography align={"left"}>{item.a}</Typography>
					</AccordionDetails>
				</Accordion>
			))}
		</div>
	);
}
