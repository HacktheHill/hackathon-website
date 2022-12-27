import React from "react";
import Ciena from "../../assets/Logos/Ciena.svg";
import DotTech from "../../assets/Logos/DotTech.svg";
import EEF from "../../assets/Logos/eef_logo.svg";
import Github from "../../assets/Logos/github.svg";
import Google from "../../assets/Logos/Google.svg";
import LoneHeaven from "../../assets/Logos/Lonehaven.svg";
import StackOverFlow from "../../assets/Logos/StackOverFlow.svg";
import uOttawa from "../../assets/Logos/university-of-ottawa-seeklogo.com.svg";
import uocs from "../../assets/Logos/uocsclub.svg";
import uogdc from "../../assets/Logos/uOttawaGDC_FullLogo.png";
import "./SponsorShowcase.css";

function SponsorShowcase() {
	const data = {
		sponsors: [
			{ href: "https://ciena.ca/", src: Ciena },
			{ href: "https://google.com/about/", src: Google },
			{ href: "https://stackoverflow.com/", src: StackOverFlow },
			{ href: "https://github.com/about", src: Github },
			{ href: "https://www.lonehaven.com/", src: LoneHeaven },
			{ href: "https://get.tech/", src: DotTech },
		],
		collaborators: [
			{ href: "https://www2.uottawa.ca/en", src: uOttawa },
			{ href: "https://www.facebook.com/uottawaeeffdg/", src: EEF },
			{ href: "https://uocsclub.ca/", src: uocs },
			{ href: "https://www.instagram.com/uogamedev/", src: uogdc },
		],
	};

	return (
		<div className="Sponsors">
			<h1>Sponsors</h1>
			<div className="out">
				<div className="sponsors-body">
					<p className="text">
						Hack the Hill is made possible by our generous sponsors. Interested in supporting the capital’s
						hackathon?
					</p>
					<button
						href={`mailto:sponsorship@hackthehill.com`}
						style={{
							backgroundColor: "#5C71AD",
							borderRadius: "100px",
							color: "white",
							marginTop: /* innerWidth < 800 ? */ "7vw"/*  : "2vw" */,
							padding: "10px",
							textTransform: "none",
							minWidth: "12%",
							width: /* innerWidth < 800 ? */ "50%" /* : innerWidth > 1024 ? "20%" : "0%" */,
							transition: "1s",
							marginLeft: "2.5%",
							"&:hover": {
								backgroundColor: "#5C71AD",
							},
						}}
					>
						<p className="ButtonText">Get in touch</p>
					</button>
				</div>
			</div>
			<div style={{ display: "flex", flexWrap: "wrap" }} id="SponsorsDisplay" className="SponsorsDisplay">
				{data.sponsors.map((sponsor, i) => (
					<div
						key={i}
						className="SponsorIconBox"
						style={{
							marginTop: /* innerWidth > 1024 ? */ "50px" /* : "0px" */,
							marginBottom: /* innerWidth > 1024 ? */ "25px" /* : "0px" */,
						}}
					>
						<a href={sponsor.href}>
							<img className="SponsorIcon" alt="SponsorIcon" src={sponsor.src}></img>
						</a>
					</div>
				))}
			</div>

			<h1>Community Partners</h1>
			<div style={{ display: "flex", flexWrap: "wrap" }} id="SponsorsDisplay" className="SponsorsDisplay">
				{data.collaborators.map((sponsor, i) => (
					<div
					key={i}
						className="SponsorIconBox"
						style={{
							marginTop: /* innerWidth > 1024 ? */ "50px" /* : "0px" */,
							marginBottom: /* innerWidth > 1024 ? */ "25px" /* : "0px" */,
						}}
					>
						<a href={sponsor.href}>
							<img className="SponsorIcon" alt="SponsorIcon" src={sponsor.src}></img>
						</a>
					</div>
				))}
			</div>
		</div>
	);
}

export default SponsorShowcase;
