import React from "react";
import "./SponsorShowcase.css";
import { Button, useMediaQuery, useTheme, darken } from '@mui/material';
import Mascot from '../../assets/Logos/mascot_nametag_waving.svg';

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
                Interested in supporting one of Ottawa's largest hackathons?
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

      </div>
    );
  }

export default SponsorShowcase;