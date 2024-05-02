import React, { useState, useEffect } from "react";
import Button from "../Button/Button";
import { t } from "../../i18n";
import hth1 from "/src/assets/gallery/hth1.webp";
import hth2 from "/src/assets/gallery/hth2.webp";
import hackhers1 from "/src/assets/gallery/hackhers1.webp";
import hackhers2 from "/src/assets/gallery/hackhers2.webp";
import panel1 from "/src/assets/gallery/panel1.webp";
import panel2 from "/src/assets/gallery/panel2.webp";
import roast1 from "/src/assets/gallery/roast1.webp";
import roast2 from "/src/assets/gallery/roast2.webp";
import ciena1 from "/src/assets/gallery/ciena1.webp";
import ciena2 from "/src/assets/gallery/ciena2.webp";
import "../../global.css";

import AOS from "aos";
import "aos/dist/aos.css";

export default function Gallery() {
	const [activeFolder, setActiveFolder] = useState("hackhers");
	const [selectedAlbum, setSelectedAlbum] = useState("hackhers");
	useEffect(() => {
		AOS.init({ once: true, duration: 700 });
	}, []);

	const albums = [
		{
			tag: "2023",
			card_title: t("gallery.albums.twentytwentythree.card_title"),
			title: t("gallery.albums.twentytwentythree.title"),
			description: t("gallery.albums.twentytwentythree.description"),
			img1: hth1,
			img2: hth2,
			link: "https://2023.hackthehill.com",
		},
		{
			tag: "hackhers",
			card_title: t("gallery.albums.hackhers.card_title"),
			title: t("gallery.albums.hackhers.title"),
			description: t("gallery.albums.hackhers.description"),
			img1: hackhers1,
			img2: hackhers2,
			link: "https://hackhers24.hackthehill.com",
		},
		{
			tag: "panel",
			card_title: t("gallery.albums.panel.card_title"),
			title: t("gallery.albums.panel.title"),
			description: t("gallery.albums.panel.description"),
			img1: panel1,
			img2: panel2,
			link: "https://www.linkedin.com/posts/hackthehill_step-into-the-tech-world-mark-your-calendars-activity-7125703991358836738-cpfF/?utm_source=share&utm_medium=member_desktop",
		},
		{
			tag: "roast",
			card_title: t("gallery.albums.roast.card_title"),
			title: t("gallery.albums.roast.title"),
			description: t("gallery.albums.roast.description"),
			img1: roast1,
			img2: roast2,
			link: "https://www.linkedin.com/posts/hackthehill_ignite-your-career-potential-at-resume-activity-7115750458224189440-7U2-/",
		},
		{
			tag: "ciena",
			card_title: t("gallery.albums.ciena.card_title"),
			title: t("gallery.albums.ciena.title"),
			description: t("gallery.albums.ciena.description"),
			img1: ciena1,
			img2: ciena2,
			link: "https://www.linkedin.com/posts/cuscesoc_cienanetworkingevent-networkingopportunities-ugcPost-7117633554410262528-tRz9/?utm_source=share&utm_medium=member_desktop",
		},
	];

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
		<div className="w-full flex justify-center items-center max-w-2xl">
			<div className="flex flex-col w-full h-full justify-center items-center gap-16 py-36 text-center max-w-2xl">
				<div className="flex flex-col px-8 gap-4">
					<h1>{t("gallery.title")}</h1>
					<h2>{t("gallery.subtitle")}</h2>
				</div>
				<div className="flex w-9/12 h-4/6 flex-row justify-between items-center flex-wrap xl:gap-16 xl:w-11/12">
					<div className="flex basis-3/12 justify-start items-center flex-wrap gap-8 xl:basis-full xl:justify-center">
						{albums.map(album => (
							<div
								key={album.tag}
								onClick={() => {
									handleCardClick(album.tag);
								}}
								className="flex flex-col justify-start items-center gap-2 w-24 h-24 cursor-pointer"
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
								<p className="cursor-pointer">{album.card_title}</p>
							</div>
						))}
					</div>
					<div
						className="basis-8/12 h-gallery grid grid-rows-12 grid-cols-12 gap-2 xl:basis-full xs:flex xs:flex-col aos-frame"
						data-aos="zoom-in"
					>
						<div className="border-2 bg-opacity-100 border-shade-3 rounded-sm bg-shade-8 z-20 gap-4 px-4 py-8 flex flex-col justify-between col-start-1 col-end-6 row-start-3 row-end-12">
							<div className="flex flex-col justify-start items-start gap-4">
								<h3 className="font-bold">
									{albums?.find(album => album.tag === selectedAlbum)?.title}
								</h3>
								<p className="text-start text-sm md:text-xs">
									{albums?.find(album => album.tag === selectedAlbum)?.description}
								</p>
							</div>
							<div className="flex justify-end">
								<Button
									onClick={() =>
										window.open(albums?.find(album => album.tag === selectedAlbum)?.link, "_blank")
									}
								>
									{t("gallery.button_text")}
								</Button>
							</div>
						</div>
						<div
							className="border-2 bg-opacity-50 border-shade-3 rounded-sm bg-light_accent col-start-5 col-end-12 row-start-1 row-end-7 xs:h-36 aos-frame shadow-grid-card"
							data-aos="zoom-in"
						>
							<img
								src={albums?.find(album => album.tag === selectedAlbum)?.img1.src}
								alt="gallery"
								className="w-full h-full object-cover object-left"
							/>
						</div>
						<div
							className="border-2 bg-opacity-50 border-shade-3 rounded-sm bg-light_accent col-start-5 col-end-13 row-start-7 row-end-13 xs:h-36 z-10 aos-frame shadow-grid-card"
							data-aos="zoom-in"
						>
							<img
								src={albums?.find(album => album.tag === selectedAlbum)?.img2.src}
								alt="gallery"
								className="w-full h-full object-cover object-left"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
