import { useEffect, useRef } from "react";
import mountainFlags from "../../assets/mountain-flags.svg?raw";

function MountainFlags({ data }) {
	const mountain = useRef(null);

	useEffect(() => {
		const svg = mountain.current;
		svg.innerHTML = mountainFlags;

		data.forEach(item => {
			const element = svg?.querySelector(`#${item.id}`);
			if (!element) return;
			element.outerHTML = `
			<a href="${item.href}" target="_blank" rel="noopener noreferrer" aria-label="${item.id.toUpperCase()}">
				${element.outerHTML}
			</a>`;
		});

		return () => {
			svg.innerHTML = "";
		};
	}, []);

	return <div ref={mountain} className="MountainFlags"></div>;
}

export default MountainFlags;
