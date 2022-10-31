import React, { Component } from "react";
import Logo from './laptop_asset.svg';
import "./SponsorShowcase.css";

class SponsorShowcase extends Component {
  render() {
    return (
      <div className="Sponsors">
          <h3>Sponsors</h3>
        <div class="vl"><div class="sponsors-body">Hack the Hill is made possible by our generous sponsors. 
        Interested in supporting one of Ottawa’s largest hackathons?</div>
        </div>
          <div class="logo">
              <img src={Logo} alt="React Logo" />
          </div>
      </div>
    );
  }
}

export default SponsorShowcase;