import React, { useState } from "react";
import { t } from "../../i18n";
import chevron from "../../assets/icons/chevron.svg";
import "../../global.css";
import "./Button.css";

export default function Button({ children, onClick }) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<button
			className="backface flex flex-row items-center justify-center border-none no-underline text-center cursor-pointer rounded-md transition-all duration-200 py-2 text-black bg-white hover:bg-button_hover"
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="flex justify-center items-center gap-1.5 pl-6 pr-4">
				<span className="font-medium text-sm h-full">{children}</span>
				<span className="h-full w-6 flex justify-center items-center gap-1">
					<img
						{...chevron}
						alt="chevron"
						className={`backface transition-all duration-200 scale-100 ${
							isHovered ? "opacity-100 translate-x-1" : "opacity-0 translate-x-2"
						}`}
						width="8px"
					/>
					<img
						{...chevron}
						alt="chevron"
						className={`backface transition-all duration-200 scale-100 ${
							isHovered ? "-translate-x-0" : "-translate-x-1"
						}`}
						width="8px"
					/>
				</span>
			</div>
		</button>
	);
}
