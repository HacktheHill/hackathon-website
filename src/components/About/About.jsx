import React, { useState } from "react";
import { t } from "../../i18n";
import about1 from "../../assets/about/about1.webp";

export default function About() {
	const podcastLink =
		"https://www.youtube.com/embed/videoseries?si=ZobjNMvDAoBIorPw&controls=0&list=PLvXySQVib-mmNoOeoORHRGz2UyeSEgj7Q&autoplay=1&loop=1&mute=0";
	const thumbnailLink = "https://img.youtube.com/vi/IQSd2UsGvrU/hqdefault.jpg";

	return (
		<>
			<div className="w-full bg-shade-9 justify-center items-center bg-mountains-svg bg-center bg-cover bg-no-repeat">
				<div className="flex flex-col w-full h-full justify-center items-center gap-16 py-36 text-center">
					<div className="flex flex-col px-8 gap-4">
						<h1>{t("about.title")}</h1>
						<h2>{t("about.subtitle")}</h2>
					</div>
					<div className="flex w-9/12 h-4/6 flex-row justify-between items-center flex-wrap lg:gap-8 lg:w-11/12">
						<div className="flex basis-5/12 justify-start items-center flex-wrap gap-8 lg:basis-full lg:justify-center">
							<div
								className="flex flex-col gap-4 w-6/7 text-pretty text-left border-2 border-shade-3 rounded-sm bg-shade-8 px-4 py-8"
								data-aos="zoom-in"
								data-aos-duration="800"
							>
								<p className="font-bold">About us</p>
								<p>{t("about.p1")}</p>
								<p>
									<span>
										<span className="font-bold">{t("about.goal")}</span> {t("about.p2")}
									</span>
								</p>
								<p>{t("about.p3")}</p>
								<p className="font-bold">{t("about.joinus")}</p>
							</div>
						</div>
						<div className="basis-6/12 h-gallery grid grid-rows-12 grid-cols-12 gap-2 lg:basis-full xs:flex xs:flex-col xs:gap-8 w-1/2">
							<div
								className="border-2 border-shade-3 rounded-sm col-start-1 col-end-10 row-start-1 row-end-6 shadow-grid-card"
								data-aos="zoom-in"
								data-aos-duration="800"
							>
								<img
									{...about1}
									className="w-full h-full object-cover "
									alt={t("about.images.about1.alt")}
								/>
							</div>
							<div
								className="border-2 bg-opacity-50 border-shade-3 rounded-sm bg-light_accent col-start-4 col-end-13 row-start-7 row-end-13 shadow-grid-card sm:h-56"
								data-aos="zoom-in"
								data-aos-duration="800"
							>
								<iframe
									src={podcastLink}
									title="Podcast"
									className="w-full h-full object-cover"
									srcDoc={`<style>*{padding:0;margin:0;overflow:hidden;width:100%;height:100%;object-fit:cover}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:3.5rem/1.5 sans-serif;color:#FFFFFF;text-shadow:0 0 0.5em red}</style><a href=${podcastLink} noreferrer"><img src=${thumbnailLink} alt='${t(
										"about.frame_alt",
									)}'><span>▶</span></a>`}
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									allowFullScreen
									loading="lazy"
								></iframe>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
