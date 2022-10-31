import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Card } from "@mui/material"
import { useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import React from "react";
import './Schedule.css';
import { styled } from "@mui/material";

function Schedule() {

  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"))
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"))
  
  return (
    <div id="Schedule" className="Schedule">
      <h2 className="scheduleTitle">Schedule</h2>
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
              <Card variant='outlined' elevation={4} sx={{
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
              }}>
                <div className ="eventMonth">November</div>
                <div className ="eventDay">16</div>
              </Card>
              </div>
              <Stack >
                <div className ="eventTitle">Resume Roast</div>
                <p align='left'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                 Duis nisi nisi, sagittis id massa a, malesuada interdum mi. Suspendisse
                  in cursus quam. Aliquam condimentum luctus nisl, a scelerisque tellus vulputate nec. 
                  Phasellus sit amet iaculis nibh. Nulla sit amet lacus vestibulum, elementum dolor vitae, 
                  mollis mi. Nam vitae ultrices nibh, id varius dolor. </p>
              </Stack>
            </Stack>

            <Stack direction = {{xs: "column", md: "row"}} spacing={matchesMD ? 5 : 10} sx={{
              width:'100%',

            }}>
              <div class='Center'>
              <Card variant='outlined' sx={{
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
              }}>
                <div className ="eventMonth">November</div>
                <div className ="eventDay">29</div>
              </Card>
              </div>
              <div>
                <div className ="eventTitle">Coffee Code & Cram</div>
                <p align='left'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                 Duis nisi nisi, sagittis id massa a, malesuada interdum mi. Suspendisse
                  in cursus quam. Aliquam condimentum luctus nisl, a scelerisque tellus vulputate nec. 
                  Phasellus sit amet iaculis nibh. Nulla sit amet lacus vestibulum, elementum dolor vitae, 
                  mollis mi. Nam vitae ultrices nibh, id varius dolor. </p>              
                </div>
            </Stack>

            <Stack direction = {{xs: "column", md: "row"}} spacing={matchesMD ? 5 : 10} sx={{
              width:'100%',

            }}>
              <div class='Center'>
              <Card variant='outlined' sx={{
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
              }}>
                  
                  <div className ="eventMonth">January</div>
                  <div className ="eventDay">11</div>
                </Card>
              </div>
              <div>
                <div className ="eventTitle">Wicked Web Dev</div>
                <p align='left'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                 Duis nisi nisi, sagittis id massa a, malesuada interdum mi. Suspendisse
                  in cursus quam. Aliquam condimentum luctus nisl, a scelerisque tellus vulputate nec. 
                  Phasellus sit amet iaculis nibh. Nulla sit amet lacus vestibulum, elementum dolor vitae, 
                  mollis mi. Nam vitae ultrices nibh, id varius dolor. </p>              
                </div>
            </Stack>
          </Stack>
        </Box>
    </div>
  );
}

export default Schedule;