import { t } from "@/i18n";
import styles from "./Stats.module.css";

function BlueSign({ mobileVideo = false }: { mobileVideo?: boolean }) {
	return (
		<div
			className={`${styles.sign} ${styles.blue}${mobileVideo ? ` ${styles["mobile-video-sign"]}` : ""}`}
			data-stat-sign="blue"
		>
			<img
				src="/art/scene/stats-sign-blue.webp"
				alt=""
				aria-hidden="true"
				width="1031"
				height="1077"
				loading="lazy"
				decoding="async"
			/>
			<div className={`${styles.copy} ${styles["blue-copy"]}`}>
				<div className={styles["blue-row"]}>
					<strong>{t("stats.p1")}</strong>
					<span>{t("stats.p1tag")}</span>
				</div>
				<div className={styles["blue-row"]}>
					<strong>{t("stats.p2")}</strong>
					<span>{t("stats.p2tag")}</span>
				</div>
			</div>
		</div>
	);
}

export function MobileVideoSign() {
	return <BlueSign mobileVideo />;
}

export function MobileStatsIntro() {
	return (
		<div className={styles["mobile-stats-intro"]}>
			<h2 className={styles["mobile-stats-title"]}>{t("stats.title")}</h2>
			<MobileVideoSign />
		</div>
	);
}

function Stats() {
	return (
		<section
			className={styles.stats}
			id="stats"
			aria-label={t("stats.title")}
		>
			<h2 id="stats-title" className={styles.title}>
				{t("stats.title")}
			</h2>

			<div className={styles.signs}>
				<div className={styles["sign-stage"]}>
					<BlueSign />
				</div>

				<div className={styles["sign-stage"]}>
					<div className={`${styles.sign} ${styles.organizers}`} data-stat-sign="organizers">
						<img
							src="/art/scene/stats-sign-organizers.webp"
							alt=""
							aria-hidden="true"
							width="372"
							height="835"
							loading="lazy"
							decoding="async"
						/>
						<div className={`${styles.copy} ${styles["organizers-copy"]}`}>
							<strong>{t("stats.p5")}</strong>
							<span>{t("stats.p5tag")}</span>
						</div>
					</div>
				</div>

				<div className={styles["sign-stage"]}>
					<div className={`${styles.sign} ${styles.green}`} data-stat-sign="green">
						<img
							src="/art/scene/stats-sign-green.webp"
							alt=""
							aria-hidden="true"
							width="918"
							height="961"
							loading="lazy"
							decoding="async"
						/>
						<div
							className={`${styles.copy} ${styles["green-copy"]} ${styles["desktop-green-copy"]}`}
						>
							<div className={styles["green-top"]}>
								<strong>{t("stats.p3")}</strong>
								<span>{t("stats.p3tag")}</span>
							</div>
							<div className={styles["green-bottom"]}>
								<strong>{t("stats.p4")}</strong>
								<span>{t("stats.p4tag")}</span>
							</div>
						</div>
						<div
							className={`${styles.copy} ${styles["green-copy"]} ${styles["mobile-green-copy"]}`}
							data-mobile-green-copy
						>
							<div className={styles["green-top"]}>
								<strong>{t("stats.p3")}</strong>
								<span>{t("stats.p3tag")}</span>
							</div>
							<div className={`${styles["green-bottom"]} ${styles["mobile-green-details"]}`}>
								<div className={styles["mobile-green-row"]}>
									<strong>{t("stats.p4")}</strong>
									<span>{t("stats.p4tag")}</span>
								</div>
								<div className={styles["mobile-green-row"]}>
									<strong>{t("stats.p5")}</strong>
									<span>{t("stats.p5tag")}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
export default Stats;
