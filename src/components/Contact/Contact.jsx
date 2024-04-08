import React from "react";
import { t } from "../../i18n";
import "../../global.css";
import maple_leaf from "../../assets/SVGs/maple_leaf.svg";

export default function Contact() {
	return (
		<div className="flex flex-wrap justify-between w-full bg-square-svg bg-center bg-cover bg-no-repeat bg-fixed p-32 2xl:p-24 xl:p-20 xl:gap-8 md:p-8">
			<div className="flex flex-col basis-1/3 gap-16 xl:w-full xl:basis-full xl:gap-4 lg:gap-0 sm:gap-4">
				<div className="flex flex-row justify-between items-center w-full gap-16 md:gap-4 sm:gap-2">
					<h1 className="text-5xl md:text-4xl sm:text-3xl">{t("contact.title")}</h1>
					<img {...maple_leaf} className="md:size-20 sm:size-16"></img>
				</div>
				<p className="text-2xl whitespace-pre-line w-full pr-16 xl:text-lg xl:pr-0 md:text-sm sm:text-xs">
					{t("contact.description")}
				</p>
			</div>
			<form className="grid grid-rows-8 grid-cols-12 justify-center items-center basis-3/5 gap-6 pt-16 xl:w-full xl:basis-full xl:pt-0 xl:pl-0 xl:gap-4">
				<input
					type="text"
					placeholder={t("contact.name")}
					className="col-span-6 row-span-1 h-full w-full rounded-xl bg-primary bg-opacity-20 outline outline-2 outline-light_accent p-4 text-lg xl:text-base lg:text-sm sm:text-xs hover:bg-opacity-35 focus:bg-opacity-35 focus:outline-light_accent/75"
				/>
				<input
					type="text"
					placeholder={t("contact.email")}
					className="col-span-6 row-span-1 h-full w-full rounded-xl bg-primary bg-opacity-20 outline outline-2 outline-light_accent p-4 text-lg xl:text-base lg:text-sm sm:text-xs hover:bg-opacity-35 focus:bg-opacity-35 focus:outline-light_accent/75"
				/>
				<input
					type="text"
					placeholder={t("contact.subject")}
					className="col-span-12 row-span-1 h-full w-full rounded-xl bg-primary bg-opacity-20 outline outline-2 outline-light_accent p-4 text-lg xl:text-base lg:text-sm sm:text-xs hover:bg-opacity-35 focus:bg-opacity-35 focus:outline-light_accent/75"
				/>
				<textarea
					type="text"
					placeholder={t("contact.message")}
					className="col-span-12 row-span-5 h-full w-full rounded-xl bg-primary bg-opacity-20 outline outline-2 outline-light_accent p-4 text-lg resize-none xl:text-base lg:text-sm sm:text-xs hover:bg-opacity-35 focus:bg-opacity-35 focus:outline-light_accent/75"
				/>
				<button
					type="submit"
					className="col-start-8 col-span-5 row-span-1 h-full w-full rounded-xl bg-primary bg-opacity-20 outline outline-2 outline-light_accent text-2xl font-bold xl:col-start-5 xl:col-span-4 xl:text-xl lg:text-lg sm:text-base hover:bg-opacity-35"
				>
					{t("contact.submit")}
				</button>
			</form>
		</div>
	);
}
