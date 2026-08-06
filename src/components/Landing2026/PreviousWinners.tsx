import { type KeyboardEvent, useRef, useState } from "react";
import { t } from "@/i18n";
import styles from "./Landing2026.module.css";

function PreviousWinners() {
	const categories = t("landing2026.winners.categories");
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0].id);
	const categoryButtons = useRef<Array<HTMLButtonElement | null>>([]);
	const selectedCategory = categories.find(category => category.id === selectedCategoryId) ?? categories[0];

	const selectCategoryFromKeyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
		let nextIndex: number | undefined;

		switch (event.key) {
			case "ArrowRight":
			case "ArrowDown":
				nextIndex = (index + 1) % categories.length;
				break;
			case "ArrowLeft":
			case "ArrowUp":
				nextIndex = (index - 1 + categories.length) % categories.length;
				break;
			case "Home":
				nextIndex = 0;
				break;
			case "End":
				nextIndex = categories.length - 1;
				break;
			default:
				return;
		}

		event.preventDefault();
		const nextCategory = categories[nextIndex];
		setSelectedCategoryId(nextCategory.id);
		categoryButtons.current[nextIndex]?.focus();
	};

	return (
		<section id="winners" className={styles.section} aria-labelledby="landing-2026-winners-title">
			<div className={styles.sectionHeading} data-scroll-reveal="up" data-reveal-order="0">
				<p className={styles.eyebrow}>{t("landing2026.eyebrow")}</p>
				<h2 id="landing-2026-winners-title">{t("landing2026.winners.title")}</h2>
				<p>{t("landing2026.winners.introduction")}</p>
			</div>

			<div
				className={styles.categoryTabs}
				role="tablist"
				aria-label={t("landing2026.winners.categoryLabel")}
				data-scroll-reveal="up"
				data-reveal-order="1"
			>
				{categories.map((category, index) => {
					const isSelected = category.id === selectedCategory.id;

					return (
						<button
							key={category.id}
							ref={button => {
								categoryButtons.current[index] = button;
							}}
							id={`winner-category-${category.id}`}
							className={styles.categoryButton}
							type="button"
							role="tab"
							aria-selected={isSelected}
							aria-controls={`winner-panel-${category.id}`}
							tabIndex={isSelected ? 0 : -1}
							data-selected={isSelected}
							onClick={() => setSelectedCategoryId(category.id)}
							onKeyDown={event => selectCategoryFromKeyboard(event, index)}
						>
							{category.label}
						</button>
					);
				})}
			</div>

			<div className={styles.winnerPanels} data-scroll-reveal="up" data-reveal-order="2">
				{categories.map(category => {
					const isSelected = category.id === selectedCategory.id;

					return (
						<div
							key={category.id}
							id={`winner-panel-${category.id}`}
							className={styles.winnerGrid}
							role="tabpanel"
							aria-labelledby={`winner-category-${category.id}`}
							tabIndex={isSelected ? 0 : -1}
							hidden={!isSelected}
						>
							{category.entries.map(entry => (
								<article className={styles.winnerCard} key={`${entry.place}-${entry.project}`}>
									<p className={styles.place}>{entry.place}</p>
									<h3>{entry.project}</h3>
									<p>{entry.team}</p>
								</article>
							))}
						</div>
					);
				})}
			</div>
		</section>
	);
}

export default PreviousWinners;
