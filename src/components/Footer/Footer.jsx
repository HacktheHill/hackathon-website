import { faFacebook, faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { t } from "../../i18n";

export default function Footer() {
	const [isMouseLeaving, setIsMouseLeaving] = useState(null);
	const [isHeartActive, setIsHeartActive] = useState(false);

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

	return (
		<div className="h-auto w-full bg-shade-10 flex lg:flex-col md:gap-1 md:p-6 gap-4 flex-row justify-between items-center p-5 lg:px-8 px-16">
			<div className="md:grid-cols-2 md:gap-x-5 md:gap-2 lg:grid lg:grid-flow-row lg:gap-x-0 lg:grid-cols-4 lg:gap-2 lg:w-full place-items-center flex items-center w-auto justify-between gap-10">
				<p className="text-white text-xs whitespace-nowrap md:col-span-2 md:p-1.5 col-span-1 md:order-last">
					(C) Hack the Hill 2024
				</p>
				<div className="flex gap-4 md:col-span-2 col-span-1 text-xl">
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
				<div className="md:flex lg:col-span-2 flex justify-center md:gap-4 w-full lg:gap-0 lg:grid lg:grid-cols-2 lg:justify-items-center gap-10">
					<a
						href="https://cdn1.hackthehill.com/legal/constitution.pdf"
						target="_blank"
						rel="noreferrer"
						className="transition-all ease-out duration-300 text-white text-sm underline whitespace-nowrap hover:opacity-100 opacity-85"
					>
						{t("footer.constitution")}
					</a>
					<a
						href="https://cdn1.hackthehill.com/legal/privacy-policy.pdf"
						target="_blank"
						rel="noreferrer"
						className="transition-all ease-out duration-300 text-white text-sm underline whitespace-nowrap hover:opacity-100 opacity-85"
					>
						{t("footer.privacy")}
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
	);
}
