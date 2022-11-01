import React, { Component } from "react";
import "./About.css";

class About extends Component {
  render() {
    return (
      <div className="About">
        <h1>About Us</h1>
        <div class="borderL">
          <div class="about-body">
            Are you looking to network, create a project to 
            tackle some of the world's problems, and pick up a few new technical skills over 36 hours?
            You're in luck! Hack the hill is a 36-hour, Ottawa-wide, hackathon hosted at the University
            of Ottawa by the IEEE uOttawa Student Branch, Computer Science Student Association, 
            Engineering Student Association, and Software Engineering Student Association. 
          </div>
        </div>
      </div>
    );
  }
}

export default About;