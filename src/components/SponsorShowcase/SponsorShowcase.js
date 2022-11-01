import React, { Component } from "react";
import "./SponsorShowcase.css";
import { Box, Button, useMediaQuery, useTheme, darken, Stack } from '@mui/material';
import LaptopAsset from "../../assets/svgs/laptop_asset.svg";


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
              Interested in supporting one of Ottawa’s largest hackathons?
              </div>
            </div>
            <Button href={`mailto:sponsorship@hackthehill.com`} sx={{
              backgroundColor:'#5C71AD', 
              borderRadius:'100px', 
              color:'white', 
              mt: matchesSM ? '7vw' : '2vw',
              p:'10px',
              textTransform:'none',
              minWidth:'15%',
              width: matchesMD ? '40%' : '0%',
              transition: '1s',
              ml: '25%',
              '&:hover': {
                backgroundColor: darken('#5C71AD', 0.3)}
              }}>
                <p class='ButtonText'>Get in touch</p>
            </Button>
      </div>
    );
  }

export default SponsorShowcase;