import Ross from "@/assets/Logos/Ross.svg?url";
import Ciena from "@/assets/Logos/Ciena.svg?url";
import CSE from "@/assets/Logos/CSE.svg?url";
import ESS from "@/assets/Logos/ESS.svg?url";
import LiquidIV from "@/assets/Logos/LiquidIV.webp?url";
import Redbull from "@/assets/Logos/Redbull.svg?url";
import SESA from "@/assets/Logos/SESA.svg?url";
import Fantuan from "@/assets/Logos/Fantuan.webp?url";

import CCSS from "@/assets/Logos/ccss.png?url";
import Carleton from "@/assets/Logos/Carleton.svg?url";
import CarletonIEEE from "@/assets/Logos/CarletonIEEE.svg?url";
import uOCyberSec from "@/assets/Logos/uOCyberSec.svg?url";
import CSSA from "@/assets/Logos/CSSA.svg?url";
import uOttawaIEEE from "@/assets/Logos/uOttawaIEEE.svg?url";
import WIE from "@/assets/Logos/WIE.svg?url";
import EEF from "@/assets/Logos/EEF.svg?url";
import telferBTA from "@/assets/Logos/bta-logo.svg?url";
import SCESoc from "@/assets/Logos/SCESoc.svg?url";
import uOttawa from "@/assets/Logos/uOttawa.svg?url";
import uOGDC from "@/assets/Logos/uOttawaGDC.svg?url";
import uOEngiqueers from "@/assets/Logos/uOEngiqueers.svg?url";
import DEsocCarleton from "@/assets/Logos/desocCarleton.webp?url";

const Blackberry = "/Logos/Blackberry.svg";
const CanadianTire = "/Logos/CanadianTire.svg";
const Lonehaven = "/Logos/Lonehaven.svg";
const Ceed = "/Logos/ceed.svg";
const Law = "/Logos/Law.svg";
const CSClub = "/Logos/CSClub.svg";
const uOttawaEsports = "/Logos/uOttawaEsports.svg";
export const SNOWBANKS = Array.from({ length: 7 }, (_, index) => `/art/sponsors/snowbank-${index + 1}.webp`);

type Organization = { href: string; src: string; alt: string };
type SponsorTier = "councillor" | "mayor" | "premier" | "prime-minister";
type SponsorData = {
	sponsors: Record<SponsorTier, Organization[]>;
	collaborators: Organization[];
};
export const VISIBLE_SPONSOR_ROWS: SponsorTier[][] = [["prime-minister"], ["premier"], ["mayor", "councillor"]];

export const sponsorData: SponsorData = {
	sponsors: {
		"prime-minister": [
			{ href: "https://ciena.ca/", src: Ciena, alt: "Ciena" },
			{ href: "https://www.rossvideo.com/", src: Ross, alt: "Ross" },
		],
		premier: [
			{ href: "https://blackberry.com/", src: Blackberry, alt: "BlackBerry" },
			{ href: "https://canadiantire.ca/", src: CanadianTire, alt: "Canadian Tire" },
		],
		mayor: [
			{ href: "https://lonehaven.com/", src: Lonehaven, alt: "Lonehaven" },
			{ href: "https://www.cse-cst.gc.ca/", src: CSE, alt: "CSE / CST" },
		],
		councillor: [
			{ href: "https://redbull.com/", src: Redbull, alt: "Redbull" },
			{ href: "https://www.liquid-iv.com/", src: LiquidIV, alt: "LiquidIV" },
			{ href: "https://www.fantuan.ca/", src: Fantuan, alt: "Fantuan" },
		],
	},
	collaborators: [
		{ href: "https://www2.uottawa.ca/en", src: uOttawa, alt: "University of Ottawa" },
		{ href: "https://carleton.ca/", src: Carleton, alt: "Carleton University" },
		{ href: "https://www.essaeg.ca/", src: ESS, alt: "uOttawa Engineering Students' Society" },
		{ href: "https://www.facebook.com/uottawaeeffdg/", src: EEF, alt: "Engineering Endowment Fund" },
		{ href: "https://ieeeuottawa.ca/", src: uOttawaIEEE, alt: "IEEE uOttawa Student Branch" },
		{ href: "https://wie.ieeeottawa.ca/", src: WIE, alt: "Women in Engineering uOttawa" },
		{ href: "https://www.scesoc.ca/", src: SCESoc, alt: "Carleton Systems and Computer Engineering Society" },
		{ href: "https://www.sesa-aegl.ca/", src: SESA, alt: "uOttawa Software Engineering Students' Association" },
		{ href: "https://ccss.carleton.ca/", src: CCSS, alt: "Carleton Computer Science Society" },
		{ href: "https://www.cssa-aei.ca/", src: CSSA, alt: "Computer Science Students' Association" },
		{ href: "https://ieeecarleton.ca/", src: CarletonIEEE, alt: "IEEE Carleton University" },
		{ href: "https://www.telferbta.com/", src: telferBTA, alt: "Telfer Business Technology Association" },
		{ href: "https://www.uogdc.com/", src: uOGDC, alt: "uOttawa Game Development Club" },
		{ href: "https://uocybersec.com/", src: uOCyberSec, alt: "uOttawa Cybersecurity Club" },
		{ href: "https://linktr.ee/uoengiqueers", src: uOEngiqueers, alt: "uOttawa EngiQueers" },
		{ href: "https://linktr.ee/desoc", src: DEsocCarleton, alt: "Carleton Department of Electronics Society" },
		{
			href: "https://www.uottawa.ca/faculty-engineering/centre-entrepreneurship-engineering-design",
			src: Ceed,
			alt: "uOttawa CEED",
		},
		{
			href: "https://www.uottawa.ca/faculty-law/common-law/centre-environmental-law-global-sustainability",
			src: Law,
			alt: "uOttawa Centre for Environmental Law and Global Sustainability",
		},
		{ href: "https://uocsclub.net/", src: CSClub, alt: "uOttawa Computer Science Club" },
		{ href: "https://linktr.ee/uottawaesports", src: uOttawaEsports, alt: "uOttawa Esports" },
	],
};
