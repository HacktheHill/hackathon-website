import './Hero.css';
import { Box, Button, Stack } from '@mui/material';
import 'boxicons';
import HeroImg from '../../assets/svgs/parliament-hero-asset.svg';
import BannerLogo from '../../assets/Logos/hthlogo_banner_ver.svg';

function Hero() {
  return (
    <div className="Hero">
      <Box sx={{
        width: '100%',
        marginTop: '15%',
      }}>
        <Box sx={{
          marginLeft: '5%',
          width: '50%',
          position: 'absolute'
        }}>
            <Box>
              <h3>February 3 - 5 @ The University of Ottawa</h3>
              <img class='BannerLogo'src={BannerLogo}></img>
              <h3>Canada's Capital Hackathon</h3>
            </Box>
            <Button sx={{backgroundColor:'#3B4779', borderRadius:'100px', color:'white', mt:'50px', p:'10px', width:'25%', textTransform:"none"}}>Learn More<box-icon name='right-arrow-alt' color='white'></box-icon></Button>
        </Box>
        <img class="HeroImg" src={HeroImg}></img>
      </Box>
    </div>
  );
}

export default Hero;