import React, { useEffect } from "react";
import Button from "../Button/Button";
import cv from "../../assets/icons/cv.svg";
import { t } from "../../i18n";
import beaver5 from "../../assets/beavar/Beaver5.svg";
import "../../global.css";
import AOS from "aos";
import "aos/dist/aos.css";
import shape from "../../assets/patterns/ssshape.svg";

export default function DocumentsPage() {
	useEffect(() => {
		AOS.init({ once: false, duration: 700 });
	}, []);

	return (
		<div className="flex justify-center items-center w-full bg-background-dark relative overflow-hidden">
			<div className="flex flex-col w-10/12 h-full justify-center items-center gap-20 py-36 text-left max-w-2xl z-[1]">
				<div className="flex flex-col text-left w-full" data-aos="fade-up">
					<h1>{t("documents.title")}</h1>
				</div>
				<div className="grid grid-rows-1 grid-cols-2 gap-8 w-10/12 max-w-2xl xl:flex xl:flex-wrap">
					<div
						className="row-start-1 col-start-2 row-end-1 col-end-3 flex flex-col items-start justify-between gap-32 p-8 rounded-3xl bg-blur-svg relative"
						data-aos="fade-left"
					>
						<div className="flex flex-row justify-between items-center w-full gap-4">
							<h3>{t("documents.constitution")}</h3>
							<img
								className="box-border h-20 w-20 aspect-square object-cover rounded-[50%]"
								src={cv.src}
								alt="Document"
							/>
						</div>
						<div>
							<p>{t("documents.constitution_desc")}</p>
							<div className="w-full flex justify-end mt-4">
								<Button
									onClick={() =>
										window.open("https://cdn1.hackthehill.com/legal/constitution.pdf", "_blank")
									}
									fill={false}
								>
									{t("documents.constitution_btn")}
								</Button>
							</div>
						</div>
						<div className="absolute -top-16 right-0 h-24">
							<img src={beaver5.src} alt="Beaver" className="h-full" />
						</div>
					</div>
					<div
						className="row-start-1 col-start-1 row-end-1 col-end-2 flex flex-col items-start justify-between gap-32 p-8 rounded-3xl bg-[#020106] overflow-hidden"
						data-aos="fade-right"
					>
						<div className="flex flex-row justify-between items-center w-full gap-4">
							<h3>{t("documents.privacy")}</h3>
							<img
								className="box-border h-20 w-20 aspect-square object-cover rounded-[50%] shadow-glow"
								src={cv.src}
								alt="Document"
							/>
						</div>
						<div>
							<p>{t("documents.privacy_desc")}</p>
							<div className="w-full flex justify-end mt-4">
								<Button
									onClick={() =>
										window.open("https://cdn1.hackthehill.com/legal/privacy-policy.pdf", "_blank")
									}
									fill={false}
								>
									{t("documents.privacy_btn")}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<img
				src={shape.src}
				alt="shape"
				className="w-full max-w-bg-deco opacity-25 absolute z-[0] -translate-x-1/2 -translate-y-1/4"
			/>
			<img
				src={shape.src}
				alt="shape"
				className="w-full max-w-bg-deco opacity-25 absolute z-[0] translate-x-1/2 translate-y-[10%] -scale-y-75 scale-x-75"
			/>
		</div>
	);
}
