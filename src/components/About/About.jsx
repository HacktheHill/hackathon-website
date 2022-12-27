import React, { Component } from "react";
import Mascot from "../../assets/Logos/mascot_nametag_waving.svg";
import "./About.css";

class About extends Component {
	render() {
		return (
			<div className="About" id="About">
				<h1>About Us</h1>
				<div
					style={{
						display: "flex",
						flexDirection: /* innerWidth > 800 ? */ "row"/*  : "column" */,
						gap: "1rem",
					}}
				>
					<div className="about-body">
						<p>
							Hack the Hill is an internationally-hosted hackathon taking place in the heart of Canada's
							very own capital! In collaboration with the University of Ottawa's Engineering Faculty,
							seven major student organizations stepped up to establish Hack the Hill with the goal of
							setting the standard for how hackathons are operated.
							<br></br>
							<br></br>
							The uOttawa Engineering Student Society, IEEE uOttawa Student Branch, Computer Science
							Student Association, Software Engineering Student Association, Women in Engineering uOttawa
							Affinity Group, uOttawa Computer Science Club and uOttawa Game Development Club are proud to
							bring a flagship hackathon to Ottawa where students can network and compete with the best!
							<br></br>
							<br></br>
							With a series of monthly events leading into our main hackathon, also known as "The Hacker
							Series", hackathon participants will be provided numerous opportunities to brush up on their
							technical skills, network with peers and even learn from notable alumni and business
							leaders! Our main event is scheduled for February 3rd-5th, 2023 and will be free for all
							participants.
						</p>
					</div>
					<div className="mascot1">
						<img className="mascot1" src={Mascot} alt="Bea.var, the Hack the Hill mascot"></img>
					</div>
				</div>
			</div>
		);
	}
}

export default About;
