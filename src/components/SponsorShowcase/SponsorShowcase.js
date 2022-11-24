import React from "react";
import "./SponsorShowcase.css";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Button, useMediaQuery, useTheme, darken, Grid } from '@mui/material';
import LoneHeaven from '../../assets/Logos/Lonehaven.svg';
import StackOverFlow from '../../assets/Logos/StackOverFlow.svg';
import MLH from '../../assets/Logos/MLH.svg';
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
                <Grid item direction="column" className ="SponsorIconBox">
                  <a href="https://get.tech/"><img className="SponsorIcon" alt="SponsorIcon" src={DotTech}></img></a>
                </Grid>
            </Grid>
        <h1>  </h1>
        <h1>Community Partners</h1>

        
          <Grid container id="SponsorsDisplay" className="SponsorsDisplay">
              <Grid item direction="column" className ="SponsorIconBox">
                  <a href="https://www2.uottawa.ca/en" target={'_blank'}><img className="SponsorIcon" alt="SponsorIcon" src={uOttawa}></img></a>    
              </Grid>
              <Grid item direction="column" className ="SponsorIconBox">
                  <a href="https://www.facebook.com/uottawaeeffdg/" target={'_blank'}><img className="SponsorIcon" alt="SponsorIcon" src={EEF}></img></a>
              </Grid>
              <Grid item direction="column" className ="SponsorIconBox">
                  <a href="https://uocsclub.ca/" target={'_blank'}><img className="SponsorIcon" alt="SponsorIcon" src={uocs}></img></a>
              </Grid>
              <Grid item direction="column" className ="SponsorIconBox">
                  <a href="https://www.facebook.com/uottawagdc/" target={'_blank'}><img className="SponsorIcon" alt="SponsorIcon" src={uogdc}></img></a>
              </Grid>
              <Grid item direction="column" className ="SponsorIconBox">
                  <a href="https://www.ottawashirtprinting.com/"><img className="SponsorIcon" alt="SponsorIcon" src={OSP}></img></a>
              </Grid>

          </Grid> 
      </div>
    );
  }

export default SponsorShowcase;
