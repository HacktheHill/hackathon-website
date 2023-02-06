import "./Collaborators.css";
import MountainFlags from "./MountainFlags";
import { useTranslation, Trans } from "react-i18next";
import "../Localization/i18n";

const data = [
	{ id: "wie", href: "https://wie.ieeeottawa.ca/" },
	{ id: "ieee", href: "https://ieeeuottawa.ca/" },
	{ id: "sesa", href: "https://www.uottawasesa.ca/" },
	{ id: "cssa", href: "https://www.cssa-aei.ca/" },
	{ id: "ess", href: "https://www.essaeg.ca/" },
];

function Collaborators() {
	const { t, i18n } = useTranslation();

	return (
		<>
			<h1 id="collaborators" className="collaborators">
				{t("collaborators.title")}
			</h1>
			<MountainFlags data={data} />
		</>
	);
}

export default Collaborators;
