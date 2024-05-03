import React, { useState } from "react";
import { t } from "../../i18n";
import chevron from "../../assets/icons/chevron.svg";
import chevron_white from "../../assets/icons/chevron_white.svg";
import "../../global.css";
import "./Button.css";

export default function Button({ children, onClick, fill = true }) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<button
			className={`backface flex flex-col items-center justify-center border-none no-underline text-center cursor-pointer rounded-md transition-all duration-200 py-2
			${fill ? "text-black bg-white hover:bg-button_hover" : "text-white bg-none"}`}
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="flex justify-center items-center gap-1.5 pl-6 pr-4">
				<span className={`font-medium text-sm h-full ${!fill && "translate-y-[0.2rem]"}`}>
					<div>
						{children}
						{!fill && (
							<div
								className={`backface w-full h-0.5 mt-1 rounded-sm transition-all duration-200 ${
									fill ? "bg-none" : isHovered ? "bg-white" : "bg-none"
								}`}
							/>
						)}
					</div>
				</span>
				<span className="h-full w-6 flex justify-center items-center gap-1">
					<img
						src={fill ? chevron.src : chevron_white.src}
						alt="chevron"
						className={`backface transition-all duration-200 scale-100 ${
							isHovered ? "opacity-100 translate-x-1" : "opacity-0 translate-x-2"
						}
							${fill ? "filter-none" : "filter-invert"}`}
						width="8px"
					/>
					<img
						src={fill ? chevron.src : chevron_white.src}
						alt="chevron"
						className={`backface transition-all duration-200 scale-100 ${
							isHovered ? "-translate-x-0" : "-translate-x-1"
						} ${fill ? "filter-none" : "filter-invert"}`}
						width="8px"
					/>
				</span>
			</div>
		</button>
	);
}
