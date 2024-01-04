export default {
	navbar: {
		links: {
			about: "About",
			sponsors: "Sponsors",
			hacker: "The Hacker Series",
			headshots: "Meet the Team",
			collaborators: "Collaborators",
			faq: "FAQ",
		},
		aria_label: "Navigation Bar",
	},
	hero: {
		hybrid: "Hybrid",
		at: "@",
		pin_alt: "Location Pin",
		h2: "Canada's Capital Hackathon",
		h3: "Ottawa's Largest Hackathon",
		more: "Rewatch!",
		link: "https://www.youtube.com/watch?v=MXwlAdZL3t0&ab_channel=Lonehaven",
	},
	about: {
		title: "About Us",
		img_alt: "Bea.var, the Hack the Hill Mascot",
		p1: "The University of Ottawa and Carleton University STEM Student Organizations are incredibly excited to introduce Canada's Capital Hackathon!",
		p2: 'Hack the Hill was established to set a new standard for hackathon operations! With a series of monthly events, also known as "The Hacker Series," hackathon participants will be provided numerous opportunities to brush up on their technical skills, network with peers and even learn from notable alumni and business leaders!',
		p3: "Our main event is scheduled for March 3rd to 5th, 2023, and will be free for all participants. We look forward to seeing you all at our flagship hackathon and hope you're prepared to compete & network with the best!",
	},
	sponsors: {
		title: "Sponsors",
		icon_alt: "Sponsor Icon",
		p: "Hack the Hill is made possible by our generous sponsors. Interested in supporting the capital's hackathon?",
		button: "Become a sponsor",
	},
	partners: {
		title: "Community Partners",
		icon_alt: "Community Partner Icon",
	},
	schedule: {
		title: "The Hacker Series",
		events:{
			event1: {
				title: "Resume Roast",
				month: "November",
				day:"16",
				time: "7 p.m. - 9 p.m. @ STM 117",
				description:
					"Need resume advice on the spot? Hang out with some developers from Ciena and Microsoft as they review and evaluate resumes submitted by students, all while filling yourself up with some fresh pizza.",
				status: "View Video",
				link:"https://youtu.be/zpixm4xz_K4",
				btn_Status: "",
			},
			event2: {
				title: "Coffee, Code, and Cram",
				month: "November",
				day:"30",
				time: "7 p.m. - 9 p.m. @ STM 117",
				description:
					"Unwind and take a break from school. Join us alongside the uOttawa Computer Science Club for an evening of socializing and coding with coffee, tea, and snacks.",
				status: "Completed",
				link:"https://forms.gle/WUgn5g8XTjNf9Eq39",
				btn_Status: "disabled",
			},
			event3: {
				title: "Wicked Web Work",
				month: "January",
				day:"11",
				time: "6 p.m. - 10 p.m. @ STM 117",
				description:
					"Explore the wonders of front-end development! Learn the basics through workshops and participate in a one-hour challenge to build a website according to provided guidelines.",
				status: "Completed",
				link:"",
				btn_Status: "disabled",
			},
			event4: {
				title: "Got Games?",
				month: "January",
				day:"25",
				time: "7 p.m. - 9 p.m. @ STM 117",
				description:
					"Discover the best that game development has to offer! Join us along side the uOttawa Game Development Club for an introduction to Unity workshop.",
				status: "View Video",
				link:"https://youtu.be/mbr4ZmXtx0k",
				btn_Status: "",
			},
		},
	},
	collaborators: { title: "Collaborators" },
	faq: {
		title: "Frequently Asked Questions",

		q1: "What is a hackathon?",
		a1: "A hackathon is a large-scale event where people design and build a project from scratch.",

		q2: "How much does it cost to participate?",
		a2: "It's completely free to attend! There is no cost to participate! We cover the cost of food at the event and provide swag for all participants.",

		q3: "Do I need any experience?",
		a3: "No experience is needed! There will be workshops to teach you everything you need to know to hack at Hack the Hill.",

		q4: "This is my first hackathon, what should I expect?",
		a4: "36 hours of networking with our sponsors, learning, and collaborating with other hackers. As a first-time hacker, you can participate in our workshops to learn the basics of web development, game development, and hardware development.",

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
	},
	footer: {
		title: "Canada's Capital Hackathon",
		description: "Control the Capital, Command the Cabinet, Build until you Hack the Hill",
		github: "Source Code",
	},
	notification: {
		message:
			'Did you hear about the Fulcrum Article about Hack the Hill? UOTTA GO TO HACK THE HILL. Check out the "Science & Tech" Section of the Fulcrum and look for "Ready, Set, Hack" to learn more about what you can expect at Hack the Hill from some of our event directors. Thank you to Fulcrum for the post!',
		button_text: "Read Article",
		close: "Close Notification",
	},
	headshot: {
		imgAlt: "Image of ",

		team_codir_f: "Co-Director",
		team_codir_m: "Co-Director",
		team_community: "Community",
		team_design: "Design",
		team_development: "Development",
		team_finance: "Finance",
		team_logistics: "Logistics",
		team_marketing: "Marketing",
		team_sponsorship: "Sponsorship",

		role_dir_f: "Director",
		role_dir_m: "Director",
		role_coord_f: "Coordinator",
		role_coord_m: "Coordinator",
	},
} as const;
