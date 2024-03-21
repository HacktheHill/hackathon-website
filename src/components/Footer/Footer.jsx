import { faFacebook, faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import React from "react";
import { t } from "../../i18n";

export default function Footer() {
	return (
		<div className="h-auto w-full bg-shade-10 flex lg:flex-col md:gap-1 md:p-4 gap-4 flex-row justify-between items-center p-5 px-16">
			<div className="md:grid-cols-2 md:gap-x-5 lg:grid lg:grid-flow-row lg:gap-x-0 lg:grid-cols-4 lg:gap-2 lg:w-full place-items-center flex items-center w-auto justify-between gap-16">
				<p className="text-white text-sm whitespace-nowrap md:col-span-2 col-span-1 md:order-last">
					(C) Hack the Hill 2024
				</p>
				<div className="flex gap-4 md:col-span-2 col-span-1 text-xl">
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
				<div className="md:flex lg:col-span-2 flex justify-center md:gap-5 w-full lg:gap-0 lg:grid lg:grid-cols-2 lg:justify-items-center gap-16">
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
