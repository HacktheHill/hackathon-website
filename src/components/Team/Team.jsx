import styles from "./Team.module.css";
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { t } from "../../i18n";

const marqueeGroup = (team, index, pauseAnimation, startAnimation) => {
	return (
		<div
			id={`marquee${index}`}
			className={styles["marquee-group"]}
			onMouseEnter={pauseAnimation}
			onMouseLeave={startAnimation}
			onFocus={pauseAnimation}
			onBlur={startAnimation}
		>
			{team.map(member => (
				<div key={member.name}>
					<Tooltip
						enterTouchDelay={0}
						title={
							<div className={styles["tooltip-text"]}>
								<strong>{member.name}</strong>
								<br />
								{member.role}
							</div>
						}
						placement="top"
					>
						<div className={styles["team-member"]}>
							<img src={member.image} alt={member.name} width="60px" />
						</div>
					</Tooltip>
				</div>
			))}
		</div>
	);
};

function Team() {
	const team = [
		{
			name: "Disala de Silva",
			role: t("team.roles.president"),
			image: "/headshots/Disala.webp",
		},
		{
			name: "Justin Wang",
			role: t("team.roles.community.director"),
			image: "/headshots/Justin.webp",
		},
		{
			name: "Meriem Mostefai",
			role: t("team.roles.design.director"),
			image: "/headshots/Meriem.webp",
		},
		{
			name: "Ryan Awad",
			role: t("team.roles.development.director"),
			image: "/headshots/Ryan.webp",
		},
		{
			name: "Andrea Todorovic",
			role: t("team.roles.logistics.director"),
			image: "/headshots/Andrea.webp",
		},
		{
			name: "Thinula de Silva",
			role: t("team.roles.logistics.director"),
			image: "/headshots/Thinula.webp",
		},
		{
			name: "Kheswari Gukhool",
			role: t("team.roles.marketing.director"),
			image: "/headshots/Khes.webp",
		},
		{
			name: "Daniel Thorp",
			role: t("team.roles.operations.director"),
			image: "/headshots/Daniel.webp",
		},
		{
			name: "Sanil Srivastava",
			role: t("team.roles.operations.director"),
			image: "/headshots/Sanil.webp",
		},
		{
			name: "Manaal Mujeebuddin",
			role: t("team.roles.sponsorship.director"),
			image: "/headshots/Manaal.webp",
		},
		{
			name: "Hasith De Alwis",
			role: t("team.roles.community.manager"),
			image: "/headshots/Hasith.webp",
		},
		{
			name: "Tim Mao",
			role: t("team.roles.community.coordinator"),
			image: "/headshots/Tim.webp",
		},
		{
			name: "Mustafa Ahmed",
			role: t("team.roles.community.coordinator"),
			image: "/headshots/Mustafa.webp",
		},
		{
			name: "Cece Ma",
			role: t("team.roles.community.coordinator"),
			image: "/headshots/Cece.webp",
		},
		{
			name: "Siva Senthilkumaran",
			role: t("team.roles.community.coordinator"),
			image: "/headshots/Siva.webp",
		},
		{
			name: "Humayrah Jhumka",
			role: t("team.roles.design.coordinator"),
			image: "/headshots/Humayrah.webp",
		},
		{
			name: "Christmas Pranommit",
			role: t("team.roles.design.coordinator"),
			image: "/headshots/Christmas.webp",
		},
		{
			name: "Aashna Verma",
			role: t("team.roles.design.coordinator"),
			image: "/headshots/Template.webp",
		},
		{
			name: "Jordan Lau",
			role: t("team.roles.design.coordinator"),
			image: "/headshots/Template.webp",
		},
		{
			name: "Jo Gurvantamir",
			role: t("team.roles.design.coordinator"),
			image: "/headshots/Jo.webp",
		},
		{
			name: "Ethan Tang",
			role: t("team.roles.design.coordinator"),
			image: "/headshots/Ethan.webp",
		},
		{
			name: "Sacha Arseneault",
			role: t("team.roles.development.manager"),
			image: "/headshots/Sacha.webp",
		},
		{
			name: "Hiba Tantawi",
			role: t("team.roles.development.manager"),
			image: "/headshots/Hiba.webp",
		},
		{
			name: "Chiso Chisom",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/Template.webp",
		},
		{
			name: "Osa Ikhinmwin",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/Osa.webp",
		},
		{
			name: "Erik Ang",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/Erik.webp",
		},
		{
			name: "Saheen Jeyarajah",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/Template.webp",
		},
		{
			name: "Ahmed Nasr",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/Template.webp",
		},
		{
			name: "Lukas Enkhtsog",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/Template.webp",
		},
		{
			name: "Mattia Vergnat",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/Mattia.webp",
		},
		{
			name: "Christina Song",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/Christina.webp",
		},
		{
			name: "Martin Patrouchev",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/Martin.webp",
		},
		{
			name: "Patrick Igiraneza",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/Template.webp",
		},
		{
			name: "Saima Mujeebuddin",
			role: t("team.roles.logistics.manager"),
			image: "/headshots/Saima.webp",
		},
		{
			name: "Juan Hiedra Primera",
			role: t("team.roles.logistics.coordinator"),
			image: "/headshots/Template.webp",
		},
		{
			name: "Divya Vithiyatharan",
			role: t("team.roles.logistics.coordinator"),
			image: "/headshots/Template.webp",
		},
		{
			name: "Jaden Fielding",
			role: t("team.roles.logistics.coordinator"),
			image: "/headshots/Jaden.webp",
		},
		{
			name: "Valarie Wong",
			role: t("team.roles.logistics.coordinator"),
			image: "/headshots/Valarie.webp",
		},
		{
			name: "Lehem Temesgen",
			role: t("team.roles.logistics.coordinator"),
			image: "/headshots/Lehem.webp",
		},
		{
			name: "Mingye Chen",
			role: t("team.roles.logistics.coordinator"),
			image: "/headshots/Template.webp",
		},
		{
			name: "Tahmeed Khan",
			role: t("team.roles.logistics.coordinator"),
			image: "/headshots/Tahmeed.webp",
		},
		{
			name: "Thomas Nolasque",
			role: t("team.roles.logistics.coordinator"),
			image: "/headshots/Thomas.webp",
		},
		{
			name: "Madison Moran",
			role: t("team.roles.marketing.manager"),
			image: "/headshots/Maddy.webp",
		},
		{
			name: "Eliana Schartner",
			role: t("team.roles.marketing.coordinator"),
			image: "/headshots/Eliana.webp",
		},
		{
			name: "Myra Tariq",
			role: t("team.roles.marketing.coordinator"),
			image: "/headshots/Myra.webp",
		},
		{
			name: "Nalan Kurnaz",
			role: t("team.roles.marketing.coordinator"),
			image: "/headshots/Template.webp",
		},
		{
			name: "Raiyan Aziz",
			role: t("team.roles.marketing.coordinator"),
			image: "/headshots/Raiyan.webp",
		},
		{
			name: "Esra Abdulwahab",
			role: t("team.roles.marketing.coordinator"),
			image: "/headshots/Esra.webp",
		},
		{
			name: "Yazan Khasawneh",
			role: t("team.roles.operations.coordinator"),
			image: "/headshots/Template.webp",
		},
		{
			name: "Elodie Abdo",
			role: t("team.roles.operations.coordinator"),
			image: "/headshots/Elodie.webp",
		},
		{
			name: "Qasim Sadeed",
			role: t("team.roles.operations.coordinator"),
			image: "/headshots/Template.webp",
		},
		{
			name: "Jad Mghabghab",
			role: t("team.roles.sponsorship.manager"),
			image: "/headshots/Jad.webp",
		},
		{
			name: "Alae Boufarrachene",
			role: t("team.roles.sponsorship.manager"),
			image: "/headshots/Alae.webp",
		},
		{
			name: "Anisaftab Saiyed",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/Anis.webp",
		},
		{
			name: "Ouyi Xu",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/Ouyi.webp",
		},
		{
			name: "Rola Elghonimy",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/Rola.webp",
		},
		{
			name: "Rayhaan Farooq",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/Ray.webp",
		},
		{
			name: "Shrikar Vempati",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/Shrikar.webp",
		},
		{
			name: "Ansh Kakkar",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/Ansh.webp",
		},
		{
			name: "Zahra Suleymanova",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/Template.webp",
		},
		{
			name: "Kemal Kilic",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/Template.webp",
		},
		{
			name: "Eric Eaton",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/Template.webp",
		},
		{
			name: "Bea.var",
			role: t("team.roles.mascot"),
			image: "/headshots/Beavar.webp",
		},
	];

	function pauseAnimation() {
		document.getElementById("marquee1").style.animationPlayState = "paused";
		document.getElementById("marquee2").style.animationPlayState = "paused";
	}

	function startAnimation() {
		document.getElementById("marquee1").style.animationPlayState = "running";
		document.getElementById("marquee2").style.animationPlayState = "running";
	}

	return (
		<div className={styles["team"]}>
			<div className={styles["header-container"]}>
				<p className={styles["team-title"]}>{t("team.title")}</p>
			</div>
			<div className={styles["carousel-track"]}>
				{marqueeGroup(team, 1, pauseAnimation, startAnimation)}
				{marqueeGroup(team, 2, pauseAnimation, startAnimation)}
			</div>
		</div>
	);
}
export default Team;
