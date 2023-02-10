import "./Collaborators.css";
import MountainFlags from "./MountainFlags";

const data = [
	{ id: "wie", href: "https://wie.ieeeottawa.ca/" },
	{ id: "ieee", href: "https://ieeeuottawa.ca/" },
	{ id: "sesa", href: "https://www.uottawasesa.ca/" },
	{ id: "cssa", href: "https://www.cssa-aei.ca/" },
	{ id: "ess", href: "https://www.essaeg.ca/" },
];

function Collaborators() {
	return (
		<>
			<h1 id="collaborators" className="collaborators">
				Collaborators{" "}
			</h1>
			<MountainFlags data={data} />
		</>
	);
}

export default Collaborators;
