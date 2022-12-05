import "./Footer.css";
import React from "react";
import FooterLogo from "../../assets/Logos/hthlogo_banner_ver.svg";
import "boxicons";

function Footer() {
	return (
		<div className="Footer">
			<div className="FooterBody">
				<div className="FooterLogo">
					<img src={FooterLogo} alt="Logo" />
				</div>
				<div className="LogoText">
					<p>Canada's Capital Hackathon</p>
				</div>
				<div class="FooterContainer">
					<div className="MediaLinks">
						<a href="https://www.facebook.com/canadascapitalhackathon" target="_blank" rel="noreferrer">
							<box-icon color="#3B4779" animation="tada-hover" type="logo" name="facebook-square" />
						</a>
						<a href="https://twitter.com/hackthehiII" target="_blank" rel="noreferrer">
							<box-icon color="#3B4779" animation="tada-hover" name="twitter" type="logo" />
						</a>
						<a href="https://www.instagram.com/hackthehill/" target="_blank" rel="noreferrer">
							<box-icon color="#3B4779" animation="tada-hover" name="instagram" type="logo" />
						</a>
						<a href="https://www.tiktok.com/@hackthehill" target="_blank" rel="noreferrer">
							<box-icon color="#3B4779" animation="tada-hover" name="tiktok" type="logo" />
						</a>
						<a href="https://www.linkedin.com/company/hackthehill/" target="_blank" rel="noreferrer">
							<box-icon color="#3B4779" animation="tada-hover" name="linkedin" type="logo"></box-icon>
						</a>
						<a href="https://www.medium.com/@hackthehill" target="_blank" rel="noreferrer">
							<box-icon color="#3B4779" animation="tada-hover" name="medium" type="logo"></box-icon>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Footer;
