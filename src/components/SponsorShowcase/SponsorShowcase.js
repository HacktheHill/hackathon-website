import React from "react";
import "./SponsorShowcase.css";
import { Button, useMediaQuery, useTheme, darken } from '@mui/material';


function SponsorShowcase() {
  
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"))
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"))

    return (
      <div className="Sponsors">
        <h1>Sponsors</h1>
            <div class="borderW">
              <div class="sponsors-body">
              Hack the Hill is made possible by our generous sponsors. 
              Interested in supporting one of Ottawa's largest hackathons?
              </div>
              <Button href={`mailto:sponsorship@hackthehill.com`} sx={{
              backgroundColor:'#5C71AD', 
              borderRadius:'100px', 
              color:'white', 
              mt: matchesSM ? '7vw' : '2vw',
              p:'10px',
              textTransform:'none',
              minWidth:'20%',
              width: matchesMD ? '50%' : '0%',
              transition: '1s',
              ml: '20px',
              '&:hover': {
                backgroundColor: darken('#5C71AD', 0.3)}
              }}>
                <p class='ButtonText'>Get in touch</p>
            </Button>
            </div>
            
      </div>
    );
  }

export default SponsorShowcase;