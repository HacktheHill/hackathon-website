import React, { useState } from "react";
import { t } from "../../i18n";
import team1 from "../../assets/about/team1.webp";
import team3 from "../../assets/about/team3.webp";
import Button from "../Button/Button";
import hackhers2 from "../../assets/gallery/hackhers2.webp";

export default function About() {
	const podcastLink =
		"https://www.youtube.com/embed/videoseries?si=ZobjNMvDAoBIorPw&controls=0&list=PLvXySQVib-mmNoOeoORHRGz2UyeSEgj7Q&autoplay=1&loop=1&mute=0";
	const thumbnailLink = "https://img.youtube.com/vi/IQSd2UsGvrU/hqdefault.jpg";

	return (
		<>
			<div className="w-full bg-[#0d1117] flex justify-center items-center">
				<div className="flex flex-col w-10/12 h-full justify-center items-center gap-36 py-36 text-center max-w-2xl">
					<div className="flex flex-col text-start w-full">
						<h1>{t("about.title")}</h1>
						<h3 className="text-shadow_text">{t("about.subtitle")}</h3>
					</div>
					<div className="flex h-4/6 flex-row justify-between items-center flex-wrap lg:gap-8 px-8">
						<div className="flex flex-col gap-32 w-6/7 text-pretty text-left">
							<div className="grid grid-rows-3 grid-cols-2 gap-y-36 gap-x-20 md:flex md:flex-col md:gap-y-20">
								<div className="row-start-1 col-start-2 row-end-1 col-end-2 self-center flex flex-col gap-8">
									<h3>
										<span>{t("about.p1_prefix")}</span>
										<span className="text-shadow_text"> {t("about.p1")}</span>
									</h3>
									<div className="self-start">
										<Button
											onClick={() =>
												window.open("https://www.instagram.com/hackthehill", "_blank")
											}
											fill={false}
										>
											<h4>{t("about.p1_btn")}</h4>
										</Button>
									</div>
								</div>
								<div className="row-start-1 col-start-1 row-end-1 col-end-1 bg-blur-svg overflow-hidden rounded-3xl p-4">
									<img {...team1} className="w-full h-full object-cover rounded-2xl" alt="HackHers" />
								</div>
								<div className="row-start-2 col-start-1 row-end-2 col-end-1 self-center flex flex-col gap-8">
									<h3>
										<span>{t("about.p2_prefix")}</span>
										<span className="text-shadow_text"> {t("about.p2")}</span>
									</h3>
									<div className="self-start">
										<Button fill={false}>
											<a href={"/events"} target="_blank" rel="noreferrer">
												<h4>{t("about.p2_btn")}</h4>
											</a>
										</Button>
									</div>
								</div>
								<div className="row-start-2 col-start-2 row-end-2 col-end-2  bg-blur-svg overflow-hidden rounded-3xl p-4">
									<img {...team3} className="w-full h-full object-cover rounded-2xl" alt="HackHers" />
								</div>
								<div className=" row-start-3 col-start-2 row-end-3 col-end-2 self-center flex flex-col gap-8">
									<h3>
										<span>{t("about.p3_prefix")}</span>
										<span className="text-shadow_text"> {t("about.p3")}</span>
									</h3>
									<div className="self-start">
										<Button
											onClick={() => window.open("https://linktr.ee/hackthehill", "_blank")}
											fill={false}
										>
											<h4>{t("about.p3_btn")}</h4>
										</Button>
									</div>
								</div>
								<div className="row-start-3 col-start-1 row-end-3 col-end-1 bg-blur-svg overflow-hidden rounded-3xl p-4">
									<img
										{...hackhers2}
										className="w-full h-full object-cover rounded-2xl"
										alt="HackHers"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
