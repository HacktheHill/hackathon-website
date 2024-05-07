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
import hacker from "/src/assets/icons/hacker.svg";
import team from "/src/assets/icons/team.svg";
import cv from "/src/assets/icons/cv.svg";
import cube from "/src/assets/icons/cube.svg";
import handshake from "/src/assets/icons/handshake.svg";

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
			statNumber: "600+",
			statDescription: t("gallery.albums.twentytwentythree.stat"),
			icon: hacker,
		},
		{
			tag: "hackhers",
			card_title: t("gallery.albums.hackhers.card_title"),
			title: t("gallery.albums.hackhers.title"),
			description: t("gallery.albums.hackhers.description"),
			img1: hackhers1,
			img2: hackhers2,
			link: "https://hackhers24.hackthehill.com",
			statNumber: "15+",
			statDescription: t("gallery.albums.hackhers.stat"),
			icon: cube,
		},
		{
			tag: "panel",
			card_title: t("gallery.albums.panel.card_title"),
			title: t("gallery.albums.panel.title"),
			description: t("gallery.albums.panel.description"),
			img1: panel1,
			img2: panel2,
			link: "https://www.linkedin.com/posts/hackthehill_step-into-the-tech-world-mark-your-calendars-activity-7125703991358836738-cpfF/?utm_source=share&utm_medium=member_desktop",
			statNumber: "5",
			statDescription: t("gallery.albums.panel.stat"),
			icon: team,
		},
		{
			tag: "roast",
			card_title: t("gallery.albums.roast.card_title"),
			title: t("gallery.albums.roast.title"),
			description: t("gallery.albums.roast.description"),
			img1: roast1,
			img2: roast2,
			link: "https://www.linkedin.com/posts/hackthehill_ignite-your-career-potential-at-resume-activity-7115750458224189440-7U2-/",
			statNumber: "50+",
			statDescription: t("gallery.albums.roast.stat"),
			icon: cv,
		},
		{
			tag: "ciena",
			card_title: t("gallery.albums.ciena.card_title"),
			title: t("gallery.albums.ciena.title"),
			description: t("gallery.albums.ciena.description"),
			img1: ciena1,
			img2: ciena2,
			link: "https://www.linkedin.com/posts/cuscesoc_cienanetworkingevent-networkingopportunities-ugcPost-7117633554410262528-tRz9/?utm_source=share&utm_medium=member_desktop",
			statNumber: "200+",
			statDescription: t("gallery.albums.ciena.stat"),
			icon: handshake,
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
		<div className="w-full flex justify-center items-center">
			<div className="flex flex-col w-10/12 h-full justify-center items-center gap-20 py-36 text-left max-w-2xl">
				<div className="flex flex-col text-left w-full">
					<h1>{t("gallery.title")}</h1>
					<h3 className="text-shadow_text">{t("gallery.subtitle")}</h3>
				</div>
				<div className="flex h-4/6 flex-row justify-between items-center gap-16 2xl:flex-wrap">
					<div className="flex px-16 justify-start items-center flex-wrap gap-8 2xl:justify-center 2xl:w-full">
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
										className={`w-14 h-14 border bg-opacity-10 border-opacity-50 rounded-xl ${
											album.tag === activeFolder
												? "border-red bg-blur-svg"
												: "border-white bg-transparent"
										}`}
									>
										<div
											className={`absolute w-14 h-14 border bg-opacity-10 border-opacity-50 rounded-xl transition-all duration-300 ${
												album.tag === activeFolder
													? "border-red bg-blur-svg -translate-y-3 -translate-x-3"
													: "border-white bg-white -translate-y-1.5 -translate-x-1.5 hover:-translate-y-2 hover:-translate-x-2"
											}`}
										></div>
									</div>
								</div>
								<p
									className={`cursor-pointer text-sm text-center ${
										album.tag === activeFolder && "text-white font-bold"
									}`}
								>
									{album.card_title}
								</p>
							</div>
						))}
					</div>
					<div
						className="aspect-[5/3] grid grid-rows-12 grid-cols-12 gap-2 xl:basis-full xs:flex xs:flex-col aos-frame xl:flex xl:flex-col"
						data-aos="zoom-in"
					>
						<div className="rounded-3xl bg-blur-svg gap-4 flex flex-col justify-between col-start-1 col-end-7 row-start-1 row-end-8 p-8">
							<div className="flex flex-col justify-start items-start gap-8">
								<h3 className="font-bold text-left">
									{albums?.find(album => album.tag === selectedAlbum)?.title}
								</h3>
								<p className="text-start 2xl:text-[1rem]">
									{albums?.find(album => album.tag === selectedAlbum)?.description}
								</p>
							</div>
							<div className="flex justify-end">
								<Button
									onClick={() =>
										window.open(albums?.find(album => album.tag === selectedAlbum)?.link, "_blank")
									}
									fill={false}
								>
									{t("gallery.button_text")}
								</Button>
							</div>
						</div>
						<div
							className="rounded-3xl bg-[#020106] row-start-8 col-start-1 row-end-13 col-end-9 p-4 xs:h-36 aos-frame"
							data-aos="zoom-in"
						>
							<img
								src={albums?.find(album => album.tag === selectedAlbum)?.img2.src}
								alt="gallery"
								className="w-full h-full object-cover object-left rounded-2xl"
							/>
						</div>
						<div
							className="rounded-3xl bg-[#020106] row-start-1 col-start-7 row-end-8 col-end-13 p-4 xs:h-36 z-10 aos-frame"
							data-aos="zoom-in"
						>
							<img
								src={albums?.find(album => album.tag === selectedAlbum)?.img1.src}
								alt="gallery"
								className="w-full h-full object-cover object-left rounded-2xl"
							/>
						</div>
						<div className="bg-blur-svg rounded-3xl row-start-8 col-start-9 row-end-13 col-end-13 flex flex-col md:flex-row justify-between items-start gap-8 p-8 text-left overflow-hidden">
							<img
								className="box-border h-20 w-20 aspect-square object-cover rounded-[50%] shadow-glow"
								src={albums?.find(album => album.tag === selectedAlbum)?.icon.src}
								alt={"Hacker"}
							/>
							<div className="md:text-end ">
								<h3>{albums?.find(album => album.tag === selectedAlbum)?.statNumber}</h3>
								<h4>{albums?.find(album => album.tag === selectedAlbum)?.statDescription}</h4>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
