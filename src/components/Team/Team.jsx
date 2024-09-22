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
            name: "Daniel Thorp",
            role: t("team.roles.president"),
            image: "/headshots/Daniel.webp",
        },
        {
            name: "Disala de Silva",
            role: t("team.roles.exec_vp"),
            image: "/headshots/Disala.webp",
        },
        {
            name: "Yazan Khasawneh",
            role: t("team.roles.at_large"),
            image: "/headshots/Template.webp",
        },
        {
            name: "Justin Wang",
            role: t("team.roles.community.vp"),
            image: "/headshots/Justin.webp",
        },
        {
            name: "Cece Ma",
            role: t("team.roles.community.coordinator"),
            image: "/headshots/Cece.webp",
        },
        {
            name: "Kheswari Gukhool",
            role: t("team.roles.community.coordinator"),
            image: "/headshots/Khes.webp",
        },
        {
            name: "Mustafa Ahmed",
            role: t("team.roles.community.coordinator"),
            image: "/headshots/Mustafa.webp",
        },
        {
            name: "Siva Senthilkumaran",
            role: t("team.roles.community.coordinator"),
            image: "/headshots/Siva.webp",
        },
        {
            name: "Tim Mao",
            role: t("team.roles.community.coordinator"),
            image: "/headshots/Tim.webp",
        },
        {
            name: "Meriem Mostefai",
            role: t("team.roles.design.vp"),
            image: "/headshots/Meriem.webp",
        },
        {
            name: "Christmas Pranommit",
            role: t("team.roles.design.coordinator"),
            image: "/headshots/Christmas.webp",
        },
        {
            name: "Ethan Tang",
            role: t("team.roles.design.coordinator"),
            image: "/headshots/Ethan.webp",
        },
        {
            name: "Humayrah Jhumka",
            role: t("team.roles.design.coordinator"),
            image: "/headshots/Humayrah.webp",
        },
        {
            name: "Jo Gurvantamir",
            role: t("team.roles.design.coordinator"),
            image: "/headshots/Jo.webp",
        },
        {
            name: "Jordan Lau",
            role: t("team.roles.design.coordinator"),
            image: "/headshots/Template.webp",
        },
        {
            name: "Rafael Arif",
            role: t("team.roles.design.coordinator"),
            image: "/headshots/Rafael.webp",
        },
        {
            name: "Sacha Arseneault",
            role: t("team.roles.development.manager"),
            image: "/headshots/Sacha.webp",
        },
        {
            name: "Erik Ang",
            role: t("team.roles.development.coordinator"),
            image: "/headshots/Erik.webp",
        },
        {
            name: "Martin Patrouchev",
            role: t("team.roles.development.coordinator"),
            image: "/headshots/Martin.webp",
        },
        {
            name: "Mattia Vergnat",
            role: t("team.roles.development.coordinator"),
            image: "/headshots/Mattia.webp",
        },
        {
            name: "Osa Ikhinmwin",
            role: t("team.roles.development.coordinator"),
            image: "/headshots/Osa.webp",
        },
        {
            name: "Patrick Igiraneza",
            role: t("team.roles.development.coordinator"),
            image: "/headshots/Template.webp",
        },
        {
            name: "Emilien Breton",
            role: t("team.roles.development.advisor"),
            image: "/headshots/Emilien.webp",
        },
        {
            name: "Sanil Srivastava",
            role: t("team.roles.finance.vp"),
            image: "/headshots/Sanil.webp",
        },
        {
            name: "Amal Sheikh-Mohamed",
            role: t("team.roles.finance.coordinator"),
            image: "/headshots/Amal.webp",
        },
        {
            name: "Elodie Abdo",
            role: t("team.roles.finance.coordinator"),
            image: "/headshots/Elodie.webp",
        },
        {
            name: "Kairly Tawk",
            role: t("team.roles.finance.coordinator"),
            image: "/headshots/Kairly.webp",
        },
        {
            name: "Qasim Sadeed",
            role: t("team.roles.finance.coordinator"),
            image: "/headshots/Template.webp",
        },
        {
            name: "Zach Fagnou",
            role: t("team.roles.finance.coordinator"),
            image: "/headshots/Zach.webp",
        },
        {
            name: "Saima Mujeebuddin",
            role: t("team.roles.logistics.vp"),
            image: "/headshots/Saima.webp",
        },
        {
            name: "Tahmeed Khan",
            role: t("team.roles.logistics.manager"),
            image: "/headshots/Tahmeed.webp",
        },
        {
            name: "Thinula de Silva",
            role: t("team.roles.logistics.manager"),
            image: "/headshots/Thinula.webp",
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
            name: "Juan Hiedra Primera",
            role: t("team.roles.logistics.coordinator"),
            image: "/headshots/Juan.webp",
        },
        {
            name: "Lehem Temesgen",
            role: t("team.roles.logistics.coordinator"),
            image: "/headshots/Lehem.webp",
        },
        {
            name: "Ming Chen",
            role: t("team.roles.logistics.coordinator"),
            image: "/headshots/Ming.webp",
        },  
        {
            name: "Thomas Nolasque",
            role: t("team.roles.logistics.coordinator"),
            image: "/headshots/Thomas.webp",
        },
        {
            name: "Valarie Wong",
            role: t("team.roles.logistics.coordinator"),
            image: "/headshots/Valarie.webp",
        },
        {
            name: "Pavly Saleh",
            role: t("team.roles.logistics.advisor"),
            image: "/headshots/Pav.webp",
        },
        {
            name: "Andrea Todorovic",
            role: t("team.roles.marketing.vp"),
            image: "/headshots/Andrea.webp",
        },
        {
            name: "Madison Moran",
            role: t("team.roles.marketing.manager"),
            image: "/headshots/Maddy.webp",
        },
        {
            name: "Esra Abdulwahab",
            role: t("team.roles.marketing.coordinator"),
            image: "/headshots/Esra.webp",
        },
        {
            name: "Myra Tariq",
            role: t("team.roles.marketing.coordinator"),
            image: "/headshots/Myra.webp",
        },
        {
            name: "Nalan Kurnaz",
            role: t("team.roles.marketing.coordinator"),
            image: "/headshots/Nalan.webp",
        },
        {
            name: "Raiyan Aziz",
            role: t("team.roles.marketing.coordinator"),
            image: "/headshots/Raiyan.webp",
        },
        {
            name: "Stefan Todorovic",
            role: t("team.roles.marketing.advisor"),
            image: "/headshots/Stefan.webp",
        },
        {
            name: "Steven Li",
            role: t("team.roles.marketing.advisor"),
            image: "/headshots/Steven.webp",
        },
        {
            name: "Manaal Mujeebuddin",
            role: t("team.roles.partnerships.vp"),
            image: "/headshots/Manaal.webp",
        },
        {
            name: "Alae Boufarrachene",
            role: t("team.roles.partnerships.manager"),
            image: "/headshots/Alae.webp",
        },
        {
            name: "Jad Mghabghab",
            role: t("team.roles.partnerships.manager"),
            image: "/headshots/Jad.webp",
        },
        {
            name: "Anis Saiyed",
            role: t("team.roles.partnerships.coordinator"),
            image: "/headshots/Anis.webp",
        },
        {
            name: "Ansh Kakkar",
            role: t("team.roles.partnerships.coordinator"),
            image: "/headshots/Ansh.webp",
        },
        {
            name: "Eric Eaton",
            role: t("team.roles.partnerships.coordinator"),
            image: "/headshots/Eric.webp",
        },
        {
            name: "Kemal Kilic",
            role: t("team.roles.partnerships.coordinator"),
            image: "/headshots/Template.webp",
        },
        {
            name: "Ouyi Xu",
            role: t("team.roles.partnerships.coordinator"),
            image: "/headshots/Ouyi.webp",
        },
        {
            name: "Raaed Mirza",
            role: t("team.roles.partnerships.coordinator"),
            image: "/headshots/Raaed.webp",
        },
        {
            name: "Rayhaan Farooq",
            role: t("team.roles.partnerships.coordinator"),
            image: "/headshots/Ray.webp",
        },
        {
            name: "Shri Vempati",
            role: t("team.roles.partnerships.coordinator"),
            image: "/headshots/Shrikar.webp",
        },
        {
            name: "Zahra Suleymanova",
            role: t("team.roles.partnerships.coordinator"),
            image: "/headshots/Zahra.webp",
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
