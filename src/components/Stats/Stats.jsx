import React, { useEffect } from "react";
import panels from "../../assets/SVGs/panels.svg";
import { t } from "../../i18n";

export default function Stats() {
	return (
		<div className="w-full bg-shade-9 bg-square-svg bg-center bg-cover bg-no-repeat">
			<div className="flex justify-center items-center mx-28 lg:flex-wrap gap-16 lg:mx-8">
				<div className="flex flex-col px-8 gap-4 lg:text-center basis-1/2">
					<h1>{t("stats.title")}</h1>
					<h2>{t("stats.subtitle")}</h2>
				</div>
				{/* 
				<div className="relative flex justify-end">
					<img className="h-full" src={panels.src} alt="panels" />
				</div>
				*/}
			</div>
		</div>
	);
}
