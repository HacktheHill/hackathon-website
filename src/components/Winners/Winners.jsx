import React, { useEffect, useState } from "react";
import { t } from "../../i18n";
import styles from "./Winners.module.css";

// animations
import AOS from "aos";
import "aos/dist/aos.css";

// Map of project names to their photo paths in public directory
const teamPhotos = {
	Pawgress: "/teams_photos/Pawgress_1st.png",
	"Duo Move": "/teams_photos/Duo_Move_2nd.png",
	"Timetable Sweetie": "/teams_photos/TimeTable_Sweetie_3rd.png",
	PeerPressure: "/teams_photos/PeerPressure_3rd.png",
	"Bouncing ROSS": "/teams_photos/Bouncing_Ross_2nd.jpeg",
	"Team 1": "/teams_photos/Geoguessr_1st.png",
	"Team 2": "/teams_photos/Geoguessr_2nd.png",
	"Team 3": "/teams_photos/Geoguessr_3rd.png",
	"Scavenger Hunt": "/teams_photos/Scavenger_Hunt_Winners.png",
	// French translations
	"Équipe 1": "/teams_photos/Geoguessr_1st.png",
	"Équipe 2": "/teams_photos/Geoguessr_2nd.png",
	"Équipe 3": "/teams_photos/Geoguessr_3rd.png",
	"Chasse au Trésor": "/teams_photos/Scavenger_Hunt_Winners.png",
};

