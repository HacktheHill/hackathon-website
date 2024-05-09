import React, { useState } from "react";
import { t } from "../../i18n";
import team1 from "../../assets/about/team1.webp";
import team3 from "../../assets/about/team3.webp";
import Button from "../Button/Button";
import hackhers2 from "../../assets/gallery/hackhers2.webp";
import shape from "../../assets/patterns/ssshape.svg";

export default function About() {
	const podcastLink =
		"https://www.youtube.com/embed/videoseries?si=ZobjNMvDAoBIorPw&controls=0&list=PLvXySQVib-mmNoOeoORHRGz2UyeSEgj7Q&autoplay=1&loop=1&mute=0";
	const thumbnailLink = "https://img.youtube.com/vi/IQSd2UsGvrU/hqdefault.jpg";

	return (
		<>
			<div className="w-full bg-background-dark flex justify-center items-center">
				<div className="flex flex-col w-10/12 h-full justify-center items-center gap-36 py-36 text-center max-w-2xl">
					<div className="flex flex-col text-start w-full" data-aos="fade-up" data-aos-once="false">
						<h1>{t("about.title")}</h1>
						<h3 className="text-shadow_text">{t("about.subtitle")}</h3>
					</div>
					<div className="flex h-4/6 flex-row justify-between items-center flex-wrap lg:gap-8 px-8">
						<div className="flex flex-col w-6/7 text-pretty text-left z-[1]">
							<div className="grid grid-rows-1 grid-cols-2 gap-x-20 md:flex md:flex-col md:gap-y-20">
								<div
									className="row-start-1 col-start-2 row-end-1 col-end-3 self-center flex flex-col gap-8"
									data-aos="fade-up"
									data-aos-duration="1000"
									data-aos-once="false"
								>
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
								<div
									className="row-start-1 col-start-1 row-end-1 col-end-2 bg-blur-svg overflow-visible rounded-3xl p-4"
									data-aos="fade-right"
									data-aos-once="false"
								>
									<img {...team1} className="w-full h-full object-cover rounded-2xl" alt="HackHers" />
								</div>
							</div>

							<div
								className="row-start-3 col-start-1 row-end-4 col-end-3 grid grid-cols-6 justify-center overflow-visible"
								data-aos="fade-up-right"
								data-aos-once="false"
							>
								<svg className="col-start-2 col-end-6 opacity-25" viewBox="0 0 200 50">
									<line
										x1="20"
										y1="4"
										x2="20"
										y2="29"
										stroke="#ffffff"
										strokeDasharray="7,7"
										strokeWidth="1.5"
										strokeLinecap="round"
									/>
									<line
										x1="20"
										y1="25"
										x2="180"
										y2="25"
										stroke="#ffffff"
										strokeDasharray="7,7"
										strokeWidth="1.5"
										strokeLinecap="round"
									/>
									<line
										x1="180"
										y1="25"
										x2="180"
										y2="50"
										stroke="#ffffff"
										strokeDasharray="7,7"
										strokeWidth="1.5"
										strokeLinecap="round"
									/>
								</svg>
							</div>
							<div className="grid grid-cols-2 gap-x-20 md:flex md:flex-col md:gap-y-20">
								<div
									className="col-start-1 col-end-2 self-center flex flex-col gap-8"
									data-aos="fade-up"
									data-aos-duration="1000"
									data-aos-once="false"
								>
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
								<div
									className="col-start-2 col-end-3  bg-blur-svg overflow-visible rounded-3xl p-4"
									data-aos="fade-left"
									data-aos-once="false"
								>
									<img {...team3} className="w-full h-full object-cover rounded-2xl" alt="HackHers" />
								</div>
							</div>
							<div
								className="row-start-3 col-start-1 row-end-4 col-end-3 grid grid-cols-6 justify-center overflow-visible"
								data-aos="fade-up-left"
								data-aos-once="false"
							>
								<svg className="col-start-2 col-end-6 opacity-25" viewBox="0 0 200 50">
									<line
										x1="20"
										y1="25"
										x2="20"
										y2="50"
										stroke="#ffffff"
										strokeDasharray="7,7"
										strokeWidth="1.5"
										strokeLinecap="round"
									/>
									<line
										x1="20"
										y1="25"
										x2="180"
										y2="25"
										stroke="#ffffff"
										strokeDasharray="7,7"
										strokeWidth="1.5"
										strokeLinecap="round"
									/>
									<line
										x1="180"
										y1="4"
										x2="180"
										y2="29"
										stroke="#ffffff"
										strokeDasharray="7,7"
										strokeWidth="1.5"
										strokeLinecap="round"
									/>
								</svg>
							</div>
							<div className="grid grid-cols-2 gap-x-20 md:flex md:flex-col md:gap-y-20">
								<div
									className=" row-start-7 col-start-2 row-end-9 col-end-3 self-center flex flex-col gap-8"
									data-aos="fade-up"
									data-aos-duration="1000"
									data-aos-once="false"
								>
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
								<div
									className="row-start-7 col-start-1 row-end-9 col-end-2 bg-blur-svg overflow-visible rounded-3xl p-4"
									data-aos="fade-right"
									data-aos-once="false"
								>
									<img
										{...hackhers2}
										className="w-full h-full object-cover rounded-2xl"
										alt="HackHers"
									/>
								</div>
							</div>
						</div>
					</div>
					<img
						src={shape.src}
						alt="shape"
						className="w-full max-w-bg-deco opacity-35 absolute z-[0] translate-x-1/2 translate-y-24"
					/>
					<img
						src={shape.src}
						alt="shape"
						className="w-full max-w-bg-deco opacity-35 absolute z-[0] -translate-x-1/2 -translate-y-1/4"
					/>
					<img
						src={shape.src}
						alt="shape"
						className="w-full max-w-bg-deco opacity-35 absolute z-[0] -translate-x-1/2 translate-y-3/4 -scale-y-100"
					/>
				</div>
			</div>
		</>
	);
}
