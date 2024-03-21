import { faFacebook, faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import React from "react";
import { t } from "../../i18n";

export default function Footer() {
	return (
		<div className="absolute bottom-0 h-auto w-full bg-shade-10 flex flex-col gap-1 p-4 md:gap-4 lg:flex-row justify-between items-center md:p-5 lg:px-16">
			<div className="grid grid-flow-row grid-cols-2 gap-2 gap-x-5 md:gap-x-0 md:grid-cols-4 place-items-center lg:flex lg:items-center w-full lg:w-auto justify-between lg:gap-16">
				<p className="text-white text-sm whitespace-nowrap col-span-2 md:col-span-1 order-last md:order-first">
					(C) Hack the Hill 2024
				</p>
				<div className="flex gap-4 col-span-2 md:col-span-1 text-xl">
					<a
						href="https://www.facebook.com/canadascapitalhackathon"
						target="_blank"
						rel="noreferrer"
						className="text-white"
					>
						<Icon icon={faFacebook} />
					</a>
					<a
						href="https://www.linkedin.com/company/hackthehill"
						target="_blank"
						rel="noreferrer"
						className="text-white"
					>
						<Icon icon={faLinkedin} />
					</a>
					<a
						href="https://www.instagram.com/hackthehill"
						target="_blank"
						rel="noreferrer"
						className="text-white"
					>
						<Icon icon={faInstagram} />
					</a>
					<a href="https://twitter.com/hackthehill_" target="_blank" rel="noreferrer" className="text-white">
						<Icon icon={faTwitter} />
					</a>
					<a
						href="https://www.tiktok.com/@hackthehill"
						target="_blank"
						rel="noreferrer"
						className="text-white"
					>
						<Icon icon={faTiktok} />
					</a>
				</div>
				<div className="col-span-2 flex justify-center gap-5 w-full md:gap-0 md:grid md:grid-cols-2 md:justify-items-center lg:gap-11">
					<a
						href="https://cdn1.hackthehill.com/legal/constitution.pdf"
						target="_blank"
						rel="noreferrer"
						className="text-white text-sm underline whitespace-nowrap"
					>
						Code of Conduct
					</a>
					<a
						href="https://cdn1.hackthehill.com/legal/privacy-policy.pdf"
						target="_blank"
						rel="noreferrer"
						className="text-white text-sm underline whitespace-nowrap"
					>
						Privacy Policy
					</a>
				</div>
			</div>
			<div className="flex items-center">
				<p className="text-white text-sm whitespace-nowrap">
					by HtH Dev team with{" "}
					<span role="img" aria-label="heart">
						❤️
					</span>
				</p>
			</div>
		</div>
	);
}
