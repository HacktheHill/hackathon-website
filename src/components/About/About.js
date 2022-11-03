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
            Hack the Hill is an internationally-hosted hackathon taking place in the 
            heart of Canada's very own capital! In collaboration with the University of Ottawa's 
            Engineering Faculty, four major student organizations stepped up to establish Hack the Hill 
            with the goal of setting the standard for how hackathons are operated.
            <br></br>
            <br></br>
            The uOttawa Engineering Student Society, IEEE uOttawa Student Branch, Computer Science Student Association 
            and Software Engineering Student Association are proud to bring a flagship 
            hackathon to Ottawa where students can network and compete with the best! 
            With a series of monthly events leading into our main hackathon, 
            hackers will be provided numerous opportunities to brush up on their technical 
            skills, network with peers and even learn from notable alumni and business leaders! 
            Our main event is scheduled for February 2023 and will be free for all participants.
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