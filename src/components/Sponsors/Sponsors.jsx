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
import CarletonIEEE from "/Logos/CarletonIEEE.svg";
import SCESoc from "/Logos/SCESoc.svg";
import uOttawa from "/Logos/uOttawa.svg";
import uOGDC from "/Logos/uOttawaGDC.svg";
import voiceflow from "/Logos/voiceflow.svg";
import Redbull from "/Logos/Redbull.svg";
import uOttawaEsports from "/Logos/uOttawaEsports.svg";

function Sponsors() {
	const data = {
		sponsors: {
			large: [
				{ href: "https://ciena.ca/", src: Ciena },
				{ href: "https://canadiantire.ca/", src: CanadianTire },
				{ href: "https://www.cse-cst.gc.ca/", src: CSE },
			],
			medium: [
				{ href: "https://google.com/about/", src: Google },
				{ href: "https://www.lonehaven.com/", src: lonehaven },
				{ href: "https://www.redbull.com/ca-en/", src: Redbull },
				{ href: "https://www.digitalocean.com/", src: DigitalOcean },
			],
			small: [
				{ href: "https://www.echo3d.com/", src: echo3d },
				{ href: "https://balsamiq.com/", src: balsamiq },
				{ href: "https://www.voiceflow.com/", src: voiceflow },
			],
		},
		collaborators: [
			{ href: "https://www2.uottawa.ca/en", src: uOttawa },
			{ href: "https://carleton.ca/", src: Carleton },
			{ href: "https://ieeecarleton.ca/", src: CarletonIEEE },
			{ href: "https://www.scesoc.ca/", src: SCESoc },
			{ href: "https://www.facebook.com/uottawaeeffdg/", src: EEF },
			{ href: "https://uocsclub.ca/", src: CSClub },
			{ href: "https://www.instagram.com/uogamedev/", src: uOGDC },
			{ href: "https://www.uottawaesports.ca/", src: uOttawaEsports },
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

			{Object.values(data.sponsors).map((tier, i) => (
				<Grid key={i} container id="sponsors-display" className="sponsors-display">
					{tier.map((sponsor, j) => (
						<Grid
							key={j}
							item
							className="sponsor-icon-box"
							sx={{ mt: matchesLG ? "50px" : "0px", mb: matchesLG ? "25px" : "0px" }}
						>
							<a href={sponsor.href}>
								<img
									className={`sponsor-icon Icon${["Large", "Medium", "Small"][i]}`}
									alt="SponsorIcon"
									src={sponsor.src}
								></img>
							</a>
						</Grid>
					))}
				</Grid>
			))}

			<section>
				<h1 id="community">Community Partners</h1>
				<Grid container id="sponsors-display" className="sponsors-display">
					{data.collaborators.map((sponsor, i) => (
						<Grid
							key={i}
							item
							className="sponsor-icon-box"
							sx={{ mt: matchesLG ? "50px" : "0px", mb: matchesLG ? "25px" : "0px" }}
						>
							<a href={sponsor.href}>
								<img className="sponsor-icon IconMedium" alt="sponsor-icon" src={sponsor.src}></img>
							</a>
						</Grid>
					))}
				</Grid>
			</section>
		</div>
	);
}

export default Sponsors;
