import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n.use(Backend)

	.use(LanguageDetector)

	.use(initReactI18next)

	.init({
		debug: false,
		fallbackLng: "en",
		interpolation: {
			escapeValue: false,
		},
		/*
		resources: {
			en: {
				translation: {
					navbar: {
						links: {
							about: "About",
							sponsors: "Sponsors",
							hacker: "The Hacker Series",
							collaborators: "Collaborators",
							faq: "FAQ",
						},
					},
				},
			},
			fr: {
				translation: {
					navbar: {
						links: {
							about: "À Propos",
							sponsors: "Commanditaires",
							hacker: "La Série Hacker",
							collaborators: "Collaborateurs",
							faq: "FAQ",
						},
					},
				},
			},
		},*/
	});
export default i18n;
