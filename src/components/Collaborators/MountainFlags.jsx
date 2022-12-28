import fs from "fs";
import path from "path";
import { useEffect, useRef } from "react";

// This is a hack to get the SVG to work on both the server and the client
let mountainFlags = "";
if (typeof window === "undefined") {
	mountainFlags = fs.readFileSync(path.resolve("public/SVGs/mountain-flags.svg"));
} else {
	mountainFlags = await (await fetch("/SVGs/mountain-flags.svg")).text();
}

function MountainFlags({ data }) {
	const mountain = useRef(null);

	useEffect(() => {
		const svg = mountain.current;
		svg.innerHTML = mountainFlags;

		data.forEach(item => {
			const element = svg?.querySelector(`#${item.id}`);
			if (!element) return;
			element.outerHTML = `<a href="${item.href}" target="_blank" rel="noopener noreferrer">
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
