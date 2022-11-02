import React, { Component } from "react";
import { Grid, Stack, Box } from "@mui/material";
import "./About.css";
import Mascot from '../../assets/Logos/mascot_nametag_waving.svg';

class About extends Component {
  render() {
    return (
      <div className="About" id="About">
        <h1>About Us</h1>
        <Stack direction = {{xs: "column", md: "row"}} spacing={10}>
          <div class="about-body">
            <p>
              Hack the Hill is the capital of Canada's largest and most diverse 
              hackathon. Each year, our hackathon partners with four major 
              student associations at the University of Ottawa; the Engineering Student
              Society, IEEE uOttawa Student Branch, Computer Science Student Association, 
              and Software Engineering Student Association. With over 50 supporting 
              members, we strive to provide students across North America with unmatched 
              opportunities in hardware, software and game development fields!
            </p>
          </div>
          <div class="mascot1">
            <img class="mascot1" src={Mascot}></img>
          </div>
      </Stack>
    </div>
    );
  }
}

export default About;