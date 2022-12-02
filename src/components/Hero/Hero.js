import "./Hero.css";
import { ReactComponent as HeroImg } from "../../assets/svgs/hth_hero_withoutbg.svg";
import BannerLogo from "../../assets/Logos/hthlogo_banner_ver.svg";

function Hero() {
	return (
		<>
			<div className="HeroHeading">
				<h3>
					University of Ottawa • February <time dateTime="03/02/2023">3</time>-
					<time datetime="05/02/2023">5</time>, 2023
				</h3>
				<img class="BannerLogo" src={BannerLogo} alt="Hack the Hill"></img>
				<h3>Canada's Capital Hackathon</h3>
				<a className="HeroButton" target="_blank" href="https://hackthehill.com/register" rel="noreferrer">
					<button>Register Now!</button>
				</a>
			</div>
			<HeroImg className="HeroImg" />
		</>
	);
}

export default Hero;
