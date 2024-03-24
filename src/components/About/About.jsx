import React from "react";
import { t } from "../../i18n";

export default function About() {
	return (
		<>
			<div className="flex w-full px-20 py-12 mt-10 ">
				<div className="flex-grow p-10">
					<div className="ml-12">
						<p className="w-2/3 text-2xl mb-12 px-6 py-2 font-bold">It's more than just a hackathon</p>
						<div className="w-6/7 text-pretty p-3 ">
							<p className="">
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
							</p>
							<p className="mb-5">molestiae quas vel sint commodi repudiandae.</p>
							<p className="mb-5">
								numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
							</p>
							<p className="mb-5">optio, eaque rerum! Provident similique accusantium nemo autem.</p>
						</div>
					</div>
				</div>
				<div className="flex-grow">
					<div className=" relative w-full" style={{ height: "400px", width: "600px" }}>
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
