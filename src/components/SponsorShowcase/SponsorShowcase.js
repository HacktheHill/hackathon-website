import React from "react";
import "./SponsorShowcase.css";
import { Button, useMediaQuery, useTheme, darken, Grid } from '@mui/material';
import LoneHeaven from '../../assets/Logos/placeholder_small.svg';
import StackOverFlow from '../../assets/Logos/Stack_Overflow.svg';
import MLH from '../../assets/Logos/Mlh-logo-color.svg';
import Github from '../../assets/Logos/github.svg';

function SponsorShowcase() {
  
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"))
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"))
  const matchesLG = useMediaQuery(theme.breakpoints.down("lg"));

    return (
      <div className="Sponsors">
        <h1>Sponsors</h1>
        <div className="out">
          <div class="sponsors-body">
            <p class="text">
            Hack the Hill is made possible by our generous sponsors.
            Interested in supporting the capital’s hackathon?
              </p>
              <Button href={`mailto:sponsorship@hackthehill.com`} sx={{
              backgroundColor: '#5C71AD',
              borderRadius: '100px',
              color: 'white',
              mt: matchesSM ? '7vw' : '2vw',
              p: '10px',
              textTransform: 'none',
              minWidth: '12%',
              width: matchesSM ? '50%' : matchesLG ? '20%' : '0%',
              transition: '1s',
              ml: '2.5%',
              '&:hover': {
                backgroundColor: darken('#5C71AD', 0.3)
              }
            }}>
              <p class='ButtonText'>Get in touch</p>
            </Button>
          </div> 
        </div>
            <Grid container id="SponsorsDisplay" className="SponsorsDisplay">
              <Grid item direction="column" className ="SponsorIconBox">
                <a href="https://stackoverflow.com/"><img className="SponsorIcon" alt="SponsorIcon" src={StackOverFlow}></img></a>
              </Grid>
              <Grid item direction="column" className ="SponsorIconBox">
                <a href="https://mlh.io/"><img className="SponsorIcon" alt="SponsorIcon" src={MLH}></img></a>
              </Grid>
              <Grid item direction="column" className ="SponsorIconBox">
                <a href="https://github.com/about"><img className="SponsorIcon" alt="SponsorIcon" src={Github}></img></a>
              </Grid>
              <Grid item direction="column" className ="SponsorIconBox">
                <a href="https://www.lonehaven.com/"><img className="SponsorIcon" alt="SponsorIcon" src={LoneHeaven}></img></a>
              </Grid>
            </Grid> 
      </div>
    );
  }

export default SponsorShowcase;