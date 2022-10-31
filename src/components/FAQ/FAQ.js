import styles from "./FAQ.module.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import "boxicons";

export default function FAQ() {
  const quesAns = [
    { q: "question 1!", a: "answer to question 1!" },
    { q: "question 1!", a: "answer to q2!" },
  ];

  return (
    <div className={styles.faqContainer}>
      <div className={styles.faqHeader}>Frequently Asked Questions</div>
      {quesAns.map((i) => (
        <Accordion className={styles.questionContainer}>
          <AccordionSummary className={styles.question}>{i.q}</AccordionSummary>
          <AccordionDetails className={styles.answer}>
            <Typography align={"left"}>{i.a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
