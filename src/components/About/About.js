import React, { Component } from "react";
import "./About.css";

class About extends Component {
  render() {
    return (
      <div className="About">
        <h1>About Us</h1>
        <div class="borderL">
          <div class="about-body">
          Hack the Hill is the capital of Canada's largest and most diverse 
          hackathon. Each year, our hackathon partners with four major 
          student associations at the University of Ottawa; the Engineering Student
           Society, IEEE uOttawa Student Branch, Computer Science Student Association, 
           and Software Engineering Student Association. With over 50 supporting 
           members, we strive to provide students across North America with unmatched 
           opportunities in hardware, software and game development fields!
          </div>
        </div>
      </div>
    );
  }
}

export default About;