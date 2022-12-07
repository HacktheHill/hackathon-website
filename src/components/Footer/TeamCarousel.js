import "./TeamCarousel.css";
import "boxicons";

export default function TeamCarousel() {
	// TODO: This is just a placeholder for the team members
	const team = Array.from({ length: 20 }, (_, i) => ({
		name: `Team Member ${i + 1}`,
		image: `https://picsum.photos//seed/${i + 1}/${200 + i * 10}/${200 + i * 10}`,
		title: "Developer",
		contact: [
			{
				icon: "globe",
				link: "https://www.google.com",
			},
			{
				icon: "github",
				link: "https://github.com/",
			},
			{
				icon: "linkedin",
				link: "https://linkedin.com/",
			},
			{
				icon: "twitter",
				link: "https://twitter.com/",
			},
			{
				icon: "instagram",
				link: "https://instagram.com/",
			},
		],
		about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vitae ultricies lacinia, nunc nisl ultricies nunc, nec ultricies nisl nunc vel nunc. Sed euismod, nisl vitae ultricies lacinia, nunc nisl ultricies nunc, nec ultricies nisl nunc vel nunc.",
	}));

	// Track whether the carousel and its cards are being hovered
	function handleHoverToggle({currentTarget}) {
		currentTarget.classList.toggle("CarouselHover");
		currentTarget.closest(".CarouselTrack").classList.toggle("CarouselHover");
	}

	function handleHoverStart({currentTarget}) {
		currentTarget.classList.add("CarouselHover");
		currentTarget.closest(".CarouselTrack").classList.add("CarouselHover");
	}

	function handleHoverEnd({currentTarget}) {
		currentTarget.classList.remove("CarouselHover");
		currentTarget.closest(".CarouselTrack").classList.remove("CarouselHover");
	}

	return (
		<div className="TeamCarousel">
			<div
				className="CarouselTrack"
				style={{
					"--carousel-track-width": `calc((200px + 1rem) * ${team.length})`,
				}}
			>
				{[...team, ...team].map(member => (
					<div
						className="CarouselCard"
						onTouchStart={handleHoverToggle}
						onMouseEnter={handleHoverStart}
						onMouseLeave={handleHoverEnd}
					>
						<figure className="CarouselCardContent CarouselCardFront">
							<img src={member.image} alt={member.name} />
							<figcaption>
								<h3 className="CarouselCardName">{member.name}</h3>
								<p className="CarouselCardTitle">{member.title}</p>
							</figcaption>
						</figure>
						<figure className="CarouselCardContent CarouselCardBack">
							<h3 className="CarouselCardName">{member.name}</h3>
							<p className="CarouselCardTitle">{member.title}</p>
							<p className="CarouselCardAbout">{member.about}</p>
							<div className="CarouselCardContact">
								{member.contact.map(contact => (
									<a href={contact.link} target="_blank" rel="noreferrer">
										<box-icon
											color="#3B4779"
											animation="tada-hover"
											name={contact.icon}
											type="logo"
										/>
									</a>
								))}
							</div>
						</figure>
					</div>
				))}
			</div>
		</div>
	);
}
