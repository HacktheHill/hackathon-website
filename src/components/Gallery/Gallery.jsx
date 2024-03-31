import React, { useState, useEffect } from "react";
import Button from "../Button/Button";
import { t } from "../../i18n";
import "../../global.css";

import AOS from "aos";
import "aos/dist/aos.css";

export default function Gallery() {
	const [activeFolder, setActiveFolder] = useState("2023");
	const [selectedAlbum, setSelectedAlbum] = useState("2023");
	useEffect(() => {
		AOS.init({ once: true, duration: 650 });
	}, []);

	const albums = t("gallery.albums");

	const handleCardClick = async tag => {
		setActiveFolder(tag);
		const frames = document.querySelectorAll(".aos-frame");
		frames.forEach(frame => {
			frame.classList.remove("aos-animate");
		});
		await setTimeout(() => {
			frames.forEach(frame => {
				frame.classList.add("aos-animate");
			});
			setSelectedAlbum(tag);
		}, 500);
	};

	return (
		<div className="w-full bg-shade-9 justify-center items-center bg-pentagon-svg bg-center bg-cover bg-no-repeat ">
			<div className="flex flex-col w-full h-full justify-center items-center gap-16 py-36 text-center">
				<div className="flex flex-col px-8 gap-4">
					<h1>{t("gallery.title")}</h1>
					<h2>{t("gallery.subtitle")}</h2>
				</div>
				<div className="flex w-9/12 h-4/6 flex-row justify-between items-center flex-wrap xl:gap-16 xl:w-11/12">
					<div className="flex basis-3/12 justify-start items-center flex-wrap gap-6 xl:basis-full xl:justify-center">
						{albums.map(album => (
							<div
								key={album.tag}
								onClick={() => {
									handleCardClick(album.tag);
								}}
								className="flex flex-col justify-center items-center gap-2 w-24 h-24 cursor-pointer"
							>
								<div>
									<div
										className={`w-14 h-14 border-2 bg-opacity-50 rounded-sm ${
											album.tag === activeFolder
												? "border-primary bg-primary "
												: "border-light_accent bg-light_accent"
										}`}
									>
										<div
											className={`absolute w-14 h-14 border-2 bg-opacity-50 rounded-sm transition-all duration-300 ${
												album.tag === activeFolder
													? "border-primary bg-primary -translate-y-3 -translate-x-3"
													: "border-light_accent bg-light_accent -translate-y-1.5 -translate-x-1.5 hover:-translate-y-2 tran hover:-translate-x-2"
											}`}
										></div>
									</div>
								</div>
								<p className="cursor-pointer">{album.tag}</p>
							</div>
						))}
					</div>
					<div
						className="basis-8/12 h-gallery grid grid-rows-12 grid-cols-12 gap-2 xl:basis-full xs:flex xs:flex-col aos-frame aos-animate"
						data-aos="zoom-in"
					>
						<div className="border-2 bg-opacity-100 border-shade-3 rounded-sm bg-shade-8 z-10 gap-4 px-4 py-8 flex flex-col justify-between col-start-1 col-end-6 row-start-3 row-end-12">
							<div className="flex flex-col justify-start items-start gap-4">
								<h3 className="font-bold">{albums.find(album => album.tag === selectedAlbum).title}</h3>
								<p className="text-start text-sm md:text-xs">
									{albums.find(album => album.tag === selectedAlbum).description}
								</p>
							</div>
							<div className="flex justify-end">
								<Button
									onClick={() =>
										window.open(albums.find(album => album.tag === selectedAlbum).link, "_blank")
									}
								>
									{t("gallery.button_text")}
								</Button>
							</div>
						</div>
						<div
							className="border-2 bg-opacity-50 border-shade-3 rounded-sm bg-light_accent col-start-5 col-end-12 row-start-1 row-end-7 xs:h-36 aos-frame aos-animate"
							data-aos="zoom-in"
						>
							<img
								src={albums.find(album => album.tag === selectedAlbum).img1}
								alt="gallery"
								className="w-full h-full object-cover"
							/>
						</div>
						<div
							className="border-2 bg-opacity-50 border-shade-3 rounded-sm bg-light_accent col-start-5 col-end-13 row-start-7 row-end-13 xs:h-36 aos-frame aos-animate"
							data-aos="zoom-in"
						>
							<img
								src={albums.find(album => album.tag === selectedAlbum).img2}
								alt="gallery"
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
