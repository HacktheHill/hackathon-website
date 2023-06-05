import React from "react";
import { faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faWindowMaximize } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import "./Headshot.css";


const Headshot = ({ team, name, role, instagram, linkedin, website }) => {
	const path = `/headshots/${team}/${name}.webp`.toLowerCase();
	const alt = 'image of '+ name;
	role = role ?? "";

	let instagramLink = instagram ? (
			<a href={`https://www.instagram.com/${instagram}`} target="_blank" rel="noreferrer" aria-label="Instagram">
				<Icon className="invert" icon={faInstagram} />
			</a>
		) : 
		<></>

	let linkedinLink = linkedin ? (
			<a href={`https://www.linkedin.com/in/${linkedin}`} target="_blank" rel="noreferrer" aria-label="Linkedin">
				<Icon className="invert" icon={faLinkedin} />
			</a>
		) : 
		<></>
	// to be added when we ask for others websites
	// let websiteLink = website ? 
	// 		<a href={website} target="_blank" rel="noreferrer" aria-label="Website">
	// 			<Icon className="invert" icon={faWindowMaximize} />
	// 		</a>
	// 	:
	// 	<></>;

	return (
		<div className="card">
			<div className="card-content">
				<div className="front">
					<img class="headshot" src={path} alt={alt}></img>
				</div>

				<div className="back">
					<p className="personName">{name}</p>
					<p className="teamName">{team}</p>
					<p className="teamName">{role}</p>
					<div className="socials">
						{instagramLink}
						{linkedinLink}
						{/* {websiteLink} */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Headshot;
