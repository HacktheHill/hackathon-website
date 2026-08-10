export default {
	navbar: {
		links: {
			about: "À propos",
			winners: "Gagnants",
			sponsors: "Anciens commanditaires",
			collaborators: "Anciens collaborateurs",
			faq: "FAQ",
			testimonials: "Témoignages",
		},
		aria_label: "Navigation principale",
		mobile_aria_label: "Navigation mobile",
		home_label: "Accueil de Hack the Hill",
		language_switch: "Afficher ce site en anglais",
		past_site_label: "Ouvrir le site Web de Hack the Hill II",
		menu_open: "Ouvrir le menu de navigation",
		menu_close: "Fermer le menu de navigation",
		skip_to_content: "Passer au contenu principal",
	},
	hero: {
		at: "à",
		h2: "Le hackathon de la capitale du Canada",
		apply: "Présentez votre candidature dès maintenant",
		date: "Du 25 au 27 septembre 2026",
		countdown: {
			open: "Afficher le compte à rebours de Hack the Hill",
			close: "Fermer le compte à rebours",
			event_start: "Hack the Hill commence dans",
			hacking_start: "La période de programmation commence dans",
			hacking_end: "La période de programmation se termine dans",
			day: "jour",
			days: "jours",
			hour: "heure",
			hours: "heures",
			minute: "minute",
			minutes: "minutes",
			second: "seconde",
			seconds: "secondes",
		},
	},
	about: {
		title: "Bienvenue à Hack the Hill III",
		p1: "Joignez-vous à des étudiants de différentes disciplines pour une fin de semaine consacrée à la création de solutions innovantes et porteuses d'impact à des enjeux civiques concrets.",
		p2: "Organisé par le Réseau technologique de la capitale, le hackathon crée un espace stimulant pour apprendre, collaborer, réseauter avec ses pairs et mettre en valeur ses talents et ses idées.",
		p3: "Que vous participiez à votre premier hackathon ou que vous arriviez avec plusieurs années d'expérience, vous y trouverez une communauté accueillante nourrie par une diversité de compétences et de perspectives.",
		frame_alt: "Vidéo récapitulative de Hack the Hill II",
	},
	stats: {
		title: "Hack the Hill II en chiffres",
		p1: "800+",
		p1tag: "Participants",
		p2: "1190+",
		p2tag: "Candidats",
		p3: "8+",
		p3tag: "Commanditaires",
		p4: "15+",
		p4tag: "Collaborateurs",
	},
	winners: {
		title: "Gagnants",
		subtitle:
			"Célébrons les esprits brillants et les projets qui ont fait de Hack the Hill II un voyage inoubliable!",
		categories: {
			general_challenge: "Défi Général",
			ciena: "Défi Ciena",
			ross: "Défi Ross",
			best_ui_ux: "Meilleure implémentation UI/UX",
			best_ai: "Meilleure utilisation de l'IA",
			best_uottawa_carleton: "Meilleure collaboration uOttawa x Carleton",
			best_cloud: "Meilleure utilisation de la technologie infonuagique",
			best_hardware: "Meilleur projet matériel",
			geoguessr: "Défi Geoguessr",
			scavenger_hunt: "Défi chasse au trésor",
		},
		no_data: "Aucune donnée sur les gagnants disponible pour cette catégorie.",
		general_challenge: [
			{ place: "1re", project: "Pawgress", team: ["Aditya Kandel", "Chenhao Wei", "Selin Kararmaz", "Jun Ye"] },
			{
				place: "2e",
				project: "Duo Move",
				team: ["Carcidev Carciente", "Vinisha Manek", "Keshan Kathiripilay", "Mahutt"],
			},
			{
				place: "3e",
				project: "Timetable Sweetie",
				team: ["Jason Shao", "Kaushik Tumu", "Jeff Lu", "Anas Abushaikha"],
			},
		],
		sponsor_challenges: {
			ciena: [
				{
					place: "1re",
					project: "Mound",
					team: ["Robert Zuchniak", "Raef Sarofiem", "Matthew Polak", "Vasil Topalovik"],
				},
				{
					place: "2e",
					project: "PeerPressure",
					team: ["James Liang", "Callum Curtis", "Krins Vaghasia", "David Pietrocola"],
				},
				{
					place: "3e",
					project: "Distributed Encrypted Peer-to-Peer File Management Platform",
					team: ["Miller Ding", "Antoine Lavigne", "Aditya", "Matias S"],
				},
			],
			ross: [
				{
					place: "1re",
					project: "Frame Out",
					team: [
						"Neel Patel",
						"Nathaniel Lays",
						"Darrell Nyakaana",
						"Samuel Marchetti",
						"Lana Othman",
						"Integer-Conversion-Error Kaya",
					],
				},
				{
					place: "2e",
					project: "Bouncing ROSS",
					team: ["Kyle Mendes", "Ines Mansouri", "Mike Katsnelson", "Vilmos Feher", "Paul Chukwu"],
				},
				{ place: "3e", project: "Ping Pong", team: ["Sami Tahi", "Anas Bourfia"] },
			],
		},
		mini_challenges: {
			best_ui_ux: [
				{ place: "1re", project: "CapyCare", team: ["Chi McIsaac", "Karam"] },
				{ place: "2e", project: "Stumble", team: ["Joseph Liao", "Evan Ferreira", "Gavin Yan"] },
			],
			best_ai: [
				{
					place: "1re",
					project: "BrainUp",
					team: ["Edmund Ye", "Karanveer Panesar", "Hasin Zaman", "Jawad Mohammed"],
				},
				{
					place: "2e",
					project: "Grype",
					team: ["Joey Issa", "Twoadave Gayowsky", "Batleram Scaffindi", "Jacob T"],
				},
			],
			best_uottawa_carleton: [
				{
					place: "1re",
					project: "The Heart Stopper",
					team: ["Bradley Nguyen", "Sabateesh Sivakumar", "Daniel B. Solomon", "Shane S"],
				},
				{
					place: "2e",
					project: "InsuWell",
					team: ["Imane A.", "Aisha Jama", "Maryam Belkebir", "Saja Elkurtehi"],
				},
			],
			best_cloud: [
				{ place: "1re", project: "snhack-rover", team: ["Mumtahin Farabi", "Rohan Sreelesh", "Hiba Tantawi"] },
				{
					place: "2e",
					project: "JustVent",
					team: ["Noah do Rego", "Nodshley Marcelin", "Colby Todd", "Andrew Pham"],
				},
			],
			best_hardware: [
				{ place: "1re", project: "AnyPen", team: ["Emilee Chen", "Ethan Sue", "Fahmi O", "Ivana Du"] },
				{
					place: "2e",
					project: "RelaxED AI",
					team: ["Aneesh Ereddy", "Shawn How", "Marc Vidal", "Benjamin Gavieres"],
				},
			],
			geoguessr: [
				{
					place: "1re",
					project: "Équipe 1",
					team: ["Alex Smith", "Jamie Wong", "Chris Johnson", "Taylor Park"],
				},
				{
					place: "2e",
					project: "Équipe 2",
					team: ["Jordan Lee", "Casey Zhang", "Morgan Taylor", "Riley Chen"],
				},
				{ place: "3e", project: "Équipe 3", team: ["Sam Patel", "Jesse Kim", "Avery Garcia", "Quinn Murphy"] },
			],
			scavenger_hunt: [
				{
					place: "1re",
					project: "Chasse au Trésor",
					team: ["Robin Blake", "Cameron Lane", "Drew Rivera", "Skyler Reed", "Jordan Ellis"],
				},
			],
		},
	},
	sponsors: {
		title: "Anciens commanditaires",
		p: "Les éditions précédentes de Hack the Hill ont été rendues possibles grâce à ces généreux commanditaires. Souhaitez-vous soutenir le hackathon de la capitale?",
		button: "Devenir commanditaire",
	},
	collaborators: {
		title: "Anciens collaborateurs",
	},
	testimonials: {
		title: "Ce que disent nos anciens partenaires",
		sub_heading:
			"Découvrez l'expérience des organisations qui ont soutenu les éditions précédentes de Hack the Hill.",
		t1: {
			name: "Maddie Whibbs",
			content: "Événement spectaculaire et bien organisé - j'ai adoré la foire des carrières!",
			role: "BlackBerry",
		},
		t2: {
			name: "Adam Laderoute",
			content: "Notre équipe a beaucoup apprécié l'événement. Bien géré et les organisateurs étaient excellents!",
			role: "CSE-CST",
		},
		t3: {
			name: "Britt Hayman",
			content:
				"Hack the Hill était un événement rempli de plaisir et d'innovation! En tant que partenaire de l'industrie, nous avons apprécié l'opportunité d'interagir avec des étudiants qui savent résoudre des problèmes de manière proactive et concrète et qui demeurent adaptables en termes de compétences. C'était une excellente introduction aux meilleurs talents de demain!",
			role: "Ciena",
		},
		t4: {
			name: "Nyah Wagner",
			content:
				"À Lonehaven, nous avons eu l'honneur de collaborer avec Hack the Hill, un événement exceptionnel rassemblant de jeunes esprits brillants. Notre expérience en tant qu'entreprise a été incroyablement positive, et nous avons été témoins des solutions innovantes ainsi que des capacités créatives de résolution de problèmes de ces étudiants talentueux.",
			role: "Lonehaven",
		},

		t6: {
			name: "Greg Suignard",
			content:
				"Un événement incroyable et un travail exceptionnel de la part de tous les organisateurs! J'aimerais remercier tous ceux qui ont mis de l'effort vers l'évenement et particulièrement ceux qui se sont attaqués à notre défi!",
			role: "Canadian Tire",
		},
		t7: {
			name: "Elmira Khani",
			content:
				"Travailler avec Hack the Hill a été une expérience fantastique. L'équipe est tellement organisée, dédiée et professionnelle - ils nous ont aidé à organiser un évenement incroyable, et nous avons été époustouflés par le montant de support reçu. Au plaisir de futures collaborations!",
			role: "Kinaxis",
		},
		aria_label_next: "Témoignage suivant",
		aria_label_prev: "Témoignage précédent",
		aria_label_dot: "Afficher le témoignage",
	},
	faq: {
		title: "Foire aux questions",

		q1: "Qu'est-ce qu'un hackathon?",
		a1: "Un hackathon est un événement de plusieurs jours où les participants forment des équipes pour bâtir des projets, apprendre de nouvelles compétences et transformer des idées en prototypes fonctionnels. À Hack the Hill, vous pourrez assister à des ateliers, rencontrer d'autres participants et des commanditaires, participer à des défis et profiter de repas, d'articles promotionnels et d'activités communautaires.",

		q2: "Combien ça coûte pour participer?",
		a2: "La participation à Hack the Hill est entièrement gratuite. Les repas, les collations, les articles promotionnels et la programmation de l'événement sont offerts sans frais aux participants.",

		q3: "Dois-je avoir de l'expérience?",
		a3: "Aucune expérience n'est nécessaire. Les débutants comme les participants expérimentés sont les bienvenus, et des ateliers ainsi que des mentors seront là pour vous aider à démarrer.",

		q4: "C'est mon premier hackathon. À quoi dois-je m'attendre?",
		a4: "Attendez-vous à une fin de semaine de création, d'apprentissage, de réseautage et de collaboration avec d'autres participants. L'événement commence le vendredi soir et se termine le dimanche après-midi. Vous pourrez assister à des ateliers, rencontrer des commanditaires, former une équipe et travailler sur un projet qui pourrait toucher au logiciel, au matériel, aux systèmes embarqués, aux politiques publiques ou à une combinaison de différentes approches.",

		q5: "Puis-je commencer à travailler sur mon projet avant le hackathon?",
		a5: "Non. Tous les projets doivent commencer après la cérémonie d'ouverture, le premier jour de l'événement. Vous pouvez réfléchir à des idées à l'avance, mais aucun code, élément de conception, document ou autre travail de projet ne doit être créé avant le début du hackathon.",

		q6: "Le hackathon est-il en ligne ou en personne?",
		a6: "Hack the Hill III aura lieu en personne à l'Université d'Ottawa.",

		q7: "Que devrais-je apporter?",
		a7: "Apportez votre ordinateur portable, votre chargeur, une carte étudiante ou une pièce d'identité délivrée par un gouvernement, des articles d'hygiène personnelle, un sac de couchage ou une couverture, ainsi que tout ce dont vous aurez besoin pour la fin de semaine. Nous fournirons les repas et les collations pendant tout le hackathon.",

		q8: "Qui peut participer?",
		a8: "Les étudiants universitaires et les diplômés récents sont invités à présenter leur candidature. Les élèves du secondaire à partir de la 11e année sont également les bienvenus.",

		q9: "Puis-je travailler en équipe?",
		a9: "Oui. Les équipes peuvent compter jusqu'à 4 participants.",

		q10: "Quels sont les thèmes de Hack the Hill?",
		a10: "Les thèmes du hackathon seront annoncés à l'approche de l'événement. Attendez-vous à des défis liés aux technologies civiques, aux technologies au service du bien public et à la résolution de problèmes concrets.",

		q11: "Le transport ou les remboursements de déplacement seront-ils offerts?",
		a11: "Nous ne sommes pas en mesure d'offrir des autobus ni de rembourser les frais de déplacement cette année. Nous encourageons les participants à faire du covoiturage ou à prévoir leur propre transport pour se rendre à l'événement.",
	},
	team: {
		title: "Notre équipe!",
		roles: {
			president: "Président",
			exec_vp: "Vice-présidence exécutive",
			at_large: "Directeur général",
			community: {
				vp: "Vice-présidence aux affaires communautaires",
				manager: "Gestionnaire de communauté",
				coordinator: "Coordonnateur de communauté",
				advisor: "Conseiller en communauté",
			},
			design: {
				vp: "Vice-présidence à la conception",
				manager: "Gestion de la conception",
				coordinator: "Coordination de la conception",
				advisor: "Fonction-conseil en conception",
			},
			development: {
				vp: "Vice-présidence au développement",
				manager: "Gestionnaire du développement",
				coordinator: "Coordonnateur du développement",
				advisor: "Conseiller en développement",
			},
			finance: {
				vp: "Vice-présidence aux finances",
				manager: "Gestionnaire des finances",
				coordinator: "Coordonnateur des finances",
				advisor: "Conseiller des finances",
			},
			logistics: {
				vp: "Vice-présidence à la logistique",
				manager: "Gestionnaire de la logistique",
				coordinator: "Coordonnateur de la logistique",
				advisor: "Conseiller de la logistique",
			},
			marketing: {
				vp: "Vice-présidence au marketing",
				manager: "Gestionnaire du marketing",
				coordinator: "Coordonnateur du marketing",
				advisor: "Conseiller du marketing",
			},
			partnerships: {
				vp: "Vice-présidence aux partenariats",
				manager: "Gestionnaire des partenariats",
				coordinator: "Coordonnateur des partenariats",
				advisor: "Conseiller des partenariats",
			},
			mascot: "Mascotte officielle",
		},
	},
	footer: {
		subscribe: "Recevoir des nouvelles",
		email_placeholder: "Courriel",
		email_label: "Adresse courriel",
		sending: "Envoi…",
		thanks: "Consultez votre boîte de réception et cliquez sur le lien de confirmation.",
		invalid_email: "Saisissez une adresse courriel valide.",
		rate_limited: "Réessayez dans un instant.",
		send_error: "Inscription impossible. Réessayez.",
		privacy: "Politique de confidentialité",
		copyright: "© 2026 Hack the Hill. Tous droits réservés.",
	},
	notification: {
		message: "Hack the Hill III aura lieu du 25 au 27 septembre 2026! Les candidatures sont maintenant ouvertes!",
		button_text: "Présentez votre candidature dès maintenant",
		close: "Fermer la notification",
	},
	"four-o-four": {
		title: "Oh non!",
		description: "Bea.var pense que vous avez perdu le nord...",
		button: "Retour à l'accueil",
		image_alt: "Bea.var, la mascotte castor de Hack the Hill",
	},
} as const;
