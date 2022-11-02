import styles from "./FAQ.module.css";
import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import "boxicons";

export default function FAQ() {
  const [expandedList, setExpandedList] = useState([]);

  const quesAns = [
    {
      q: "What is a hackathon?",
      a: "A hackathon is a 36-hour event where people design and build a project from scratch.",
      key: "0",
    },
    {
      q: "How much does it cost to participate?",
      a: "It's free, there is no cost to participate! We cover the cost of food at the event and have free buses to transport participants from the GTA to Ottawa.",
      key: "1",
    },
    {
      q: "Do I need any experience?",
      a: "No experience is needed! There will be workshops to teach you everything you need to know to hack at Hack the Hill.",
      key: "2",
    },
    {
      q: "This is my first hackathon, what should I expect?",
      a: "36 hours of networking with our sponsors, learning, and collaborating with other hackers. As a first-time hacker, you can participate in our first-time hacker competition for a more structured learning experience.",
      key: "3",
    },
    {
      q: "Can I start on the project before the hackathon?",
      a: "No, all projects must be started after open ceremonies on February 3rd. No code should be written for the project prior to the hackathon, however, you can start thinking about potential hackathon ideas once the themes have been released.",
      key: "4",
    },
    {
      q: "Is the hackathon online or in-person?",
      a: "Both online and in-person, we're hybrid this year!",
      key: "5",
    },
    {
      q: "What should I bring to an in-person hackathon?",
      a: "Personal hygiene items (deodorant, toothbrush, etc), sleeping bag, laptop charger, and anything else you might need to stay at the venue for 36 hours. We will provide snacks and food for the entire event!",
      key: "6",
    },
    {
      q: "How much RedBull should I drink in a day?",
      a: "Yes.",
      key: "7",
    },
    {
      q: "Who can participate and how do I apply?",
      a: "Any current university student or recent graduate can join! Applications will be open insert_date",
      key: "8",
    },
    {
      q: "Can I work in a team?",
      a: "Yes, teams of up to 4 can work together at Hack the Hill.",
      key: "9",
    },
    {
      q: "What are the themes for Hack the Hill?",
      a: "Full details about the hackathon themes will not be released until insert_date. But here's a sneak peek about what they might involve: game development, hardware/embedded development, and web development!",
      key: "10",
    },
  ];

  const handleKeyList = (event, e) => {
    if (expandedList.includes(e.key)) {
      setExpandedList((prev) => prev.filter((keys) => keys !== e.key));
    } else {
      setExpandedList((arr) => [...arr, `${e.key}`]);
    }
  };

  return (
    <div className={styles.faqContainer}>
      <div className={styles.faqHeader}>Frequently Asked Questions</div>
      {quesAns.map((i) => (
        <Accordion
          className={styles.questionContainer}
          sx={{
            backgroundColor: expandedList.includes(i.key)
              ? "#eaeaea"
              : "#f7f7f7",
            justifyContent: "left",
            mb: "10px",
            mt: "10px",
            boxShadow: "none",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#eaeaea",
            },
            "&:before": {
              display: "none",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<box-icon name="chevron-down"></box-icon>}
            className={styles.question}
            onClick={(event) => handleKeyList(event, i)}
            sx={{
              color: "#3B4779",
            }}
          >
            {i.q}
          </AccordionSummary>
          <AccordionDetails
            className={styles.answer}
            sx={{
              color: "#5C71AD",
              backgroundColor: "#eaeaea",
              pt: 0,
            }}
          >
            <Typography align={"left"}>{i.a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
