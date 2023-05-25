import React from "react";
import { faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faWindowMaximize } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import "./Headshot.css";

const Headshot = ({ team, name, role, insta, linkedin, website }) => {
	const path = `./headshots/${team}/${name}.webp`;
	const alt = `image of ${name}`;
	role = role ?? "";

	let instaDiv;
	if (insta) {
		instaDiv = (
			<a href={`https://www.instagram.com/${insta}`} target="_blank" rel="noreferrer" aria-label="Instagram">
				<Icon className="invert" icon={faInstagram} />
			</a>
		);
	} else {
		instaDiv = <div></div>;
	}

	let linkedinDiv;
	if (linkedin) {
		linkedinDiv = (
			<a href={`https://www.linkedin.com/in/${linkedin}`} target="_blank" rel="noreferrer" aria-label="Linkedin">
				<Icon className="invert" icon={faLinkedin} />
			</a>
		);
	} else {
		linkedinDiv = <div></div>;
	}

	let websiteDiv;
	if (website) {
		websiteDiv = (
			<a href={website} target="_blank" rel="noreferrer" aria-label="Website">
				<Icon className="invert" icon={faWindowMaximize} />
			</a>
		);
	} else {
		websiteDiv = <div></div>;
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
						{instaDiv}
						{linkedinDiv}
						{websiteDiv}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Headshot;
