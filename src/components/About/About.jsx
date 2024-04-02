import React from "react";
import { t } from "../../i18n";

export default function About() {
	return (
		<>
			<div className="flex w-full px-8 py-12 md:py-20 items-center justify-center p-5 bg-square-svg bg-center bg-cover bg-no-repeat bg-fixed outline-4 outline-dashed">
				<div className="w-4/5 max-w-screen-xl flex flex-wrap gap-4 mx-auto p-10">
					<div className="w-full p-3 outline-dashed">
						<p className="w-2/3 text-2xl font-bold mb-6 px-4 py-2 outline outline-dashed">
							It's more than just a hackathon
						</p>
						<div className="text-pretty outline outline-dashed">
							<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,</p>
							<p className="mb-5">molestiae quas vel sint commodi repudiandae.</p>
							<p className="mb-5">
								numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
							</p>
							<p className="mb-5">optio, eaque rerum! Provident similique accusantium nemo autem.</p>
						</div>
					</div>
				</div>
				<div className="flex-grow outline outline-dashed">
					<div className=" relative w-full h-auto md:h-100 outline outline-dashed">
						{/* Top-Left box */}
						<img
							src="src/components/About/Rectangle 15.png"
							alt="Description"
							className="absolute top-0 left-0 border-2 border-red-500 w-48 h-48"
						/>
						{/* Middle box */}
						<img
							src="src/components/About/Rectangle 16.png"
							alt="Description"
							className="absolute top-1/2 transform -translate-y-1/2 left-1/4 border-2 border-red-500 w-64 h-64"
						/>
						{/* Bottom-Left box */}
						<img
							src="src/components/About/Rectangle 17.png"
							alt="Description"
							className="absolute bottom-0 left-0 border-2 border-red-500 w-64 h-30"
						/>
					</div>
				</div>
			</div>
		</>
	);
}
