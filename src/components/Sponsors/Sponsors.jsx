import React from "react";
import Button from "../Button/Button.jsx";
import "./Sponsors.css";

import balsamiq from "/Logos/balsamiq.svg";
import Blackberry from "/Logos/Blackberry.svg";
import CanadianTire from "/Logos/CanadianTire.svg";
import Carleton from "/Logos/Carleton.svg";
import CarletonIEEE from "/Logos/CarletonIEEE.svg";
import Ciena from "/Logos/Ciena.svg";
import CSClub from "/Logos/CSClub.svg";
import CSE from "/Logos/CSE.svg";
import DigitalOcean from "/Logos/DigitalOcean.svg";
import echo3d from "/Logos/echo3d.webp";
import EEF from "/Logos/EEF.svg";
import Google from "/Logos/Google.svg";
import lonehaven from "/Logos/Lonehaven.svg";
import Redbull from "/Logos/Redbull.svg";
import SCESoc from "/Logos/SCESoc.svg";
import uOttawa from "/Logos/uOttawa.svg";
import uOttawaEsports from "/Logos/uOttawaEsports.svg";
import uOGDC from "/Logos/uOttawaGDC.svg";
import voiceflow from "/Logos/voiceflow.svg";

function Sponsors() {
	const data = {
		sponsors: {
			large: [
				{ href: "https://ciena.ca/", src: Ciena, alt: "Ciena" },
				{ href: "https://canadiantire.ca/", src: CanadianTire, alt: "Canadian Tire" },
			],
			medium: [
				{ href: "https://blackberry.com/", src: Blackberry, alt: "Blackberry" },
				{ href: "https://www.cse-cst.gc.ca/", src: CSE, alt: "CSE / CST" },
				{ href: "https://www.lonehaven.com/", src: lonehaven, alt: "Lonehaven" },
			],
			small: [
				{ href: "https://about.google", src: Google, alt: "Google" },
				{ href: "https://www.redbull.com/ca-en/", src: Redbull, alt: "RedBull" },
				{ href: "https://vercel.com/", src: Vercel, alt: "Vercel" },
				{ href: "https://www.digitalocean.com/", src: DigitalOcean, alt: "DigitalOcean" },
				{ href: "https://www.echo3d.com/", src: echo3d, alt: "echo3D" },
				{ href: "https://balsamiq.com/", src: balsamiq, alt: "balsamiq" },
				{ href: "https://www.voiceflow.com/", src: voiceflow, alt: "Voiceflow" },
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

	return (
		<div>
			<section id="sponsors" className="sponsors">
				<h1>Sponsors</h1>
				<div>
					<p className="sponsors-text">
						Hack the Hill is made possible by our generous sponsors. Interested in supporting the capital’s
						hackathon?
					</p>
					<Button href="/assets/Hack-the-Hill-Sponsorship.pdf">Sponsorship Package</Button>
				</div>

				<div className="sponsors-col">
					{Object.values(data.sponsors).map((tier, i) => (
						<div key={i} className="sponsors-row">
							{tier.map((sponsor, j) => (
								<a
									key={j}
									href={sponsor.href}
									target="_blank"
									rel="noreferrer"
									className="sponsor-icon-box"
								>
									<img
										className={`sponsor-icon icon-${Object.keys(data.sponsors)[i]}`}
										alt={`${sponsor.alt} logo`}
										src={sponsor.src}
									></img>
								</a>
							))}
						</div>
					))}
				</div>
			</section>

			<section className="sponsors">
				<h1 id="community">Community Partners</h1>
				<div className="sponsors-row">
					{data.collaborators.map((sponsor, i) => (
						<a key={i} href={sponsor.href} target="_blank" rel="noreferrer" className="sponsor-icon-box">
							<img className="sponsor-icon icon-medium" alt="sponsor-icon" src={sponsor.src}></img>
						</a>
					))}
				</div>
			</section>
		</div>
	);
}

export default Sponsors;
