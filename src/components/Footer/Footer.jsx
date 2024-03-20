import { faFacebook, faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import React from "react";
import { t } from "../../i18n";

export default function Footer() {
	return (
		<div className="absolute bottom-0 h-24 w-full bg-shade-10 flex justify-between items-center px-16">
			<div className="flex items-center gap-16">
				<p className="text-white text-sm whitespace-nowrap ">(C) Hack the Hill 2024</p>
				<div className="flex gap-4">
					<a
						href="https://www.facebook.com/hackthehill"
						target="_blank"
						rel="noreferrer"
						className="text-white text-xl"
					>
						<Icon icon={faFacebook} />
					</a>
					<a
						href="https://www.linkedin.com/company/hackthehill"
						target="_blank"
						rel="noreferrer"
						className="text-white text-xl"
					>
						<Icon icon={faLinkedin} />
					</a>
					<a
						href="https://www.instagram.com/hackthehill"
						target="_blank"
						rel="noreferrer"
						className="text-white text-xl"
					>
						<Icon icon={faInstagram} />
					</a>
					<a
						href="https://www.twitter.com/hackthehill"
						target="_blank"
						rel="noreferrer"
						className="text-white text-xl"
					>
						<Icon icon={faTwitter} />
					</a>
					<a
						href="https://www.tiktok.com/@hackthehill"
						target="_blank"
						rel="noreferrer"
						className="text-white text-xl"
					>
						<Icon icon={faTiktok} />
					</a>
				</div>
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
					className="w-full text-white text-sm underline whitespace-nowrap"
				>
					Privacy Policy
				</a>
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
