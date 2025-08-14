import React, { useEffect, useMemo, useState, useCallback } from "react";
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
	InsuWell: "/teams_photos/insuWell_2nd.webp",
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
	PeerPressure: "https://devpost.com/software/peer-pressure-l1eha7",
	"Bouncing ROSS": "https://devpost.com/software/bouncing-ross-back-to-simpler-times",
	Mound: "https://devpost.com/software/mound",
	"Distributed Encrypted Peer-to-Peer File Management Platform":
		"https://devpost.com/software/Distributed-Encrypted-Peer-to-Peer-File-Management-Platform",
	"Distributed Encrypted": "https://devpost.com/software/Distributed-Encrypted-Peer-to-Peer-File-Management-Platform",
	"Frame Out": "https://devpost.com/software/frame-out",
	"Ping Pong": "https://devpost.com/software/interactive-pong",
	CapyCare: "https://devpost.com/software/capycare-odeah6",
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
	const [error] = useState(null);
	const [activeCategory, setActiveCategory] = useState("general_challenge");
	const [currentIndex, setCurrentIndex] = useState(0);

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
	}, []);

	// Reset to general_challenge when language changes (detected by title changing)
	useEffect(() => {
		setActiveCategory("general_challenge");
		setCurrentIndex(0);
	}, [title]);

	// Calculate categories
	const categories = {
		general_challenge: t("winners.categories.general_challenge"),
		...Object.keys(sponsorChallenges).reduce((acc, key) => ({ ...acc, [key]: key }), {}),
		...Object.keys(miniChallenges).reduce((acc, key) => ({ ...acc, [key]: key }), {}),
	};

	// Build current winners list based on active category
	const currentWinners = useMemo(() => {
		if (activeCategory === "general_challenge") return Array.isArray(generalChallenge) ? generalChallenge : [];
		const isSponsor = Object.keys(sponsorChallenges).includes(activeCategory);
		const list = isSponsor ? sponsorChallenges[activeCategory] : miniChallenges[activeCategory];
		return Array.isArray(list) ? list : [];
	}, [activeCategory, generalChallenge, sponsorChallenges, miniChallenges]);

	// Ensure index stays valid when category changes
	useEffect(() => {
		setCurrentIndex(0);
		AOS.refreshHard();
	}, [activeCategory]);

	const isSpecialProject = useCallback((project) => {
		return (
			project === "Team 1" ||
			project === "Team 2" ||
			project === "Team 3" ||
			project === "Équipe 1" ||
			project === "Équipe 2" ||
			project === "Équipe 3" ||
			project === "Scavenger Hunt" ||
			project === "Chasse au Trésor"
		);
	}, []);

	const goPrev = useCallback(() => {
		if (!currentWinners.length) return;
		setCurrentIndex((i) => (i - 1 + currentWinners.length) % currentWinners.length);
	}, [currentWinners.length]);

	const goNext = useCallback(() => {
		if (!currentWinners.length) return;
		setCurrentIndex((i) => (i + 1) % currentWinners.length);
	}, [currentWinners.length]);

	const keyHandler = useCallback(
		(e) => {
			if (e.key === "ArrowLeft") goPrev();
			if (e.key === "ArrowRight") goNext();
		},
		[goPrev, goNext]
	);

	useEffect(() => {
		window.addEventListener("keydown", keyHandler);
		return () => window.removeEventListener("keydown", keyHandler);
	}, [keyHandler]);

	if (error) {
		return (
			<div className={styles.winners}>
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

	const renderCard = () => {
		if (!currentWinners || !currentWinners.length)
			return <div className={styles.noWinners}>No winners data available for this category.</div>;

		const winner = currentWinners[currentIndex];
		const projectUrl = projectLinks[winner.project] || "#";
		const special = isSpecialProject(winner.project);
		const imageSrc = teamPhotos[winner.project];
		const imgAlt =
			winner.project === "Team 1" || winner.project === "Équipe 1"
				? "Team 1 photo"
				: winner.project === "Team 2" || winner.project === "Équipe 2"
				? "Team 2 photo"
				: winner.project === "Team 3" || winner.project === "Équipe 3"
				? "Team 3 photo"
				: winner.project === "Scavenger Hunt" || winner.project === "Chasse au Trésor"
				? "Scavenger Hunt team photo"
				: `${winner.project} team`;

		const CardInner = (
			<div className={styles.card} data-aos="zoom-in" data-aos-duration="700">
				{imageSrc && (
					<div className={styles.cardImageWrap}>
						<img className={styles.cardImage} src={imageSrc} alt={imgAlt} loading="lazy" />
					</div>
				)}
				<div className={styles.cardBody}>
					<div className={styles.placementBadge}>{winner.place}</div>
					<h3 className={styles.cardTitle}>{winner.project}</h3>
					{winner.team && (
						<p className={styles.cardTeam}>
							{winner.team.map((m, i) => (
								<span key={i}>
									{m}
									{i < winner.team.length - 1 ? ", " : ""}
								</span>
							))}
						</p>
					)}
				</div>
			</div>
		);

		return special ? (
			<div className={styles.cardWrap}>{CardInner}</div>
		) : (
			<a href={projectUrl} target="_blank" rel="noopener noreferrer" className={styles.cardWrap}>
				{CardInner}
			</a>
		);
	};

	return (
		<div id="winners" className={styles.winners}>
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
							setCurrentIndex(0);
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

				<div className={styles.carousel} aria-live="polite">
					<button className={`${styles.navButton} ${styles.navLeft}`} aria-label="Previous" onClick={goPrev}>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</button>

					{renderCard()}

					<button className={`${styles.navButton} ${styles.navRight}`} aria-label="Next" onClick={goNext}>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</button>
				</div>

				{currentWinners && currentWinners.length > 0 && (
					<div className={styles.counter}>
						<span>
							{currentIndex + 1} / {currentWinners.length}
						</span>
					</div>
				)}
			</div>
			<img className={styles["right-leaves"]} src="/SVGs/Testimonials/right-leaves.svg" alt="right-leaves" />
		</div>
	);
}

export default Winners;
