import { Button, darken, Grid, useMediaQuery, useTheme } from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import React from "react";
import "./SponsorShowcase.css";
import Ciena from "/Logos/Ciena.svg";
import CSClub from "/Logos/CSClub.svg";
import EEF from "/Logos/EEF.svg";
import Google from "/Logos/Google.svg";
import lonehaven from "/Logos/Lonehaven.svg";
import uOttawa from "/Logos/uOttawa.svg";
import uOGDC from "/Logos/uOttawaGDC.svg";

function SponsorShowcase() {
	const data = {
		sponsors: [
			{ href: "https://ciena.ca/", src: Ciena },
			{ href: "https://google.com/about/", src: Google },
			{ href: "https://www.lonehaven.com/", src: lonehaven },
		],
		collaborators: [
			{ href: "https://www2.uottawa.ca/en", src: uOttawa },
			{ href: "https://www.facebook.com/uottawaeeffdg/", src: EEF },
			{ href: "https://uocsclub.ca/", src: CSClub },
			{ href: "https://www.instagram.com/uogamedev/", src: uOGDC },
		],
	};

	const Item = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
		...theme.typography.body2,
		padding: theme.spacing(1),
		textAlign: "center",
		color: theme.palette.text.secondary,
	}));

	const theme = useTheme();
	const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
	const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
	const matchesLG = useMediaQuery(theme.breakpoints.down("lg"));

	return (
		<div id="Sponsors" className="Sponsors">
			<h1>Sponsors</h1>
			<div className="out">
				<div className="sponsors-body">
					<p className="text">
						Hack the Hill is made possible by our generous sponsors. Interested in supporting the capital’s
						hackathon?
					</p>
					<Button
						href={`mailto:sponsorship@hackthehill.com`}
						sx={{
							backgroundColor: "#5C71AD",
							borderRadius: "100px",
							color: "white",
							mt: matchesSM ? "7vw" : "2vw",
							p: "10px",
							textTransform: "none",
							minWidth: "12%",
							width: matchesSM ? "50%" : matchesLG ? "20%" : "0%",
							transition: "1s",
							ml: "2.5%",
							"&:hover": {
								backgroundColor: darken("#5C71AD", 0.3),
							},
						}}
					>
						<p className="ButtonText">Get in touch</p>
					</Button>
				</div>
			</div>
			<Grid container id="SponsorsDisplay" className="SponsorsDisplay">
				{data.sponsors.map((sponsor, i) => (
					<Grid
						key={i}
						item
						className="SponsorIconBox"
						sx={{ mt: matchesLG ? "50px" : "0px", mb: matchesLG ? "25px" : "0px" }}
					>
						<a href={sponsor.href}>
							<img className="SponsorIcon" alt="SponsorIcon" src={sponsor.src}></img>
						</a>
					</Grid>
				))}
			</Grid>

			<h1 id="Community">Community Partners</h1>
			<Grid container id="SponsorsDisplay" className="SponsorsDisplay">
				{data.collaborators.map((sponsor, i) => (
					<Grid
						key={i}
						item
						className="SponsorIconBox"
						sx={{ mt: matchesLG ? "50px" : "0px", mb: matchesLG ? "25px" : "0px" }}
					>
						<a href={sponsor.href}>
							<img className="SponsorIcon" alt="SponsorIcon" src={sponsor.src}></img>
						</a>
					</Grid>
				))}
			</Grid>
		</div>
	);
}

export default SponsorShowcase;
