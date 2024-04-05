import React, { useState } from "react";
import { t } from "../../i18n";
//import about1 from "src/assets/about/about1.webp";
// import about2 from "src/assets/about/about2.webp";


export default function About() {

	const podcastLink =
		"https://www.youtube.com/embed/videoseries?si=ZobjNMvDAoBIorPw&controls=0&list=PLvXySQVib-mmNoOeoORHRGz2UyeSEgj7Q&autoplay=1&loop=1&mute=0";
	const thumbnailLink = "https://img.youtube.com/vi/IQSd2UsGvrU/hqdefault.jpg";

	const [activeImage, setActiveImage] = useState(2);

	const getImageClassName = index => {
		return `relative w-full h-full object-cover border-2 border-red-500 transition-all duration-300 hover:translate-x-[-5px] hover:translate-y-[-5px] hover:shadow-[4px_4px_0px_black] ${
			activeImage === index
				? "z-10 bg-opacity-50 border-shade-3 bg-light_accent active:translate-x-[0px] active:translate-y-[0px] active:shadow-none"
				: "z-0 cursor-pointer"
		}`;
	};

	const images = {
		about1: { src: "src/assets/about/about1.webp", alt: "Description for about1", className: getImageClassName(0), onClick: () => setActiveImage(0) },
		about2: { src: "src/assets/about/about2.webp", alt: "Description for about2", className: getImageClassName(1), onClick: () => setActiveImage(1)},
	  };

	return (
		<>
			<div className="w-full bg-shade-9 justify-center items-center bg-flat-mountains-svg bg-center bg-cover bg-no-repeat bg-fixed ">
				<div className="flex flex-col w-full h-full justify-center items-center gap-16 py-36 text-center">
				<div className="flex flex-col px-8 gap-4">
					<h1>{t("about.title")}</h1>
					<h2>{t("about.subtitle")}
					</h2>
				</div>
					<div className="flex w-9/12 h-4/6 flex-row justify-between items-center flex-wrap xl:gap-16 xl:w-11/12">
						<div className="flex basis-5/12 justify-start items-center flex-wrap gap-8 xl:basis-full xl:justify-center">
							<div className=" text-left ">
								<div className="w-6/7 text-pretty p-3 ">
									
									<p className="mb-5">
									{t("about.p1")}
									</p>
									<p className="mb-5">{t("about.p2")}</p>
									<p >
									{t("about.p3")}
									</p>
									
								</div>
							</div>
						</div>

						<div
							className="basis-6/12 h-gallery grid grid-rows-12 grid-cols-12 gap-2 xl:basis-full xs:flex xs:flex-col w-1/2"
							data-aos="fade-in" data-aos-duration="800"
						>
							<div className="border-2 border-shade-3 rounded-sm bg-light_accent shadow-grid-card col-start-1 col-end-9 row-start-9 row-end-13 xs:h-36"
							>
								<img
									{...images.about1}
								/>
							</div>
							<div
								className="border-2 border-shade-3 rounded-sm bg-light_accent shadow-grid-card col-start-1 col-end-6 row-start-1 row-end-6 xs:h-36"
							>
								<img
									{...images.about2}
								/>
							</div>
							<div
								className="border-2 border-shade-3 rounded-sm bg-light_accent shadow-grid-card col-start-5 col-end-13 row-start-4 row-end-10 xs:h-36"
							>
								<iframe
                                src={podcastLink}
								className={getImageClassName(2)}
								onClick={() => setActiveImage(2)}
								srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:56px/1.5 sans-serif;color:#FF3535;text-shadow:0 0 0.5em black}</style><a href=${podcastLink} noreferrer"><img src=${thumbnailLink} alt='${t("about.frame_alt")}'><span>▶</span></a>`}
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