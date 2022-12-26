import React from "react";
import "./SponsorShowcase.css";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Button, useMediaQuery, useTheme, darken, Grid } from '@mui/material';
import lonehaven from '../../assets/Logos/lonehaven.svg';
import Ciena from '../../assets/Logos/Ciena.svg';
import Google from '../../assets/Logos/Google.svg';
import StackOverFlow from '../../assets/Logos/StackOverFlow.svg';
import Github from '../../assets/Logos/github.svg';
import DotTech from '../../assets/Logos/DotTech.svg';
import OSP from '../../assets/Logos/OSP.png';
import uOttawaEngineering from '../../assets/Logos/uOttawaEngineering.png';
import EEF from '../../assets/Logos/eef_logo.svg';
import NDL from '../../assets/Logos/NDL.webp';
import uOttawa from '../../assets/Logos/university-of-ottawa-seeklogo.com.svg';
import uocs from '../../assets/Logos/uocsclub.svg';
import uogdc from '../../assets/Logos/uOttawaGDC_FullLogo.png';

function SponsorShowcase() {

  const data = {
    "sponsors": [
      {href: "https://ciena.ca/", src: Ciena},
      {href: "https://google.com/about/", src: Google},
      {href: "https://www.lonehaven.com/", src: lonehaven},
    ],
    "collaborators": [
      {href: "https://www2.uottawa.ca/en", src: uOttawa},
      {href: "https://www.facebook.com/uottawaeeffdg/", src: EEF},
      {href: "https://uocsclub.ca/", src: uocs},
      {href: "https://www.instagram.com/uogamedev/", src: uogdc},
    ]
  };
  
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

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
            {data.sponsors.map(sponsor =>
              <Grid item direction="column" className ="SponsorIconBox" sx={{mt: matchesLG ? '50px' : '0px', mb: matchesLG ? '25px' : '0px'}}>
                <a href={sponsor.href}><img className="SponsorIcon" alt="SponsorIcon" src={sponsor.src}></img></a>
              </Grid>
            )}
          </Grid>
        <h1>Community Partners</h1>

          <Grid container id="SponsorsDisplay" className="SponsorsDisplay">
              {data.collaborators.map(sponsor =>
                <Grid item direction="column" className ="SponsorIconBox" sx={{mt: matchesLG ? '50px' : '0px', mb: matchesLG ? '25px' : '0px'}}>
                  <a href={sponsor.href}><img className="SponsorIcon" alt="SponsorIcon" src={sponsor.src}></img></a>
                </Grid>
              )}
          </Grid>
      </div>
    );
  }

export default SponsorShowcase;
