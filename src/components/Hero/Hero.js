import './Hero.css';
import { Box, Button, useMediaQuery, useTheme, darken } from '@mui/material';
import HeroImg from '../../assets/svgs/parliament-hero-asset.svg';
import BannerLogo from '../../assets/Logos/hthlogo_banner_ver.svg';
import { Link } from 'react-scroll';

function Hero() {

  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"))
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"))
  const matchesLG = useMediaQuery(theme.breakpoints.down("lg"))

  return (
    <div className="Hero">
      <Box sx={{
        width: '100%',
        marginTop: matchesSM ? '2%' : '3%',
        transition: '1s'
      }}>
        <Box sx={{
          marginLeft: '5%',
          width: matchesSM ? '85%' : '50%',
          position: matchesSM ? 'relative' : 'absolute',
          transition: '1s'
        }}>
            <Box>
              <h3>University of Ottawa</h3>
              <img class='BannerLogo'src={BannerLogo}></img>
              <h3>Canada's Capital Hackathon</h3>
            </Box>
            <Box sx={{
              display:"flex"
            }}>
              <Button target='_blank' href='https://hackthehill.com/register' sx={{
                  background:'linear-gradient(90deg, #ABEFFB, transparent) #E9D9F2',
                  borderRadius:'100px',
                  color:'#3B4779',
                  mt: matchesSM ? '7vw' : '2vw',
                  p:'10px',
                  textTransform:'none',
                  minWidth:'20%',
                  width: matchesMD ? '40%' : '0%',
                transition: '1s',
                  boxShadow: 'rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px',
                  '&:hover': {
                    backgroundColor: '#f094bc',
                  }
                  }}
                >
                  <p class='ButtonText'>Register Now!</p>
                </Button>
            </Box>
        </Box>
        <Box sx={{
          mt: matchesSM ? '10%' : '0%',
          transition: '1s',
        }}>
          <img class="HeroImg" src={HeroImg}></img>
        </Box>
      </Box>
    </div>
  );
}

export default Hero;