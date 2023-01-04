import fs from "fs";
import path from "path";

// This is a hack to get the SVG to work on both the server and the client
let hero = "";
if (typeof window === "undefined") {
	hero = fs.readFileSync(path.resolve("public/SVGs/hackthehill-hero.svg"));
} else {
	hero = await (await fetch("/SVGs/hackthehill-hero.svg")).text();
}

function HeroImg() {
	return (
		<div
			className="HeroImg"
			dangerouslySetInnerHTML={{
				__html: hero,
			}}
		></div>
	);
}

export default HeroImg;
