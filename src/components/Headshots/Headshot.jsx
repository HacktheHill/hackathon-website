import React from "react";
import { faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faWindowMaximize } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import "./Headshot.css";

const Headshot = ({ team, name, role, insta, linkedin, website }) => {
	const path = `./headshots/${team}/${name}.webp`;
	const alt = `image of ${name}`;
	var role = role ?? "";

	var insta;
	if (insta) {
		insta = (
			<a href={`https://www.instagram.com/${insta}`} target="_blank" rel="noreferrer" aria-label="Instagram">
				<Icon className="invert" icon={faInstagram} />
			</a>
		);
	} else {
		<div></div>;
	}

	var linkedin;
	if (linkedin) {
		linkedin = (
			<a href={`https://www.linkedin.com/in/${linkedin}`} target="_blank" rel="noreferrer" aria-label="Linkedin">
				<Icon className="invert" icon={faLinkedin} />
			</a>
		);
	} else {
		<div></div>;
	}

	var website;
	if (website) {
		website = (
			<a href={website} target="_blank" rel="noreferrer" aria-label="Website">
				<Icon className="invert" icon={faWindowMaximize} />
			</a>
		);
	} else {
		<div></div>;
	}

	return (
		<div className="card">
			<div className="card-content">
				<div className="wrapper">
					<img className="headshot" src={path} alt={alt} />
				</div>

				<div className="back">
					<p className="personName">{name}</p>
					<p className="teamName">{team}</p>
					<p className="teamName">{role}</p> {/* teamName?! */}
					<div className="socials">
						{insta}
						{linkedin}
						{website}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Headshot;
