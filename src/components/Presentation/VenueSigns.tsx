import { venueRules } from "./presentationContent";

const illustrations = [
	{ name: "burger", en: "No Food", fr: "Nourriture interdite" },
	{ name: "smoke", en: "No Smoking", fr: "Interdiction de fumer" },
	{ name: "power", en: "Outlet Restrictions", fr: "Restrictions sur les prises" },
];

export default function VenueSigns({ language }: { language: number }) {
	return (
		<div className="guidelines-stage" data-language={language === 0 ? "en" : "fr"}>
			<div className="guidelines">
				{venueRules.map((rule, index) => (
					<div className="venue-sign-card" key={rule.title}>
						<div className="venue-sign-tilt" style={{ transform: `rotate(${[0, 6.4, 0][index]}deg)` }}>
							<div className="venue-sign-flipper">
								{(["en", "fr"] as const).map((locale, languageIndex) => (
									<div
										key={locale}
										className="venue-sign-face"
										lang={locale}
										aria-hidden={language !== languageIndex}
									>
										<img
											className="guideline-sign"
											src={`/art/presentation/socials-road-sign${locale === "fr" ? "-fr" : ""}.webp`}
											alt=""
										/>
										<div
											className="venue-shadow-clip"
											aria-hidden="true"
											style={{
												maskImage: `url(/art/presentation/socials-road-sign${locale === "fr" ? "-fr" : ""}.webp)`,
											}}
										>
											<div className="venue-icon-shadow" />
										</div>
										<strong className="guideline-number">0{index + 1}</strong>
										<div className="guideline-lettering">
											<div className="guideline-label">
												<h3>{locale === "en" ? rule.title : rule.french}</h3>
											</div>
											<div className="guideline-details">
												<p>{locale === "en" ? rule.details : rule.detailsFrench}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
						<img
							className="venue-icon-sign"
							src={`/art/presentation/venue-icons/${illustrations[index].name}.png`}
							alt={illustrations[index][language === 0 ? "en" : "fr"]}
							width={372}
							height={835}
							draggable={false}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
