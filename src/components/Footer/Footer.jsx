import { faFacebook, faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import React from "react";
import { t } from "../../i18n";

export default function Footer() {
	return (
		<div className="h-auto w-full bg-shade-10 flex lg:flex-col md:gap-1.5 md:p-4 gap-4 flex-row justify-between items-center p-5 lg:px-8 px-16">
			<div className="md:grid-cols-2 md:gap-x-5 md:gap-2 lg:grid lg:grid-flow-row lg:gap-x-0 lg:grid-cols-4 lg:gap-2 lg:w-full place-items-center flex items-center w-auto justify-between gap-16">
				<p className="text-white text-sm whitespace-nowrap md:col-span-2 md:p-1.5 col-span-1 md:order-last italic">
					(C) Hack the Hill 2024
				</p>
				<div className="transition-all flex gap-4 md:col-span-2 col-span-1 text-xl">
					<a
						href="https://www.facebook.com/canadascapitalhackathon"
						target="_blank"
						rel="noreferrer"
						className="hover:animate-shake-rotate text-white hover:opacity-100 opacity-85"
					>
						<Icon icon={faFacebook} />
					</a>
					<a
						href="https://www.linkedin.com/company/hackthehill"
						target="_blank"
						rel="noreferrer"
						className="hover:animate-shake-rotate text-white hover:opacity-100 opacity-85"
					>
						<Icon icon={faLinkedin} />
					</a>
					<a
						href="https://www.instagram.com/hackthehill"
						target="_blank"
						rel="noreferrer"
						className="hover:animate-shake-rotate text-white hover:opacity-100 opacity-85"
					>
						<Icon icon={faInstagram} />
					</a>
					<a
						href="https://twitter.com/hackthehill_"
						target="_blank"
						rel="noreferrer"
						className="hover:animate-shake-rotate text-white hover:opacity-100 opacity-85"
					>
						<Icon icon={faTwitter} />
					</a>
					<a
						href="https://www.tiktok.com/@hackthehill"
						target="_blank"
						rel="noreferrer"
						className="hover:animate-shake-rotate text-white hover:opacity-100 opacity-85"
					>
						<Icon icon={faTiktok} />
					</a>
				</div>
				<div className="transition-all md:flex lg:col-span-2 flex justify-center md:gap-4 w-full lg:gap-0 lg:grid lg:grid-cols-2 lg:justify-items-center gap-16">
					<a
						href="https://cdn1.hackthehill.com/legal/constitution.pdf"
						target="_blank"
						rel="noreferrer"
						className="ease-out duration-300 text-white text-sm underline whitespace-nowrap hover:opacity-100 opacity-85"
					>
						Code of Conduct
					</a>
					<a
						href="https://cdn1.hackthehill.com/legal/privacy-policy.pdf"
						target="_blank"
						rel="noreferrer"
						className="ease-out duration-300 text-white text-sm underline whitespace-nowrap hover:opacity-100 opacity-85"
					>
						Privacy Policy
					</a>
				</div>
			</div>
			<div className="flex items-center">
				<p className="text-white text-sm whitespace-nowrap font-bold">
					by HtH Dev team with{" "}
					<span role="img" aria-label="heart">
						❤️
					</span>
				</p>
			</div>
		</div>
	);
}
