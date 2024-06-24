import React, { useEffect } from "react";
import styles from "./ProjectGallery.module.css";
import Button from "../Button/Button.jsx";

// animations
import AOS from "aos";
import "aos/dist/aos.css";

const projects = [
	{
		id: "ColourSense",
		href: "https://devpost.com/software/colour-sense",
		imgSrc: "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/408/913/datas/gallery.jpg",
		altText: "ColourSense Banner",
		delay: 200,
	},
	{
		id: "oiligarchy",
		href: "https://devpost.com/software/oiligarchy-the-game-about-how-profit-turns-to-pain",
		imgSrc: "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/408/722/datas/original.png",
		altText: "oiligarchy Banner",
		delay: 300,
	},
	{
		id: "onionalyze",
		href: "https://devpost.com/software/onionalyze",
		imgSrc: "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/407/402/datas/gallery.jpg",
		altText: "onionalyze Banner",
		delay: 400,
	},
];

function ProjectGallery() {
	useEffect(() => {
		AOS.init();
	}, []);

	console.log("ProjectGallery rendered");
	return (
		<section id="gallery" className={styles.gallery}>
			<div className={styles.container}>
				<div className={styles.heading}>
					<p className={styles.subtitle}>Highlighting Last Year's Top Achievements</p>
				</div>
				<div className={styles.projects}>
					{projects.map((project, index) => (
						<div
							key={project.id}
							className={`${styles.project} ${index === 1 ? styles.middleProject : ""}`}
							data-aos="fade-up"
							data-aos-delay={project.delay}
						>
							<a href={project.href}>
								<img className={styles.projectImage} src={project.imgSrc} alt={project.altText} />
							</a>
						</div>
					))}
				</div>
				<p className={styles.moreInspiration}>
					<Button
						href="https://hack-the-hill.devpost.com/project-gallery"
						data-aos="fade-up"
						data-aos-duration="800"
					>
						Explore more innovative projects
					</Button>
				</p>
			</div>
		</section>
	);
}

export default ProjectGallery;
