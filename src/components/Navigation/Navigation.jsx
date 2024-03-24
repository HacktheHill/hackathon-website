import { Link } from "react-scroll";
import { locale, t } from "../../i18n";
import React, { useState, useEffect } from "react";
import logo from "/src/assets/Logos/HTH/Hth_red_glow.svg";
import bg_2024 from "/src/assets/SVGs/2024.svg";

export default function Navigation() {
	const [language, setLanguage] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		window.addEventListener("scroll", () => {
			const nav = document.querySelector("nav");
			if (nav && window.innerWidth > 768) {
				if (window.scrollY === 0) {
					nav.style.backgroundColor = "transparent";
					nav.style.backdropFilter = "blur(0px)";
				} else {
					nav.style.backgroundColor = "var(--navbar)";
					nav.style.backdropFilter = "blur(10px)";
				}
			}
		});

		window.addEventListener("resize", () => {
			if (window.innerWidth > 768) {
				setSidebarOpen(false);
			}
		});
	}, []);

	useEffect(() => {
		handleSidebarUI();
	}, [sidebarOpen]);

	const handleSidebarUI = () => {
		const c = document.getElementById("menu").children;
		c[0].style.transform = sidebarOpen ? "translate(0, 0.8ch) rotate(-45deg)" : "translate(0, 0) rotate(0)";
		c[1].style.opacity = sidebarOpen ? "0" : "1";
		c[2].style.transform = sidebarOpen ? "translate(0, -0.8ch) rotate(45deg)" : "translate(0, 0) rotate(0)";
	};

	return (
		<div className="fixed top-0 h-24 w-full z-50 flex justify-center items-center md:h-16">
			<nav
				className="flex h-2/3 w-11/12 justify-between items-center box-border border-transparent rounded-2xl transition-all duration-500 md:bg-navbar md:backdrop-blur-xl md:w-full md:rounded-none md:pr-4 md:h-full"
				aria-label={t("navbar.aria_label")}
			>
				<div className="flex flex-row gap-4 items-center xs:gap-0">
					<a
						href="/"
						className="flex h-full items-center bg-transparent border-none p-4 cursor-pointer transition-all duration-100 opacity-85 hover:opacity-100"
					>
						<img {...logo} alt="Logo" width="75px" />
					</a>
					<button
						className="flex h-full w-16 items-center bg-transparent border-none p-4 cursor-pointer font-bold transition-all duration-100 hover:text-shade-1"
						type="submit"
						onClick={() => {
							setLanguage(!language);
							locale.set(language ? "fr" : "en");
						}}
					>
						{language ? "FR" : "EN"}
					</button>
					<div
						className="flex h-8 w-24 justify-center items-center bg-2024-bg bg-cover bg-top border-none rounded-xl p-4 text-bg-2024 cursor-pointer font-bold transition-all duration-100 opacity-85 hover:opacity-100"
						onClick={() => window.open("https://2024.hackthehill.com", "_blank")}
					>
						2024
					</div>
				</div>
				<div>
					<div
						id="menu"
						className="hidden h-full bg-transparent border-none cursor-pointer p-2 md:block"
						onClick={() => {
							setSidebarOpen(!sidebarOpen);
							handleSidebarUI();
						}}
					>
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="w-7 h-1 bg-shade-3 my-1 mx-0 transition-all duration-500 rounded-md"
							></div>
						))}
					</div>
					<div
						id="sidebar"
						className={
							sidebarOpen
								? "absolute flex flex-col top-16 right-0 z-50 border bg-shade-9 border-shade-7 transition-all duration-500 md:rounded-bl-xl md:border-t-0 md:border-r-0 md:shadow-md"
								: "flex flex-row gap-4 items-center md:hidden"
						}
					>
						{["events", "blog", "team", "documents"].map(link => (
							<a
								href={link ? `/${link}` : "#"}
								className="flex h-full items-center border-none p-4 cursor-pointer font-bold transition-all duration-100 md:border md:rounded-xl hover:text-shade-1"
								key={link}
							>
								{t(`navbar.links.${link}`)}
							</a>
						))}
					</div>
				</div>
			</nav>
		</div>
	);
}