function Winners() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeCategory, setActiveCategory] = useState("general_challenge");

	// Get translations directly in the render function
	const title = t("winners.title");
	const subtitle = t("winners.subtitle");
	const generalChallenge = t("winners.general_challenge") || [];
	const sponsorChallenges = t("winners.sponsor_challenges") || {};
	const miniChallenges = t("winners.mini_challenges") || {};

	useEffect(() => {
		AOS.init({
			duration: 800,
			once: true,
			offset: 100,
		});

		// Simulate loading for better UX
		setTimeout(() => {
			setLoading(false);
		}, 800);
	}, []);

	// Reset to general_challenge when language changes (detected by title changing)
	useEffect(() => {
		setActiveCategory("general_challenge");
	}, [title]);

	// Calculate categories
	const categories = {
		general_challenge: "General Challenge",
		...Object.keys(sponsorChallenges).reduce((acc, key) => ({ ...acc, [key]: key }), {}),
		...Object.keys(miniChallenges).reduce((acc, key) => ({ ...acc, [key]: key }), {}),
	};

	if (loading) {
		return (
			<div className={styles.winners}>
				<img className={styles["left-leaves"]} src="/SVGs/Testimonials/left-leaves.svg" alt="left-leaves" />
				<div className={styles.titleContainer} data-aos="fade-up" data-aos-duration="800">
					<img className={styles["laurel-left"]} src="/assets/gold-laurel-left.svg" alt="gold laurel left" />
					<h1>{title}</h1>
					<img
						className={styles["laurel-right"]}
						src="/assets/gold-laurel-right.svg"
						alt="gold laurel right"
					/>
				</div>
				<p className={styles.subtitle} data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
					{subtitle}
				</p>
				<div className={styles.loadingContainer}>
					<div className={styles.loadingSpinner}></div>
					<div className={styles.loadingText}>Loading winners data...</div>
				</div>
				<img className={styles["right-leaves"]} src="/SVGs/Testimonials/right-leaves.svg" alt="right-leaves" />
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.winners}>
				<img className={styles["left-leaves"]} src="/SVGs/Testimonials/left-leaves.svg" alt="left-leaves" />
				<div className={styles.titleContainer} data-aos="fade-up" data-aos-duration="800">
					<img className={styles["laurel-left"]} src="/assets/gold-laurel-left.svg" alt="gold laurel left" />
					<h1>{title}</h1>
					<img
						className={styles["laurel-right"]}
						src="/assets/gold-laurel-right.svg"
						alt="gold laurel right"
					/>
				</div>
				<p className={styles.subtitle} data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
					{subtitle}
				</p>
				<div className={styles.error}>Error loading winners: {error}</div>
				<img className={styles["right-leaves"]} src="/SVGs/Testimonials/right-leaves.svg" alt="right-leaves" />
			</div>
		);
	}

	const renderWinners = () => {
		let currentWinners = [];

		if (activeCategory === "general_challenge") {
			currentWinners = generalChallenge;
		} else {
			// Check if it's a sponsor challenge or mini challenge
			const isSponsorChallenge = Object.keys(sponsorChallenges).includes(activeCategory);
			currentWinners = isSponsorChallenge
				? sponsorChallenges[activeCategory] || []
				: miniChallenges[activeCategory] || [];
		}

		// If currentWinners is undefined or not an array, return a message
		if (!currentWinners || !Array.isArray(currentWinners)) {
			return <div className={styles.noWinners}>No winners data available for this category.</div>;
		}

		return (
			<div className={styles.winnersList}>
				{currentWinners.map((winner, index) => (
					<div
						key={index}
						className={styles.winnerCard}
						data-aos="fade-up"
						data-aos-duration="800"
						data-aos-delay={100 * index}
					>
						<div className={styles.placement}>{winner.place}</div>
						<h3 className={styles.projectName}>{winner.project}</h3>
						<div className={styles.teamMembers}>
							{winner.team &&
								winner.team.map((member, i) => (
									<span key={i}>
										{member}
										{i < winner.team.length - 1 ? ", " : ""}
									</span>
								))}
						</div>
						{teamPhotos[winner.project] && (
							<div
								className={`${styles.teamPhotoContainer} ${
									winner.project === "Team 1" ||
									winner.project === "Team 2" ||
									winner.project === "Team 3" ||
									winner.project === "Équipe 1" ||
									winner.project === "Équipe 2" ||
									winner.project === "Équipe 3" ||
									winner.project === "Scavenger Hunt" ||
									winner.project === "Chasse au Trésor"
										? styles.specialPhotoContainer
										: ""
								}`}
							>
								<img
									src={teamPhotos[winner.project]}
									alt={
										winner.project === "Team 1" || winner.project === "Équipe 1"
											? "Team 1 photo"
											: winner.project === "Team 2" || winner.project === "Équipe 2"
											? "Team 2 photo"
											: winner.project === "Team 3" || winner.project === "Équipe 3"
											? "Team 3 photo"
											: winner.project === "Scavenger Hunt" ||
											  winner.project === "Chasse au Trésor"
											? "Scavenger Hunt team photo"
											: `${winner.project} team`
									}
									className={styles.teamPhoto}
									loading="lazy"
								/>
							</div>
						)}
					</div>
				))}
			</div>
		);
	};

	return (
		<div id="winners" className={styles.winners}>
			<img className={styles["left-leaves"]} src="/SVGs/Testimonials/left-leaves.svg" alt="left-leaves" />

			<div className={styles.titleContainer} data-aos="fade-up" data-aos-duration="800">
				<img className={styles["laurel-left"]} src="/assets/gold-laurel-left.svg" alt="gold laurel left" />
				<h1>{title}</h1>
				<img className={styles["laurel-right"]} src="/assets/gold-laurel-right.svg" alt="gold laurel right" />
			</div>

			<p className={styles.subtitle} data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
				{subtitle}
			</p>

			<div className={styles.categories} data-aos="fade-up" data-aos-duration="800">
				{Object.entries(categories).map(([key, label]) => (
					<button
						key={key}
						className={`${styles.categoryButton} ${activeCategory === key ? styles.active : ""}`}
						onClick={() => {
							setActiveCategory(key);
							// Refresh AOS animations when changing categories
							AOS.refresh();
						}}
					>
						{label}
					</button>
				))}
			</div>

			<div className={styles.winnersSection}>
				<h3 className={styles.categoryTitle} data-aos="fade-up" data-aos-duration="800">
					{categories[activeCategory]}
				</h3>
				{renderWinners()}
			</div>
			<img className={styles["right-leaves"]} src="/SVGs/Testimonials/right-leaves.svg" alt="right-leaves" />
		</div>
	);
}

export default Winners;
