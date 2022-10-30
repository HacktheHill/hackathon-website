import './Hero.css';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import 'boxicons';
import HeroImg from '../../assets/svgs/parliament-hero-asset.svg';
import BannerLogo from '../../assets/Logos/hthlogo_banner_ver.svg';

function Hero() {

  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <div className="Hero">
      <Box sx={{
        width: '100%',
        marginTop: '13%',
        transition: '1s'
      }}>
        <Box sx={{
          marginLeft: '5%',
          width: matchesSM ? '80%' : '50%',
          position: matchesSM ? 'relative' : 'absolute',
          transition: '1s'
        }}>
            <Box>
              <h3>February 3 - 5 @ The University of Ottawa</h3>
              <img class='BannerLogo'src={BannerLogo}></img>
              <h3>Canada's Capital Hackathon</h3>
            </Box>
            <Box>
              <Button sx={{
                backgroundColor:'#3B4779', 
                borderRadius:'100px', 
                color:'white', 
                mt:'2vw', 
                textTransform:'none',
                width:'25%',
                fontSize:'1.10vw'
              }}>
                  Learn More →
              </Button>
            </Box>
        </Box>
        <Box sx={{
          mt: matchesSM ? '10%' : '0%',
          transition: '1s'
        }}>
          <img class="HeroImg" src={HeroImg}></img>
        </Box>
      </Box>
    </div>
  );
}

export default Hero;