import { t } from "@/i18n";
import styles from "./Landing2026.module.css";

function FAQ() {
	const items = t("landing2026.faq.items");

	return (
		<section id="faq" className={styles.section} aria-labelledby="landing-2026-faq-title">
			<div className={styles.sectionHeading} data-scroll-reveal="up" data-reveal-order="0">
				<p className={styles.eyebrow}>{t("landing2026.eyebrow")}</p>
				<h2 id="landing-2026-faq-title">{t("landing2026.faq.title")}</h2>
			</div>

			<div className={styles.faqList}>
				{items.map((item, index) => (
					<details
						className={styles.faqItem}
						key={item.question}
						data-scroll-reveal="up"
						data-reveal-order={index}
					>
						<summary>{item.question}</summary>
						<p>{item.answer}</p>
					</details>
				))}
			</div>
		</section>
	);
}

export default FAQ;
