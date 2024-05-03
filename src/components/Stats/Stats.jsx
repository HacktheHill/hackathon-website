import React, { useEffect } from "react";
import hacker from "../../assets/icons/hacker.svg";
import team from "../../assets/icons/team.svg";
import cash from "../../assets/icons/cash.svg";
import drink from "../../assets/icons/drink.svg";
import tool from "../../assets/icons/tool.svg";
import { t } from "../../i18n";

export default function Stats() {
	return (
		<div className="w-full flex flex-col gap-16 justify-center items-center">
			<div className="flex flex-col px-8 gap-4 text-center basis-1/2 lg:mt-16">
				<h1>{t("stats.title")}</h1>
				<h2>{t("stats.subtitle")}</h2>
			</div>
			<div className="grid gap-4 grid-rows-12 grid-cols-12 w-full px-32 max-w-2xl md:flex md:flex-col xl:px-4 md:gap-2">
				<div className="flex flex-col md:flex-row justify-between items-start gap-8 bg-[#020106] overflow-hidden rounded-3xl p-8 row-start-1 col-start-1 row-end-6 col-end-6">
					<img
						className="box-border h-20 w-20 aspect-square object-cover rounded-[50%] shadow-glow"
						src={hacker.src}
						alt={"Hacker"}
					/>
					<div className="md:text-end md:self-center">
						<h3>600+</h3>
						<p>Hackers</p>
					</div>
				</div>
				<div className="flex flex-col md:flex-row justify-start items-between bg-blur-svg rounded-3xl p-8 row-start-1 col-start-6 row-end-5 col-end-13">
					<h3>{t("stats.description")}</h3>
				</div>
				<div className="flex flex-col md:flex-row justify-between items-start gap-8 bg-blur-svg  overflow-hidden rounded-3xl p-8 row-start-6 col-start-1 row-end-11 col-end-6">
					<img
						className="box-border h-20 w-20 aspect-square object-cover rounded-[50%] shadow-glow"
						src={team.src}
						alt={"Team"}
					/>
					<div className="md:text-end md:self-center">
						<h3>15+</h3>
						<p>{t("stats.sponsors")}</p>
					</div>
				</div>
				<div className="flex flex-col md:flex-row justify-between items-start gap-8 bg-[#020106] overflow-hidden rounded-3xl p-8 row-start-5 col-start-6 row-end-9 col-end-10">
					<img
						className="box-border h-20 w-20 aspect-square object-cover rounded-[50%] shadow-glow"
						src={team.src}
						alt={"Team"}
					/>
					<div className="md:text-end md:self-center">
						<h3>100+</h3>
						<p>{t("stats.volunteers")}</p>
					</div>
				</div>
				<div className="flex flex-col md:flex-row justify-between items-start gap-8 bg-[#020106] overflow-hidden rounded-3xl p-8 row-start-5 col-start-10 row-end-9 col-end-13">
					<img
						className="box-border h-20 w-20 aspect-square object-cover rounded-[50%] shadow-glow"
						src={cash.src}
						alt={"Cash"}
					/>
					<div className="md:text-end md:self-center">
						<h3>$35k+</h3>
						<p>{t("stats.prizes")}</p>
					</div>
				</div>
				<div className="flex flex-row justify-between items-start gap-8 bg-[#020106] overflow-hidden rounded-3xl p-8 row-start-9 col-start-6 row-end-11 col-end-13">
					<img
						className="box-border h-20 w-20 aspect-square object-cover rounded-[50%] shadow-glow"
						src={tool.src}
						alt={"Tool"}
					/>
					<div className="text-end self-center">
						<h3>5+</h3>
						<p>{t("stats.workshops")}</p>
					</div>
				</div>
				<div className="flex flex-row justify-between items-start gap-8 bg-[#020106] overflow-hidden rounded-3xl p-8 row-start-11 col-start-1 row-end-13 col-end-13">
					<img
						className="box-border h-20 w-20 aspect-square object-cover rounded-[50%] shadow-glow"
						src={drink.src}
						alt={"Drink"}
					/>
					<div className="text-end self-center">
						<h3>1000+</h3>
						<p>{t("stats.redbulls")}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
