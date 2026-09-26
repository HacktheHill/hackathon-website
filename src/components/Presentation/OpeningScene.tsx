import opening from "../../../public/art/presentation/opening/manifest.json";

const WIDTH = 1600;
const scale = WIDTH / opening.canvasWidth;

export function OpeningArtwork() {
	return (
		<>
			{opening.layers.map(layer => (
				<img
					key={layer.name}
					data-opening-layer={layer.name}
					src={`/art/presentation/opening/${layer.name}.webp`}
					alt=""
					width={layer.width}
					height={layer.height}
					draggable={false}
					style={{
						left: layer.x * scale,
						top: layer.y * scale,
						width: layer.width * scale,
						...(layer.name.startsWith("cloud") && {
							"--cloud-start": `${-(layer.x + layer.width) * scale}px`,
							"--cloud-distance": `${WIDTH + layer.width * scale}px`,
							// Start in the original position and wrap only when fully offscreen.
							animationDelay: `calc(-1 * ${((layer.x + layer.width) * scale) / (WIDTH + layer.width * scale)} * var(--cloud-duration))`,
						}),
					}}
				/>
			))}
		</>
	);
}

export function OpeningBranding() {
	return (
		<>
			<img
				className="cover-wordmark"
				src="/art/presentation/opening/wordmark.webp"
				alt="Hack the Hill III"
				width={opening.wordmark.width}
				height={opening.wordmark.height}
				style={{
					left: opening.wordmark.x * scale,
					top: opening.wordmark.y * scale,
					width: opening.wordmark.width * scale,
				}}
			/>
			<p className="event-date">Sept. 25-27 @ uOttawa</p>
		</>
	);
}
