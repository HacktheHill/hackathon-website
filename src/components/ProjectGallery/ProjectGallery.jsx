import React from "react";
import styles from "./ProjectGallery.module.css";

const projects = [
  {
    id: "infracrypt",
    href: "https://devpost.com/software/infracrypt",
    imgSrc: "https://via.placeholder.com/400x300",
    altText: "infracrypt Banner",
    delay: 200
  },
  {
    id: "oiligarchy",
    href: "https://devpost.com/software/oiligarchy-the-game-about-how-profit-turns-to-pain",
    imgSrc: "https://via.placeholder.com/400x300",
    altText: "oiligarchy Banner",
    delay: 300
  },
  {
    id: "onionalyze",
    href: "https://devpost.com/software/onionalyze",
    imgSrc: "https://via.placeholder.com/400x300",
    altText: "onionalyze Banner",
    delay: 400
  },
];

function ProjectGallery() {
  console.log("ProjectGallery rendered");
  return (
    <section id="gallery" className={styles.gallery}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <p className={styles.title}>&lt;project gallery /&gt;</p>
          <h3 className={styles.subtitle}>last year's top 3&nbsp;🏆</h3>
        </div>
        <div className={styles.projects}>
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`${styles.project} ${index === 1 ? styles.middleProject : ""}`}
            >
              <a href={project.href}>
                <img
                  className={styles.projectImage}
                  src={project.imgSrc}
                  alt={project.altText}
                />
              </a>
            </div>
          ))}
        </div>
        <p className={styles.moreInspiration}>
          <a href="https://hack-the-hill.devpost.com/project-gallery">need more inspiration?</a>
        </p>
      </div>
    </section>
  );
}

export default ProjectGallery;
