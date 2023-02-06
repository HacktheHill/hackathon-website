import { Link } from "react-scroll";
import "./NavBar.css";
import logo from "/Logos/hackthehill-logo.svg";
import { useTranslation, Trans } from "react-i18next";
import "../Localization/i18n";

const lngs = {
	en: { nativeName: "En" },
	fr: { nativeName: "Fr" },
};

function Navbar({ pageScroll }) {
	const { t, i18n } = useTranslation();

	return (
		<>
			<nav className="navbar" data-scrolled={pageScroll > 50} aria-label="Main Navigation">
				<Link
					className="link logo"
					activeClass="active"
					to="hero"
					spy={true}
					smooth={true}
					offset={0}
					duration={500}
					href="#hero"
				>
					<img alt="Logo" src={logo}></img>
				</Link>
				<ul>
					<li>
						<div className="language-selector">
							{Object.keys(lngs).map(lng => (
								<button
									className="link language-button"
									key={lng}
									style={{ fontWeight: i18n.resolvedLanguage === lng ? "bold" : "normal" }}
									type="submit"
									onClick={() => i18n.changeLanguage(lng)}
								>
									{lngs[lng].nativeName}
								</button>
							))}
							<p>&nbsp;</p>
						</div>
					</li>
					<li>
						<Link
							className="link"
							activeClass="active"
							to="about"
							spy={true}
							smooth={true}
							offset={-160}
							duration={500}
							href="#about"
						>
							<Trans i18nKey="navbar.links.about"></Trans>
						</Link>
					</li>
					<li>
						<Link
							className="link"
							activeClass="active"
							to="sponsors"
							spy={true}
							smooth={true}
							offset={-120}
							duration={500}
							href="#sponsors"
						>
							{t("navbar.links.sponsors")}
						</Link>
					</li>
					<li>
						<Link
							className="link"
							activeClass="active"
							to="schedule"
							spy={true}
							smooth={true}
							offset={-80}
							duration={500}
							href="#schedule"
						>
							{t("navbar.links.hacker")}
						</Link>
					</li>
					<li>
						<Link
							className="link"
							activeClass="active"
							to="collaborators"
							spy={true}
							smooth={true}
							offset={-130}
							duration={500}
							href="#collaborators"
						>
							{t("navbar.links.collaborators")}
						</Link>
					</li>
					<li>
						<Link
							className="link"
							activeClass="active"
							to="faq"
							spy={true}
							smooth={true}
							offset={-130}
							duration={500}
							href="#faq"
						>
							{t("navbar.links.faq")}
						</Link>
					</li>
				</ul>
			</nav>
		</>
	);
}

export default Navbar;
