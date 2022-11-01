import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Card } from "@mui/material"
import { useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import React from "react";
import './Schedule.css';
import SnowFlake from '../../assets/svgs/snowflake_1.svg'

function Schedule() {

  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"))
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"))

  const styles = {
    card: {
      minWidth: '150px',
        maxWidth:'150px',
        backgroundColor:'#3b477a',
        border:'3px solid white',
        borderRadius:'10px',
        maxHeight:'140px',
        mt: matchesMD ? '10px' : '0px',
        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px',
        transition: 'transform 330ms ease-in-out',
        '&:hover': {
          transform:'scale(1.05)',
          transition: 'transform 330ms ease-in-out'
        }
      }
    }
  
  return (
    <div id="Schedule" className="Schedule">
      <h1 className="scheduleTitle">Schedule</h1>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <Box sx={{ 
          width: matchesMD ? '70%' : "60%", 
          margin:'auto',
          mt: matchesSM ? '15%' : 'auto'
        }}>
          <Stack spacing={10} id="eventStack" class="eventStack">

            <Stack direction = {{xs: "column", md: "row"}} spacing={matchesMD ? 5 : 10} sx={{
              width:'100%',

            }}>
              <div class='Center'>
                <Card variant='outlined' elevation={4} style={styles.card} sx={{
                  '&:hover': {
                    transform:'scale(1.05)',
                    transition: 'transform 330ms ease-in-out'
                  }
                }}>
                  <Stack direction={'column'}>
                    <div className ="eventMonth">November</div>
                    <div className ="eventDay">16</div>
                  </Stack>
                </Card>
              </div>
              <Stack >
                <div className ="eventTitle">Resume Roast</div>
                <div className ="subTitle">7 p.m - 9 p.m @ STM 117</div>
                <p className="eventDesc" align='left'>Need resume advice on the spot? Hang out with some developers 
                from Ciena and Microsoft as they review and evaluate resumes submitted by students, 
                all while filling yourself up with some pizza fresh from fresh pizza. </p>
              </Stack>
            </Stack>

            <Stack direction = {{xs: "column", md: "row"}} spacing={matchesMD ? 5 : 10} sx={{
              width:'100%',

            }}>
              <div class='Center'>
              <Card variant='outlined' elevation={4} style={styles.card} sx={{
                  '&:hover': {
                    transform:'scale(1.05)',
                    transition: 'transform 330ms ease-in-out'
                  }
                }}>
                <Stack direction={'column'}>
                  <div className ="eventMonth">November</div>
                  <div className ="eventDay">29</div>
                </Stack>
              </Card>
              </div>
              <div>
                <div className ="eventTitle">Coffee Code & Cram</div>
                <div className ="subTitle">7 p.m - 9 p.m @ STM 117</div>
                <p className="eventDesc" align='left'>Unwind and take a break from school.
                 Come along for an evening of socializing and coding with 
                 coffee, tea, and snacks. </p>              
                </div>
            </Stack>

            <Stack direction = {{xs: "column", md: "row"}} spacing={matchesMD ? 5 : 10} sx={{
              width:'100%',

            }}>
              <div class='Center'>
              <Card variant='outlined' elevation={4} style={styles.card} sx={{
                  '&:hover': {
                    transform:'scale(1.05)',
                    transition: 'transform 330ms ease-in-out'
                  }
                }}>
                <Stack direction={'column'}>
                  <div className ="eventMonth">January</div>
                  <div className ="eventDay">11</div>
                </Stack>
                </Card>
              </div>
              <div>
                <div className ="eventTitle">Wicked Web Dev</div>
                <div className ="subTitle">6:30 p.m - 9:30 p.m @ STM 117</div>
                <p className="eventDesc" align='left'>Explore the wonders of front-end development! 
                Learn the basics through workshops and participate in a one-hour challenge to build a 
                website according to provided guidelines to win some sweet prizes.</p>              
                </div>
            </Stack>
          </Stack>
        </Box>
    </div>
  );
}

export default Schedule;