export default {
	navbar: {
		links: { events: "Événements", blog: "Blog", documents: "Documents", team: "Équipe" },
		aria_label: "Barre de Navigation",
	},
	hero: { title: "Le Hackathon de la Capitale Canadienne" },
	about: {},
	stats: {},
	gallery: {
		title: "Où les Moments sont Créés",
		subtitle: "Revoyez certains des moments les plus mémorables de Hack the Hill !",
		button_text: "Plus d'info",
		albums: [
			{
				tag: "2023",
				card_title: "2023",
				title: "Événement Principal 2023",
				description:
					"Le point culminant de 2023, notre hackathon principal était un succès ! 600+ hackers, 10+ sponsors et 36 heures de hacking combinées pour créer une expérience inoubliable. Pour une première édition, c'était un énorme exploit !",
				img1: "/src/assets/gallery/hth1.webp",
				img2: "/src/assets/gallery/hth2.webp",
				link: "https://hackthehill.com",
			},
			{
				tag: "hackhers",
				card_title: "HackHers",
				title: "HackHers",
				description:
					"Un hackathon d'une journée en partenariat avec IEEE uOttawa et WIE uOttawa, une expérience unique qui défiait les attentes traditionnelles. Avec une salle de bien-être, un atelier spécial et des boissons rafraîchissantes, c'était un événement incontournable !",
				img1: "/src/assets/gallery/hackhers1.webp",
				img2: "/src/assets/gallery/hackhers2.webp",
				link: "https://hackthehill.com",
			},
			{
				tag: "panel",
				card_title: "Panel de Stagiaires",
				title: "Panel de Stagiaires",
				description:
					"Une nuit d'inspiration et d'apprentissage, le Panel de Stagiaires était une collaboration entre Hack the Hill et IEEE CU. Cinq stagiaires ont partagé leurs expériences et leurs idées, offrant une perspective unique sur l'avenir de la technologie.",
				img1: "/src/assets/gallery/panel1.webp",
				img2: "/src/assets/gallery/panel2.webp",
				link: "https://hackthehill.com",
			},
			{
				tag: "roast",
				card_title: "Évaluation de CV",
				title: "Évaluation de CV",
				description:
					"Cette session dynamique était dédiée à la revitalisation des CV. Que vous soyez étudiant, diplômé récent ou professionnel, un CV bien conçu peut être votre billet pour le succès.",
				img1: "/src/assets/gallery/roast1.webp",
				img2: "/src/assets/gallery/roast2.webp",
				link: "https://hackthehill.com",
			},
			{
				tag: "ciena",
				card_title: "Réseautage Ciena",
				title: "Réseautage Ciena",
				description:
					"Une soirée de réseautage exceptionnelle, l'événement de réseautage Ciena était une opportunité unique de se connecter avec les professionnels de Ciena et d'explorer des opportunités prometteuses dans le monde dynamique du réseautage.",
				img1: "/src/assets/gallery/ciena1.webp",
				img2: "/src/assets/gallery/ciena2.webp",
				link: "https://hackthehill.com",
			},
		],
	},
	sponsors: {},
	collaborators: {},
	testimonials: {
		title: "Créons des Moments Marquants",
		sub_heading:
			"À Hack the Hill, des étudiants de disciplines et d'horizons différents donnent vie à leurs idées en créant une communauté de collaboration, d'apprentissage et de plaisir. Ces expériences façonnent notre hackathon.",
		t1: {
			name: "Maddie Whibbs",
			content: "Événement spectaculaire et bien organisé - j'ai adoré la foire des carrières!",
			role: "Blackberry",
		},
		t2: {
			name: "Adam Laderoute",
			content: "Notre équipe a beaucoup apprécié l'événement. Bien géré et les organisateurs étaient excellents!",
			role: "CSE-CST",
		},
		t3: {
			name: "Britt Hayman",
			content:
				"Hack the Hill était un événement rempli de plaisir et d'innovation ! En tant que partenaire de l'industrie, nous avons apprécié l'opportunité d'interagir avec des étudiants qui savent résoudre des problèmes de manière proactive et concrète et qui demeurent adaptables en termes de compétences. C'était une excellente introduction aux meilleurs talents de demain!",
			role: "Ciena",
		},
		t4: {
			name: "Nyah Wagner",
			content:
				"À Lonehaven, nous avons eu l'honneur de collaborer avec Hack the Hill, un événement exceptionnel rassemblant de jeunes esprits brillants. Notre expérience en tant qu'entreprise a été incroyablement positive, et nous avons été témoins des solutions innovantes ainsi que des capacités créatives de résolution de problèmes de ces étudiants talentueux.",
			role: "Lonehaven",
		},

		t5: {
			name: "Hasin Zaman",
			content:
				"J'ai apprécié l'environment, la foule et les opportunités de résoudre toutes sortes de problèmes!",
			role: "Hacker chevroné(e) de Hack the Hill I",
		},
		t6: {
			name: "Greg Suignard",
			content:
				"Un événement incroyable et un travail exceptionnel de la part de tous les organisateurs ! J'aimerais remercier tous ceux qui ont mis de l'effort vers l'évenement et particulièrement ceux qui se sont attaqués à notre défi !",
			role: "Canadian Tire",
		},
		t7: {
			name: "Elmira Khani",
			content:
				"Travailler avec Hack the Hill a été une expérience fantastique. L'équipe est tellement organisée, dédiée et professionnelle - ils nous ont aidé à organiser un évenement incroyable, et nous avons été époustouflés par le montant de support reçu. Au plaisir de futures collaborations !",
			role: "Kinaxis",
		},
		aria_label_next: "Prochain Témoignage",
		aria_label_prev: "Témoignage Précédent",
		aria_label_dot: "Point Témoignage",
	},
	schedule: {
		title: "La Série du Hacker",
		events: [
			{
				title: "IEEE x HTH Atelier sur l'architecture de code intégré",
				month: "Mars",
				day: "14",
				time: "17h30 - 20h30 @ uOttawa",
				description:
					"Venez participer à un atelier enrichissant sur le matériel, animé par Eric Eaton de l'IEEE uOttawa. Plongez dans les subtilités de la conception matérielle et maîtrisez l'art de concevoir des projets évolutifs dans des environnements intégrés. Obtenez un aperçu inestimable des cas d'utilisation du monde réel, surmontez les défis courants rencontrés dans les systèmes intégrés et explorez les nuances des microcontrôleurs et du threading. Élargissez votre expertise en matière d'architecture matérielle et de code grâce à cette expérience d'apprentissage pratique.",
				status: "S'inscrire",
				link: "https://buytickets.at/hackthehill1/1173101",
				disabled: true,
			},
			{
				title: "Print and Pride",
				month: "Mars",
				day: "6",
				time: "18h30 - 20h30 @ MakerSpace uOttawa",
				description:
					"Bienvenue à Print & Pride, un événement conçu spécialement pour les étudiants 2SLGBTQIA+! Préparez-vous à une soirée relaxante où nous créerons un espace sécuritaire pour passer du temps ensemble et imprimer en 3D des objets d'artisanat queer. Choisis parmi quatre modèles, modifie-les pour qu'ils correspondent à ton style et laisse libre cours à ta créativité. Il ne s'agit pas seulement d'artisanat ; il s'agit d'être soi-même, de se connecter avec des gens géniaux et de s'imprégner des bonnes vibrations. Rejoignez-nous pour une nuit de plaisir, d'expression personnelle et de camaraderie queer-friendly à Print & Pride!",
				status: "S'inscrire",
				link: "https://www.tickettailor.com/events/hackthehill1/1154311",
				disabled: true,
			},
			{
				title: "BTA x HTH: Concours de Pitch Technovate",
				month: "Février",
				day: "25",
				time: "18h00 - 21h00 @ uOttawa",
				description:
					"Affinez vos compétences entrepreneuriales en participant au tout premier concours de pitch de Hack the Hill, en collaboration avec BTA. Rassemblez-vous en équipe, trouvez la prochaine grande idée et peaufinez votre présentation. Avec un conférencier invité, un atelier et un groupe de juges distingués, c'est un événement à ne pas manquer si vous voulez perfectionner l'art du pitch. Inscrivez-vous en équipe ou en tant qu'individu et mettez-vous au travail pour perfectionner votre présentation!",
				status: "Détails",
				link: "https://www.instagram.com/p/C3D4HMxRT0m/?img_index=1",
				disabled: false,
			},
			{
				title: "HackHers",
				month: "Février",
				day: "3",
				time: "9h00 - 22h30 @ CRX",
				description:
					"Profitez d'une journée de bien-être et de hacking à l'occasion du partenariat de Hack the Hill avec WIE uOttawa et Carleton pour offrir un hackathon d'une seule journée consciente. Expérimentez un hackathon comme aucun autre, en brisant les attentes traditionnelles et en offrant une toute nouvelle expérience. Avec des boissons et des aliments rafraîchissants, dont du thé et du café glacé, une salle de bien-être et un atelier spécial, ce hackathon défiera les attentes et deviendra l'événement incontournable du trimestre.",
				status: "Détails",
				link: "https://hack-hers.devpost.com/?ref_feature=challenge&ref_medium=discover",
				disabled: false,
				exception: true,
			},
			{
				title: "Kinaxis x CCSS x HTH Événement de Réseautage",
				month: "Janvier",
				day: "30",
				time: "18h30 - 20h30 @ Richcraft Hall 2200",
				description:
					"Rejoignez-nous pour une expérience de réseautage exclusive organisée par Kinaxis, CCSS et Hack the Hill. Élevez votre carrière aux côtés de professionnels chevronnés et d'enthousiastes partageant les mêmes idées. Cet événement dynamique offre plus qu'un simple réseautage traditionnel - attendez-vous à des conversations engageantes, des informations précieuses et l'opportunité de créer des liens durables. Ne manquez pas cette soirée transformative où les connexions mènent à d'innombrables possibilités.",
				status: "Détails",
				link: "https://www.instagram.com/p/C2NX8P7x7B1/",
				disabled: false,
			},
			{
				title: "Panel Women @ Ciena x HTH",
				month: "Janvier",
				day: "24",
				time: "18h30 - 20h30 @ STM 117",
				description:
					"Rassemblez-vous pour une soirée informative alors que Hack the Hill collabore avec Women@Ciena pour un panel passionnant avec 5 panélistes distingués, représentant tous des rôles différents au sein de Ciena. Écoutez-les partager leur histoire, leurs expériences et leurs succès dans l'industrie technologique et fournir des connaissances pour ceux qui sont au début de leur carrière. La diversité des rôles et des expériences vous inspirera vraiment, et c'est un événement à ne pas manquer.",
				status: "Détails",
				link: "https://www.instagram.com/p/C18WYezNTGT",
				disabled: false,
			},
			{
				title: "HTH x DESoc Atelier de Soudure",
				month: "Janvier",
				day: "18",
				time: "18h00 - 20h00 @ Mackenzie Building 4377",
				description:
					"Venez participer à un atelier excitant en collaboration avec DESoc Carleton. Apprenez l'une des bases du matériel informatique en développant vos compétences en soudure, avec l'aide de mentors expérimentés de Carleton.",
				status: "Détails",
				link: "https://www.instagram.com/p/C1265ENRWhO/",
				disabled: false,
			},
			{
				title: "Code, Café et Cram",
				month: "Décembre",
				day: "2",
				time: "18h30 - 20h30 @ STM 117",
				description:
					"Préparez-vous à enflammer votre parcours académique alors que 'Code, Café et Cram' vous emmène sur un chemin revigorant vers la réussite. En préparation des prochains examens d'hiver, cette session unique offre aux étudiants une opportunité de se détendre et de participer à des sessions d'études complètes. Rejoignez-nous dans un espace conçu pour vous aider à libérer votre potentiel académique, où vous pourrez vous connecter à vos cours et élever votre compréhension. Préparez-vous aux examens d'hiver comme jamais auparavant - avec le mélange idéal de code, de caféine et de concentration.",
				status: "Plus d'info",
				link: "https://www.tickettailor.com/events/hackthehill1/1074825",
				disabled: true,
			},
			{
				title: "Capture le Drapeau",
				month: "Novembre",
				day: "25",
				time: "12h00 - 16h00 @ CBY A03 & A04",
				description:
					"Rejoignez-nous pour le défi ultime de cybersécurité organisé en collaboration avec le Club de cybersécurité de l'Université d'Ottawa. uOCTF est une compétition passionnante de Capture the Flag où vous testerez vos compétences en hacking et en cybersécurité, ce qui vous obligera à exploiter des vulnérabilités et à résoudre des énigmes.",
				status: "Plus d'info",
				link: "https://www.linkedin.com/posts/hackthehill_hackthehill-uoctf-hackingcompetition-activity-7128839548289060864-FKsg/?utm_source=share&utm_medium=member_desktop",
			},
			{
				title: "Atelier Chatbot sur la cybersécurité",
				month: "Novembre",
				day: "21",
				time: "18h00 - 19h30 @ STEM117",
				description:
					"Découvrer le potentiel des modèles OpenAI GPT et des API Python lors de notre atelier avec l'Association des étudiants en informatique (AÉI). Les participants ont joué un rôle dans la création de leur premier chatbot de cybersécurité, en acquérant des connaissances précieuses sur l'intelligence artificielle, le traitement du langage naturel et la programmation Python. Améliorez vos compétences grâce à cette fusion innovante de cybersécurité et de développement de chatbot.",
				status: "Plus d'info",
				link: "https://www.tickettailor.com/events/hackthehill1/1065666",
				disabled: true,
			},
			{
				title: "Session d'information avec Nokia",
				month: "Novembre",
				day: "21",
				time: "13h00 - 15h00 @ CBY A707",
				description:
					"Plongez dans le monde de la technologie avec notre session d'information Nokia, organisée en collaboration avec l'Association de la technologie des affaires (BTA). Explorez les dernières innovations et les idées que Nokia apporte à la table, permettant aux participants d'acquérir des connaissances concernant l'intersection des affaires et de la technologie.",
				status: "Plus d'info",
				link: "https://www.linkedin.com/posts/hackthehill_the-videos-dont-lie-we-had-an-awesome-activity-7132886003547082752-boIm/?utm_source=share&utm_medium=member_desktop",
			},
			{
				title: "Panel de Stagiaires",
				month: "Novembre",
				day: "15",
				time: "18h30 - 20h30 @ Théâtre Bell Carleton",
				description:
					"Préparez-vous à une expérience enrichissante alors que Hack the Hill et IEEE Carleton unissent leurs forces pour présenter un panel composé de cinq stagiaires issus d'horizons professionnels divers. Ces stagiaires accomplis sont réunis pour partager leurs expériences et leurs idées aux multiples facettes, offrant ainsi une perspective unique sur les domaines de la technologie et de l'innovation. Attendez-vous à être à la fois informé et inspiré par la diversité et le talent exceptionnels que ces stagiaires représentent collectivement alors qu'ils vous guident dans une exploration approfondie de l'avenir de la technologie.",
				status: "Plus d'info",
				link: "https://www.linkedin.com/posts/hackthehill_step-into-the-tech-world-mark-your-calendars-activity-7125703991358836738-cpfF/?utm_source=share&utm_medium=member_desktop",
			},
			{
				title: "Soirée de Jeu Cryptée",
				month: "Novembre",
				day: "8",
				time: "19h00 - 20h30 @ STM117",
				description:
					"Explorez l'univers du jeu lors de la Soirée de Jeu Cryptée le 8 novembre à 19h00 au STM 117 de l'Université d'Ottawa. Présenté par uO GDC x HtH, cet événement captivant vous réserve une soirée animée, riche en jeux passionnants, compétitions amicales et l'opportunité de créer des liens avec d'autres passionnés de jeux.",
				status: "Plus d'info",
				link: "https://www.instagram.com/p/CzC8SiONBTs/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA==",
			},
			{
				title: "Événement de réseautage avec Ciena",
				month: "Octobre",
				day: "17",
				time: "18h30 - 20h00 @ Ollie's Pub & Patio",
				description:
					"Immergez-vous dans une soirée de réseautage exceptionnelle lors de l'événement d'interconnexion de Ciena le 17 octobre à 18h30 au Ollie's Pub & Patio, à l'Université Carleton. Organisée par SCESoc x HtH, cette opportunité exclusive vous permettra d'établir des contacts directs avec les professionnels de Ciena, offrant ainsi une occasion unique de tisser des liens, d'acquérir des connaissances et d'explorer des opportunités prometteuses dans le monde dynamique du réseautage.",
				status: "Plus d'info",
				link: "https://www.linkedin.com/posts/cuscesoc_cienanetworkingevent-networkingopportunities-ugcPost-7117633554410262528-tRz9?utm_source=share&utm_medium=member_desktop",
			},
			{
				title: "Sauvetage de CV",
				month: "Octobre",
				day: "10",
				time: "19h00 - 21h00 @ STM 117",
				description:
					"Votre CV mérite une refonte. Que vous soyez étudiant, diplômé récent ou professionnel, un CV bien conçu peut être votre billet pour le succès. Laissez Hack the Hill vous guider pour sauver votre CV de l'ordinaire. Rejoignez Hack the Hill pour une session dynamique dédiée à la revitalisation de vos CV!",
				status: "Plus d'info",
				link: "https://www.linkedin.com/posts/hackthehill_ignite-your-career-potential-at-resume-activity-7115750458224189440-7U2-?utm_source=share&utm_medium=member_desktop",
			},
			{
				title: "Intro sur le développement de jeux",
				month: "Septembre",
				day: "29",
				time: "19h00 - 21h00 @ STM 117",
				description:
					"Participez à une aventure immersive dans le monde du développement de jeux avec 'Level One Labs' le 29 septembre à 19h00, à la salle STM 117 de l'Université d'Ottawa. Cette session pratique, orchestrée par uO GDC x HtH, s'engage à dévoiler les mystères de la conception de jeux, la rendant accessible aussi bien aux passionnés qu'aux novices.",
				status: "Plus d'info",
				link: "https://www.linkedin.com/posts/hackthehill_you-all-have-spoken-and-we-have-listened-activity-7113260301239627777-JTEZ?utm_source=share&utm_medium=member_desktop",
			},
		],
		less: "Afficher moins",
		more: "Afficher plus",
	},
	footer: {
		constitution: "Constitution",
		privacy: "Politique de Confidentialité",
		message: "par l'Équipe Web de HtH",
	},
} as const;
