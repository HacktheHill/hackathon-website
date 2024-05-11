import { faFacebook, faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef, useEffect } from "react";
import { t } from "../../i18n";
import beaver from "../../assets/beavar/Beaver.svg";

export default function Footer() {
	const [isMouseLeaving, setIsMouseLeaving] = useState(null);
	const [isHeartActive, setIsHeartActive] = useState(false);
	const [isBeaverActive, setIsBeaverActive] = useState(false);

	const footerRef = useRef();
	const [footerHeight, setFooterHeight] = useState(0);

	const handleMouseLeave = iconName => {
		setIsMouseLeaving(iconName);
		setTimeout(() => setIsMouseLeaving(null), 250); // Change to the duration you want in milliseconds
	};

	const toggleHeart = () => {
		if (!isHeartActive) {
			setIsHeartActive(true);
			setTimeout(() => setIsHeartActive(false), 3000); // Change to the duration you want in milliseconds
		}
	};

	const toggleBeaver = () => {
		if (!isBeaverActive) {
			setIsBeaverActive(true);
			setTimeout(() => setIsBeaverActive(false), 6000); // Change to the duration you want in milliseconds
		}
	};

	useEffect(() => {
		window.addEventListener("resize", () => {
			setFooterHeight(footerRef.current.clientHeight);
		});
	}, []);

	return (
		<div ref={footerRef} className="h-auto w-full flex relative overflow-hidden pt-20 bg-background-dark">
			<div
				className={`h-24 z-[1] absolute bottom-0 left-16 lg:hidden cursor-pointer ${
					isBeaverActive ? "animate-beaver" : ""
				}`}
				onClick={toggleBeaver}
			>
				<img src={beaver.src} alt="Beaver" className="h-full" />
			</div>
			<div className="flex flex-row w-full justify-between items-center gap-8 pl-64 pr-16 py-4 flex-wrap lg:px-8 md:justify-center bg-background-light ">
				<div className="flex flex-row gap-8 justify-start items-center flex-wrap lg:justify-center">
					<p className="text-white text-xs whitespace-nowrap">(C) Hack the Hill 2024</p>
					<div className="flex gap-4 text-xl">
						<a
							href="https://www.facebook.com/canadascapitalhackathon"
							target="_blank"
							rel="noreferrer"
							className={`transition-all duration-300 hover:animate-shake-rotate text-white hover:opacity-100 opacity-85 ${
								isMouseLeaving === "facebook" ? "animate-shake-end" : ""
							}`}
							onMouseLeave={() => handleMouseLeave("facebook")}
						>
							<Icon icon={faFacebook} />
						</a>
						<a
							href="https://www.linkedin.com/company/hackthehill"
							target="_blank"
							rel="noreferrer"
							className={`transition-all duration-300 hover:animate-shake-rotate text-white hover:opacity-100 opacity-80 ${
								isMouseLeaving === "linkedin" ? "animate-shake-end" : ""
							}`}
							onMouseLeave={() => handleMouseLeave("linkedin")}
						>
							<Icon icon={faLinkedin} />
						</a>
						<a
							href="https://www.instagram.com/hackthehill"
							target="_blank"
							rel="noreferrer"
							className={`transition-all duration-300 hover:animate-shake-rotate text-white hover:opacity-100 opacity-80 ${
								isMouseLeaving === "instagram" ? "animate-shake-end" : ""
							}`}
							onMouseLeave={() => handleMouseLeave("instagram")}
						>
							<Icon icon={faInstagram} />
						</a>
						<a
							href="https://twitter.com/hackthehill_"
							target="_blank"
							rel="noreferrer"
							className={`transition-all duration-300 hover:animate-shake-rotate text-white hover:opacity-100 opacity-80 ${
								isMouseLeaving === "twitter" ? "animate-shake-end" : ""
							}`}
							onMouseLeave={() => handleMouseLeave("twitter")}
						>
							<Icon icon={faTwitter} />
						</a>
						<a
							href="https://www.tiktok.com/@hackthehill"
							target="_blank"
							rel="noreferrer"
							className={`transition-all duration-300 hover:animate-shake-rotate text-white hover:opacity-100 opacity-80 ${
								isMouseLeaving === "tiktok" ? "animate-shake-end" : ""
							}`}
							onMouseLeave={() => handleMouseLeave("tiktok")}
						>
							<Icon icon={faTiktok} />
						</a>
					</div>
				</div>
				<div className="flex items-center gap-0.5">
					<p className="text-white text-sm whitespace-nowrap font-bold">{t("footer.message")}</p>
					<p
						className={`self-center text-white text-sm whitespace-nowrap font-bold ${
							isHeartActive ? "animate-heart" : ""
						}`}
						onClick={toggleHeart}
					>
						<span role="img" aria-label="heart" className="cursor-pointer">
							❤️
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}
