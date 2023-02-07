import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
	//.use(Backend)

	.use(LanguageDetector)

	.use(initReactI18next)

	.init({
		debug: false,
		fallbackLng: "en", //i18n.resolvedLanguage == "en" ? "en" : "fr",
		interpolation: {
			escapeValue: false,
		},

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
					hero: {
						hybrid: "Hybrid",
						at: "@",
						h2: "Canada's Capital Hackathon",
						h3: "University of Ottawa ",
						h3_p2: " Carleton University",
						more: "Learn More",
					},
					about: {
						title: "About Us",
						p1: "The University of Ottawa and Carleton University STEM Student Organizations are incredibly excited to introduce Canada's Capital Hackathon!",
						p2: 'Hack the Hill was established to set a new standard for hackathon operations! With a series of monthly events, also known as "The Hacker Series," hackathon participants will be provided numerous opportunities to brush up on their technical skills, network with peers and even learn from notable alumni and business leaders!',
						p3: "Our main event is scheduled for March 3rd to 5th, 2023, and will be free for all participants. We look forward to seeing you all at our flagship hackathon and hope you're prepared to compete & network with the best!",
					},
					sponsors: {
						title: "Sponsors",
						p: "Hack the Hill is made possible by our generous sponsors. Interested in supporting the capital's hackathon?",
						button: "Sponsorship Packages",
					},
					partners: {
						title: "Community Partners",
					},
					schedule: {
						title: "The Hacker Series",
						event1: {
							title: "Resume Roast",
							month: "November",
							time: "7 p.m. - 9 p.m. @ STM 117",
							description:
								"Need resume advice on the spot? Hang out with some developers from Ciena and Microsoft as they review and evaluate resumes submitted by students, all while filling yourself up with some fresh pizza.",
							status: "View Video",
						},
						event2: {
							title: "Coffee, Code, and Cram",
							month: "November",
							time: "7 p.m. - 9 p.m. @ STM 117",
							description:
								"Unwind and take a break from school. Join us alongside the uOttawa Computer Science Club for an evening of socializing and coding with coffee, tea, and snacks.",
							status: "Completed",
						},
						event3: {
							title: "Wicked Web Work",
							month: "January",
							time: "6 p.m. - 10 p.m. @ STM 117",
							description:
								"Explore the wonders of front-end development! Learn the basics through workshops and participate in a one-hour challenge to build a website according to provided guidelines.",
							status: "Completed",
						},
						event4: {
							title: "Got Games?",
							month: "January",
							time: "7 p.m. - 9 p.m. @ STM 117",
							description:
								"Discover the best that game development has to offer! Join us along side the uOttawa Game Development Club for an introduction to Unity workshop.",
							status: "View Video",
						},
					},
					collaborators: { title: "Collaborators" },
					faq: {
						title: "Frequently Asked Questions",

						q1: "What is a hackathon?",
						a1: "A hackathon is a large-scale event where people design and build a project from scratch.",

						q2: "How much does it cost to participate?",
						a2: "It's completely free to attend! There is no cost to participate! We cover the cost of food at the event and provide cheaper methods of transport to bring participants from Waterloo, the GTA, and Montreal to Ottawa.",

						q3: "Do I need any experience?",
						a3: "No experience is needed! There will be workshops to teach you everything you need to know to hack at Hack the Hill.",

						q4: "This is my first hackathon, what should I expect?",
						a4: "36 hours of networking with our sponsors, learning, and collaborating with other hackers. As a first-time hacker, you can participate in our first-time hacker competition for a more structured learning experience.",

						q5: "Can I start on the project before the hackathon?",
						a5: "No, all projects must be started after open ceremonies on the first day of the event. No code should be written for the project prior to the hackathon, however, you can start thinking about potential hackathon ideas once the themes have been released.",

						q6: "Is the hackathon online or in-person?",
						a6: "Both online and in-person, we're hybrid this year!",

						q7: "What should I bring to an in-person hackathon?",
						a7: "Personal hygiene items (deodorant, toothbrush, etc), sleeping bag, laptop charger, and anything else you might need to stay at the venue for 36 hours. We will provide snacks and food for the entire event!",

						q8: "Who can participate and how do I apply?",
						a8: "Any current high school, university, or recent graduate student can join. Follow us on social media to stay up-to-date with hackathon updates!",

						q9: "Can I work in a team?",
						a9: "Yes, teams of up to 4 can work together at Hack the Hill.",

						q10: "What are the themes for Hack the Hill?",
						a10: "Full details about the hackathon themes will not be released until a few days before the event. But here's a sneak peek about what they might involve: game development, hardware/embedded development, and web development!",

						q11: "How much Red Bull should I drink in a day?",
						a11: "Yes.",
					},
					footer: {
						title: "Canada's Capital Hackathon",
						description: "Control the Capital, Command the Cabinet, Build until you Hack the Hill",
						github: "Source Code",
					},
					notification: {
						message:
							'Attention hackers! Registrations close on <time dateTime="2023-01-29"> Sunday, January 29th</time>! Don\'t miss out!',
						close: "Close Notification",
					},
				},
			},
			fr: {
				translation: {
					navbar: {
						links: {
							about: "À Propos",
							sponsors: "Commanditaires",
							hacker: "La Série du Hacker",
							collaborators: "Collaborateurs",
							faq: "FAQ",
						},
					},
					hero: {
						hybrid: "Hybride",
						at: "à",
						h2: "Le Hackathon de la Capitale Canadienne",
						h3: "Université d'Ottawa ",
						h3_p2: " Université Carleton",
						more: "En Savoir Plus",
					},
					about: {
						title: "À propos de nous",
						p1: "Hack the Hill est un hackathon international qui se déroule au cœur de la capitale du Canada! En collaboration avec la Faculté de génie de l'Université d'Ottawa, sept grandes organisations étudiantes travaillent main dans la main afin d'établir une fondation solide pour tous les hackathons du future.",
						p2: "L'Association des étudiants en génie d'uOttawa, la Branche étudiante de l'IEEE d'uOttawa, l'Association des étudiants en informatique, l'Association des étudiants en génie logiciel, le Groupe d'affinité des femmes en génie d'uOttawa, le Club d'informatique d'uOttawa et le Club de développement de jeux d'uOttawa sont fiers d'offrir un hackathon à Ottawa, où les étudiants peuvent former des connections et compétitionner parmis meilleurs!",
						p3: "Grâce à une série d'événements mensuels menant à notre hackathon principal, également connue sous le nom de \"La série hacker\", les participants du hackathon auront de nombreuses occasions pour perfectionner leurs compétences techniques, réseauter avec leurs collègues et apprendre d'étudiants diplômés ainsi que de leaders d'entreprises notables! Notre événement principal est prévu du 3 au 5 février 2023 et l'inscription est gratuite!",
					},
					sponsors: {
						title: "Commanditaires",
						p: "Hack the Hill est rendu possible grâce à nos généreux commanditaires. Souhaitez-vous soutenir le hackathon de la capitale?",
						button: "Forfaits de Parrainage",
					},
					partners: {
						title: "Partenaires Communautaires",
					},
					schedule: {
						title: "La Série du Hacker",
						event1: {
							title: "Évaluations des CV",
							month: "Novembre",
							time: "19h - 21h à STM 117",
							description:
								"Avez-vous besoin de conseils sur votre CV ? Rencontrez des développeurs de Ciena et de Microsoft qui examineront et évalueront les CV soumis par les étudiants, tout en mangeant des pizzas fraîches.",
							status: "Visionner",
						},
						event2: {
							title: "Café, Code et Cram",
							month: "Novembre",
							time: "19h - 21h à STM 117",
							description:
								"Détendez-vous et prenez une pause de l'école. Joignez-nous et le Club d'informatique de l'Université d'Ottawa pour une soirée de socialisation et de codage avec café et collations.",
							status: "Complété",
						},
						event3: {
							title: "Développement Web Maléfique",
							month: "Janvier",
							time: "18h - 22h à STM 117",
							description:
								"Explorez les merveilles du développement web ! Apprenez les bases avec des ateliers et participez à un défi d'une heure pour construire un site Web selon les directives fournies.",
							status: "Complété",
						},
						event4: {
							title: "Atelier de Développement de Jeux",
							month: "Janvier",
							time: "19h - 21h à STM 117",
							description:
								"Découvrez le meilleur que le développement de jeux a à offrir ! Joignez-vous à nous aux côtés du Club de développement de jeux de l'Université d'Ottawa pour un atelier d'introduction à Unity.",
							status: "Visionner",
						},
					},
					collaborators: {
						title: "Collaborateurs",

						q1: "C'est quoi un hackathon ?",
						a1: "Un hackathon est un événement à grande échelle où les participants conçoivent et construisent un projet à partir de zéro.",

						q2: "Combien ça coûte pour participer ?",
						a2: "La participation est entièrement gratuite ! Nous couvrons le coût de la nourriture lors de l'événement et fournissons des moyens de transport pour amener les participants de Waterloo, de Toronto et de Montréal à Ottawa.",

						q3: "Dois-je avoir de l'expérience ?",
						a3: "Aucune expérience n'est nécessaire ! Des ateliers vous enseignerons tout ce que vous devez savoir pour bien réussir à Hack the Hill.",

						q4: "C'est mon premier hackathon, à quoi dois-je m'attendre ?",
						a4: "36 heures de réseautage avec nos commanditaires, d'apprentissage et de collaboration. Si vous êtes un hacker débutant, vous pouvez participer à notre concours junior pour une expérience d'apprentissage plus structurée.",

						q5: "Puis-je commencer à travailler sur mon projet avant le hackathon ?",
						a5: "Non, tous les projets doivent être commencés après les cérémonies d'ouverture. Aucun code ne doit être écrit pour le projet avant le hackathon, cependant, vous pouvez commencer à réfléchir à un projet une fois que les thèmes ont été publiés.",

						q6: "Le hackathon est-il en ligne ou en personne ?",
						a6: "Le hackathon sera en ligne ou en personne, nous opérons de façon hybride cette année !",

						q7: "Que devrais-je apporter ?",
						a7: "Articles d'hygiène personnelle (déodorant, brosse à dents, etc.), sac de couchage, chargeur d'ordinateur portable, et tout ce dont vous pourriez avoir besoin pour rester sur place pendant 36 heures. Nous fournirons des collations et de la nourriture pendant toute la durée de l'événement !",

						q8: "Qui peut participer et comment postuler ?",
						a8: "Tout lycéen, étudiant universitaire ou diplômé récent peut participer. Suivez-nous sur les médias sociaux pour rester à jour avec les nouveautés!",

						q9: "Puis-je travailler en équipe ?",
						a9: "Oui, chaque équipe peut contenir jusqu'à 4 personnes.",

						q10: "Quels sont les thèmes de Hack the Hill ?",
						a10: "Les détails complets sur les thèmes du hackathon ne seront publiés que quelques jours avant le début du hackathon, mais voici un aperçu de ce qu'ils pourraient impliquer : développement de jeux, développement matériel/embarqué et développement web !",

						q11: "Combien de Red Bull devrais-je boire par jour ?",
						a11: "Oui.",
					},
					faq: { title: "Foire aux questions" },
					footer: {
						title: "Le Hackathon de la Capitale Canadienne",
						description: "Contrôle la Capitale, Commande le Cabinet, Construit le Future",
						github: "Code Source",
					},
					notification: {
						message:
							'Attention hackers! L\'enregistrement se termine le <time dateTime="2023-01-29"> Dimanche, 29 Janvier</time>! Ne manquer pas votre chance !',
						close: "Fermer Notification",
					},
				},
			},
		},
	});
export default i18n;
