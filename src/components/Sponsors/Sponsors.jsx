import { Grid, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import "./Sponsors.css";
import balsamiq from "/Logos/balsamiq.svg";
import CanadianTire from "/Logos/CanadianTire.svg";
import Carleton from "/Logos/Carleton.svg";
import Ciena from "/Logos/Ciena.svg";
import CSClub from "/Logos/CSClub.svg";
import CSE from "/Logos/CSE.svg";
import DigitalOcean from "/Logos/DigitalOcean.svg";
import echo3d from "/Logos/echo3d.webp";
import EEF from "/Logos/EEF.svg";
import Google from "/Logos/Google.svg";
import lonehaven from "/Logos/Lonehaven.svg";
import SCESoc from "/Logos/SCESoc.svg";
import uOttawa from "/Logos/uOttawa.svg";
import uOGDC from "/Logos/uOttawaGDC.svg";
import voiceflow from "/Logos/voiceflow.svg";

function Sponsors() {
	const data = {
		sponsors: [
			{ href: "https://ciena.ca/", src: Ciena },
			{ href: "https://canadiantire.ca/", src: CanadianTire },
			{ href: "https://google.com/about/", src: Google },
			{ href: "https://www.cse-cst.gc.ca/", src: CSE },
			{ href: "https://www.lonehaven.com/", src: lonehaven },
			{ href: "https://www.digitalocean.com/", src: DigitalOcean },
			{ href: "https://www.echo3d.com/", src: echo3d },
			{ href: "https://balsamiq.com/", src: balsamiq },
			{ href: "https://www.voiceflow.com/", src: voiceflow },
		],
		collaborators: [
			{ href: "https://www2.uottawa.ca/en", src: uOttawa },
			{ href: "https://carleton.ca/", src: Carleton },
			{ href: "https://www.scesoc.ca/", src: SCESoc },
			{ href: "https://www.facebook.com/uottawaeeffdg/", src: EEF },
			{ href: "https://uocsclub.ca/", src: CSClub },
			{ href: "https://www.instagram.com/uogamedev/", src: uOGDC },
		],
	};

	const theme = useTheme();
	const matchesLG = useMediaQuery(theme.breakpoints.down("lg"));

	return (
		<div id="sponsors" className="sponsors">
			<h1>Sponsors</h1>
			<div>
				<p className="sponsors-text">
					Hack the Hill is made possible by our generous sponsors. Interested in supporting the capital’s
					hackathon?
				</p>
				<a className="button" target="_blank" href="/assets/Hack-the-Hill-Sponsorship.pdf" rel="noreferrer">
					<button>Sponsorship Package</button>
				</a>
			</div>

			<Grid container id="sponsors-display" className="sponsors-display">
				{data.sponsors.map((sponsor, i) => (
					<Grid
						key={i}
						item
						className="sponsor-icon-box"
						sx={{ mt: matchesLG ? "50px" : "0px", mb: matchesLG ? "25px" : "0px" }}>
						<a href={sponsor.href}>
							<img className="sponsor-icon" alt="sponsor-icon" src={sponsor.src}></img>
						</a>
					</Grid>
				))}
			</Grid>

			<section>
				<h1 id="community">Community Partners</h1>
				<Grid container id="sponsors-display" className="sponsors-display">
					{data.collaborators.map((sponsor, i) => (
						<Grid
							key={i}
							item
							className="sponsor-icon-box"
							sx={{ mt: matchesLG ? "50px" : "0px", mb: matchesLG ? "25px" : "0px" }}>
							<a href={sponsor.href}>
								<img className="sponsor-icon" alt="sponsor-icon" src={sponsor.src}></img>
							</a>
						</Grid>
					))}
				</Grid>
			</section>
		</div>
	);
}

export default Sponsors;
