import "./Collaborators.css";
import { ReactComponent as Mountain } from "../../assets/Logos/mountain_flags.svg";
import { useEffect, useRef } from "react";

const data = [
	{ id: "wie", href: "https://wie.ieeeottawa.ca/" },
	{ id: "ieee", href: "https://ieeeuottawa.ca/" },
	{ id: "sesa", href: "https://www.uottawasesa.ca/" },
	{ id: "cssa", href: "https://www.cssa-aei.ca/" },
	{ id: "ess", href: "https://www.essaeg.ca/" },
];

function Collaborators() {
	const mountain = useRef(null);

	useEffect(() => {
		const svg = mountain.current;

		data.forEach(item => {
			const element = svg.querySelector(`#${item.id}`);
			if (!element) return;
			element.outerHTML = `<a href="${item.href}" target="_blank" rel="noopener noreferrer">
				${element.outerHTML}
			</a>`;
		});

		return () => {
			svg.querySelectorAll("a").forEach(a => {
				a.outerHTML = a.innerHTML;
			});
		};
	}, []);

	return (
		<div id="Collaborators" className="Collaborators">
			<h1>Collaborators </h1>
			<Mountain className="Mountain" ref={mountain} />
		</div>
	);
}

export default Collaborators;
