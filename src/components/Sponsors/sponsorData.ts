import CAIS from "@/assets/Logos/CAIS.svg?url";
import Backboard from "@/assets/Logos/Backboard.svg?url";
import CGI from "@/assets/Logos/CGI.svg?url";
import Ciena from "@/assets/Logos/Ciena.svg?url";
import EEF from "@/assets/Logos/EEF.svg?url";
import ElevenLabs from "@/assets/Logos/ElevenLabs.svg?url";
import ESS from "@/assets/Logos/ESS.svg?url";
import MathemaTech from "@/assets/Logos/MathemaTech.svg?url";
import SESA from "@/assets/Logos/SESA.svg?url";
import UOSU from "@/assets/Logos/UOSU.svg?url";
import uODPA from "@/assets/Logos/uODPA.svg?url";
import uOttawa from "@/assets/Logos/uOttawa.svg?url";
import uOttawaIEEE from "@/assets/Logos/uOttawaIEEE.svg?url";

export const SNOWBANKS = Array.from({ length: 7 }, (_, index) => `/art/sponsors/snowbank-${index + 1}.webp`);

type Organization = { href?: string; src: string; alt: string };
type SponsorTier = "small" | "large" | "largest";
type SponsorData = {
	sponsors: Record<SponsorTier, Organization[]>;
	collaborators: Organization[];
};

export const VISIBLE_SPONSOR_ROWS: SponsorTier[][] = [["largest"], ["large"], ["small"]];

export const sponsorData: SponsorData = {
	sponsors: {
		largest: [{ href: "https://www.cgi.com/", src: CGI, alt: "CGI" }],
		large: [
			{ href: "https://www.ciena.ca/", src: Ciena, alt: "Ciena" },
			{ href: "https://www.seuo-uosu.com/", src: UOSU, alt: "UOSU" },
		],
		small: [
			{ href: "https://elevenlabs.io/", src: ElevenLabs, alt: "ElevenLabs" },
			{ href: "https://backboard.io/", src: Backboard, alt: "Backboard" },
			{ href: "https://www.facebook.com/uottawaeeffdg/", src: EEF, alt: "Engineering Endowment Fund" },
			{ href: "https://mthm.tech", src: MathemaTech, alt: "MathemaTech" },
		],
	},
	collaborators: [
		{ href: "https://www.uottawa.ca/en", src: uOttawa, alt: "uOttawa" },
		{ href: "https://www.essaeg.ca/", src: ESS, alt: "Engineering Students' Society" },
		{ href: "https://ieeeuottawa.ca/", src: uOttawaIEEE, alt: "IEEE uOttawa" },
		{ href: "https://www.sesa-aegl.ca/", src: SESA, alt: "Software Engineering Students' Association" },
		{ href: "https://uodpa-apnuo.org/", src: uODPA, alt: "uODPA APNuO" },
		{ href: "https://carletonai.com/", src: CAIS, alt: "Carleton AI Society" },
	],
};
