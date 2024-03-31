import React from "react";
import { t } from "../../i18n";
import "../../global.css";

export default function Button({ children, onClick }) {
	return (
		<button
			className="flex flex-row items-center justify-center border-2 border-shade-7 no-underline text-center cursor-pointer rounded-lg transition-all duration-200 px-4 py-2 text-shade-1 bg-shade-7 hover:border-shade-6"
			onClick={onClick}
		>
			<p>{children}</p>
		</button>
	);
}
