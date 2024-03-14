import styles from "./Team.module.css";
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { t } from "../../i18n";

function Team() {
	const team = [
		{
			name: "Mumtahin Farabi",
			role: t("team.roles.president"),
			image: "/headshots/farabi.webp",
		},
		{
			name: "Justin Wang",
			role: t("team.roles.community.director"),
			image: "/headshots/justin.webp",
		},
		{
			name: "Meriem Mostefai",
			role: t("team.roles.design.director"),
			image: "/headshots/meriem.webp",
		},
		{
			name: "Ryan Awad",
			role: t("team.roles.development.director"),
			image: "/headshots/ryan.webp",
		},
		{
			name: "Andrea Todorovic",
			role: t("team.roles.logistics.director"),
			image: "/headshots/andrea.webp",
		},
		{
			name: "Pavly Saleh",
			role: t("team.roles.logistics.director"),
			image: "/headshots/pav.webp",
		},
		{
			name: "Disala de Silva",
			role: t("team.roles.marketing.director"),
			image: "/headshots/disala.webp",
		},
		{
			name: "Daniel Thorp",
			role: t("team.roles.operations.director"),
			image: "/headshots/daniel.webp",
		},
		{
			name: "Manaal Mujeebuddin",
			role: t("team.roles.sponsorship.director"),
			image: "/headshots/manaal.webp",
		},
		{
			name: "Kheswari Gukhool",
			role: t("team.roles.community.manager"),
			image: "/headshots/khes.webp",
		},
		{
			name: "Tim Mao",
			role: t("team.roles.community.coordinator"),
			image: "/headshots/tim.webp",
		},
		{
			name: "Mustafa Ahmed",
			role: t("team.roles.community.coordinator"),
			image: "/headshots/mustafa.webp",
		},
		{
			name: "Hasith De Alwis",
			role: t("team.roles.community.coordinator"),
			image: "/headshots/hasith.webp",
		},
		{
			name: "Cece Ma",
			role: t("team.roles.community.coordinator"),
			image: "/headshots/cece.webp",
		},
		{
			name: "Mingye Chen",
			role: t("team.roles.competitions.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Tahmeed Khan",
			role: t("team.roles.competitions.coordinator"),
			image: "/headshots/tahmeed.webp",
		},
		{
			name: "Siva Senthilkumaran",
			role: t("team.roles.competitions.coordinator"),
			image: "/headshots/siva.webp",
		},
		{
			name: "Thomas Nolasque",
			role: t("team.roles.competitions.coordinator"),
			image: "/headshots/thomas.webp",
		},
		{
			name: "Humayrah Jhumka",
			role: t("team.roles.design.coordinator"),
			image: "/headshots/humayrah.webp",
		},
		{
			name: "Christmas Pranommit",
			role: t("team.roles.design.coordinator"),
			image: "/headshots/christmas.webp",
		},
		{
			name: "Amy Bradbrook",
			role: t("team.roles.design.coordinator"),
			image: "/headshots/amy.webp",
		},
		{
			name: "Aashna Verma",
			role: t("team.roles.design.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Jordan Lau",
			role: t("team.roles.design.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Jo Gurvantamir",
			role: t("team.roles.design.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Ethan Tang",
			role: t("team.roles.logistics.coordinator"),
			image: "/headshots/ethan.webp",
		},
		{
			name: "Saheen Jeyarajah",
			role: t("team.roles.development.manager"),
			image: "/headshots/template.webp",
		},
		{
			name: "Sacha Arseneault",
			role: t("team.roles.development.manager"),
			image: "/headshots/sacha.webp",
		},
		{
			name: "Hiba Tantawi",
			role: t("team.roles.development.manager"),
			image: "/headshots/hiba.webp",
		},
		{
			name: "Chiso Chisom",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Osa Ikhinmwin",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/osa.webp",
		},
		{
			name: "Erik Ang",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Ahmed Nasr",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Lukas Enkhtsog",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Mattia Vergnat",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/mattia.webp",
		},
		{
			name: "Christina Song",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/christina.webp",
		},
		{
			name: "Martin Patrouchev",
			role: t("team.roles.development.coordinator"),
			image: "/headshots/martin.webp",
		},
		{
			name: "Thinula de Silva",
			role: t("team.roles.logistics.coordinator"),
			image: "/headshots/thinula.webp",
		},
		{
			name: "Saima Mujeebuddin",
			role: t("team.roles.logistics.coordinator"),
			image: "/headshots/saima.webp",
		},
		{
			name: "Juan Hiedra Primera",
			role: t("team.roles.logistics.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Divya Vithiyatharan",
			role: t("team.roles.logistics.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Jaden Fielding",
			role: t("team.roles.logistics.coordinator"),
			image: "/headshots/jaden.webp",
		},
		{
			name: "Valarie Wong",
			role: t("team.roles.logistics.coordinator"),
			image: "/headshots/valarie.webp",
		},
		{
			name: "Lehem Temesgen",
			role: t("team.roles.logistics.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Madison Moran",
			role: t("team.roles.marketing.manager"),
			image: "/headshots/maddy.webp",
		},
		{
			name: "Rafael Arif",
			role: t("team.roles.marketing.manager"),
			image: "/headshots/raf.webp",
		},
		{
			name: "Stefan Todorovic",
			role: t("team.roles.marketing.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Nyah Wagner",
			role: t("team.roles.marketing.coordinator"),
			image: "/headshots/nyah.webp",
		},
		{
			name: "Eliana Schartner",
			role: t("team.roles.marketing.coordinator"),
			image: "/headshots/eliana.webp",
		},
		{
			name: "Myra Tariq",
			role: t("team.roles.marketing.coordinator"),
			image: "/headshots/myra.webp",
		},
		{
			name: "Nalan Kurnaz",
			role: t("team.roles.marketing.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Raiyan Aziz",
			role: t("team.roles.marketing.coordinator"),
			image: "/headshots/raiyan.webp",
		},
		{
			name: "Esra Abdulwahab",
			role: t("team.roles.marketing.coordinator"),
			image: "/headshots/esra.webp",
		},
		{
			name: "Yazan Khasawneh",
			role: t("team.roles.operations.manager"),
			image: "/headshots/template.webp",
		},
		{
			name: "Sanil Srivastava",
			role: t("team.roles.operations.coordinator"),
			image: "/headshots/sanil.webp",
		},
		{
			name: "Sakshit Sharma",
			role: t("team.roles.operations.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Elodie Abdo",
			role: t("team.roles.operations.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Qasim Sadeed",
			role: t("team.roles.operations.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Jad Mghabghab",
			role: t("team.roles.sponsorship.manager"),
			image: "/headshots/jad.webp",
		},
		{
			name: "Alae Boufarrachene",
			role: t("team.roles.sponsorship.manager"),
			image: "/headshots/alae.webp",
		},
		{
			name: "Anisaftab Saiyed",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/anis.webp",
		},
		{
			name: "Ouyi Xu",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/ouyi.webp",
		},
		{
			name: "Rola Elghonimy",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/rola.webp",
		},
		{
			name: "Rayhaan Farooq",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/ray.webp",
		},
		{
			name: "Shrikar Vempati",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/shrikar.webp",
		},
		{
			name: "Raaed Mirza",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Ansh Kakkar",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/ansh.webp",
		},
		{
			name: "Zahra Suleymanova",
			role: t("team.roles.sponsorship.coordinator"),
			image: "/headshots/template.webp",
		},
		{
			name: "Bea.var",
			role: t("team.roles.mascot"),
			image: "/headshots/beavar.webp",
		},
	];

	function handleHoverStart() {
		document.getElementById("marquee1").style.animationPlayState = "paused";
		document.getElementById("marquee2").style.animationPlayState = "paused";
	}

	function handleHoverEnd() {
		document.getElementById("marquee1").style.animationPlayState = "running";
		document.getElementById("marquee2").style.animationPlayState = "running";
	}

	const marqueeGroup = (team, index) => {
		return (
			<div
				id={`marquee${index}`}
				className={styles["marquee-group"]}
				onMouseEnter={handleHoverStart}
				onMouseLeave={handleHoverEnd}
			>
				{team.map(member => (
					<div key={member.name}>
						<Tooltip
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

	return (
		<div className={styles["team"]}>
			<div className={styles["header-container"]}>
				<h3>{t("team.title")}</h3>
			</div>
			<div className={styles["carousel-track"]}>
				{marqueeGroup(team, 1)}
				{marqueeGroup(team, 2)}
			</div>
		</div>
	);
}
export default Team;
