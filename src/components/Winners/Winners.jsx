import React, { useEffect, useState } from "react";
import { t } from "../../i18n";
import styles from "./Winners.module.css";
import Button from "../Button/Button.jsx";

// animations
import AOS from "aos";
import "aos/dist/aos.css";

// Map of project names to their photo paths in public directory
const teamPhotos = {
	Pawgress: "/teams_photos/Pawgress_1st.webp",
	"Duo Move": "/teams_photos/Duo_Move_2nd.webp",
	"Timetable Sweetie": "/teams_photos/TimeTable_Sweetie_3rd.webp",
	PeerPressure: "/teams_photos/PeerPressure_3rd.webp",
	"Bouncing ROSS": "/teams_photos/Bouncing_Ross_2nd.webp",
	"Team 1": "/teams_photos/Geoguessr_1st.webp",
	"Team 2": "/teams_photos/Geoguessr_2nd.webp",
	"Team 3": "/teams_photos/Geoguessr_3rd.webp",
	"Scavenger Hunt": "/teams_photos/Scavenger_Hunt_Winners.webp",
	// French translations
	"Équipe 1": "/teams_photos/Geoguessr_1st.webp",
	"Équipe 2": "/teams_photos/Geoguessr_2nd.webp",
	"Équipe 3": "/teams_photos/Geoguessr_3rd.webp",
	"Chasse au Trésor": "/teams_photos/Scavenger_Hunt_Winners.webp",
	CapyCare: "/teams_photos/CapyCare_1st.webp",
	Stumble: "/teams_photos/Stumble_2nd.webp",
	BrainUp: "/teams_photos/BrainUp_1st.webp",
	Grype: "/teams_photos/Grype_2nd.webp",
	"The Heart Stopper": "/teams_photos/The_Heart_Stopper_1st.webp",
	InsuWell: "/teams_photos/InsuWell_2nd.webp",
	"snhack-rover": "/teams_photos/snhack-rover_1st.webp",
	AnyPen: "/teams_photos/AnyPen_1st.webp",
	"RelaxED AI": "/teams_photos/RelaxED_AI_2nd.webp",
	Mound: "/teams_photos/Mound_1st.webp",
	JustVent: "/teams_photos/JustVent_2nd.webp",
	"Distributed Encrypted Peer-to-Peer File Management Platform": "/teams_photos/Distributed_Encrypted_3rd.webp",
	"Ping Pong": "/teams_photos/Ping_Pong_3rd.webp",
	"Frame Out": "/teams_photos/Frame_Out_1st.webp",
};

// Map of project names to their DevPost URLs
const projectLinks = {
	Pawgress: "https://devpost.com/software/pawgress",
	"Duo Move": "https://devpost.com/software/duo-move",
	"Timetable Sweetie": "https://devpost.com/software/timetable-sweetie",
	PeerPressure: "https://devpost.com/software/peerpressure",
	"Bouncing ROSS": "https://devpost.com/software/bouncing-ross-back-to-simpler-times",
	Mound: "https://devpost.com/software/mound",
	"Distributed Encrypted Peer-to-Peer File Management Platform":
		"https://devpost.com/software/Distributed-Encrypted-Peer-to-Peer-File-Management-Platform",
	"Frame Out": "https://devpost.com/software/frame-out",
	"Ping Pong": "https://devpost.com/software/interactive-pong",
	CapyCare: "https://devpost.com/software/capycare",
	Stumble: "https://devpost.com/software/stumble-qpgf2o",
	BrainUp: "https://devpost.com/software/brainup",
	Grype: "https://devpost.com/software/grype",
	"The Heart Stopper": "https://devpost.com/software/the-heart-stopper",
	InsuWell: "https://devpost.com/software/insuwell",
	"snhack-rover": "https://devpost.com/software/snhack-rover",
	AnyPen: "https://devpost.com/software/anypen",
	"RelaxED AI": "https://devpost.com/software/relaxed-ai",
	JustVent: "https://devpost.com/software/justvent",
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
	const loadingText = t("winners.loading_text");

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
		general_challenge: t("winners.categories.general_challenge"),
		...Object.keys(sponsorChallenges).reduce((acc, key) => ({ ...acc, [key]: key }), {}),
		...Object.keys(miniChallenges).reduce((acc, key) => ({ ...acc, [key]: key }), {}),
	};

	if (loading) {
		return (
			<div className={styles.winners}>
				<img className={styles["left-leaves"]} src="/SVGs/Testimonials/left-leaves.svg" alt="left-leaves" />
				<div className={styles.titleContainer} data-aos="fade-up" data-aos-duration="800">
					<img
						className={styles["laurel-left"]}
						src="/SVGs/Winners/gold-laurel-left.svg"
						alt="gold laurel left"
					/>
					<h1>{title}</h1>
					<img
						className={styles["laurel-right"]}
						src="/SVGs/Winners/gold-laurel-right.svg"
						alt="gold laurel right"
					/>
				</div>
				<p className={styles.subtitle} data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
					{subtitle}
				</p>
				<div className={styles.loadingContainer}>
					<div className={styles.loadingSpinner}></div>
					<div className={styles.loadingText}>{loadingText}</div>
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
					<img
						className={styles["laurel-left"]}
						src="/SVGs/Winners/gold-laurel-left.svg"
						alt="gold laurel left"
					/>
					<h1>{title}</h1>
					<img
						className={styles["laurel-right"]}
						src="/SVGs/Winners/gold-laurel-right.svg"
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
				{currentWinners.map((winner, index) => {
					const projectUrl = projectLinks[winner.project] || "#";
					const isSpecialProject =
						winner.project === "Team 1" ||
						winner.project === "Team 2" ||
						winner.project === "Team 3" ||
						winner.project === "Équipe 1" ||
						winner.project === "Équipe 2" ||
						winner.project === "Équipe 3" ||
						winner.project === "Scavenger Hunt" ||
						winner.project === "Chasse au Trésor";

					// For Geoguessr and Scavenger Hunt cards, don't create a link
					const cardContent = (
						<div
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
										isSpecialProject ? styles.specialPhotoContainer : ""
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
					);

					// Conditionally wrap in link
					return isSpecialProject ? (
						<div key={index} className={styles.winnerCardContainer}>
							{cardContent}
						</div>
					) : (
						<a
							href={projectUrl}
							target="_blank"
							rel="noopener noreferrer"
							key={index}
							className={styles.winnerCardLink}
						>
							{cardContent}
						</a>
					);
				})}
			</div>
		);
	};

	return (
		<div id="winners" className={styles.winners}>
			<img className={styles["left-leaves"]} src="/SVGs/Testimonials/left-leaves.svg" alt="left-leaves" />

			<div className={styles.titleContainer} data-aos="fade-up" data-aos-duration="800">
				<img
					className={styles["laurel-left"]}
					src="/SVGs/Winners/gold-laurel-left.svg"
					alt="gold laurel left"
				/>
				<h1>{title}</h1>
				<img
					className={styles["laurel-right"]}
					src="/SVGs/Winners/gold-laurel-right.svg"
					alt="gold laurel right"
				/>
			</div>

			<p className={styles.subtitle} data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
				{subtitle}
			</p>

			<div className={styles.categories} data-aos="fade-up" data-aos-duration="800">
				{Object.entries(categories).map(([key, label]) => (
					<Button
						key={key}
						className={`${styles.categoryButton} ${activeCategory === key ? styles.active : ""}`}
						onClick={() => {
							setActiveCategory(key);
							// Refresh AOS animations when changing categories
							AOS.refresh();
						}}
					>
						{label}
					</Button>
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
