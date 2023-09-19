import "./TeamCarousel.css";

export default function TeamCarousel() {
	// TODO: This is just a placeholder for the team members, we need headshots
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
	function handleHoverToggle({ currentTarget }) {
		currentTarget.classList.toggle("carousel-hover");
		currentTarget.closest(".carousel-track").classList.toggle("carousel-hover");
	}

	function handleHoverStart({ currentTarget }) {
		currentTarget.classList.add("carousel-hover");
		currentTarget.closest(".carousel-track").classList.add("carousel-hover");
	}

	function handleHoverEnd({ currentTarget }) {
		currentTarget.classList.remove("carousel-hover");
		currentTarget.closest(".carousel-track").classList.remove("carousel-hover");
	}

	return (
		<div className="team-carousel">
			<div
				className="carousel-track"
				style={{
					"--carousel-track-width": `calc((100px + 1rem) * ${team.length})`,
				}}
			>
				{[...team, ...team].map(member => (
					<div
						className="carousel-card"
						onTouchStart={handleHoverToggle}
						onMouseEnter={handleHoverStart}
						onMouseLeave={handleHoverEnd}
						key={member.name}
					>
						<figure className="carousel-card-content carousel-card-front">
							<img src={member.image} alt={member.name} />
						</figure>
						<figure className="carousel-card-content carousel-card-back">
							<h3 className="carousel-card-name">{member.name}</h3>
							<p className="carousel-card-title">{member.title}</p>
						</figure>
					</div>
				))}
			</div>
		</div>
	);
}
