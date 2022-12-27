import BannerLogo from "../../assets/Logos/hthlogo_banner_ver.svg";
import LocationPin from "../../assets/svgs/location_pin.svg";
import "./Hero.css";
import HeroImg from "./HeroImg";

function Hero() {
	return (
		<div className="Hero">
			<div className="HeroHeading">
				<div className="LocationDateHeading">
					<h3>
						<img className="LocationPin" src={LocationPin} alt="Location Pin" /> Hybrid
						<strong> @ uOttawa</strong>
					</h3>
					<h3>
						Feb &nbsp;
						<time dateTime="03/02/2023">3</time>&ndash;
						<time dateTime="05/02/2023">5</time>, <strong>2023</strong>
					</h3>
				</div>
				<h1>
					<img className="BannerLogo" src={BannerLogo} alt="Hack the Hill"></img>
				</h1>
				<h2>Canada's Capital Hackathon</h2>
				<h3>University of Ottawa &times; Carleton University</h3>
				<a className="HeroButton" target="_blank" href="https://hackthehill.com/register" rel="noreferrer">
					<button>Register Now!</button>
				</a>
			</div>
			<HeroImg />
		</div>
	);
}

export default Hero;
