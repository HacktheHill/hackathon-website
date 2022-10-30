import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import React from "react";
import './Schedule.css';

const Item = styled('div')(({ theme }) => ({

}));

function Schedule() {
  return (
    <div id="Schedule" className="Schedule">
      <h2 className="scheduleTitle">Schedule</h2>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <Box sx={{ width: "30%", margin: "auto" }}>
          <Stack spacing={4} id="eventStack" class="eventStack">

            <Stack direction = "row" spacing={2}>
              <div className ="event">
                <div className ="eventMonth">November</div>
                <div className ="eventDay">16</div>
              </div>
              <hr></hr><hr></hr><hr></hr><hr></hr>
              <div>
                <br></br>
                <div className ="eventTitle">Wicked Web Dev</div>
              </div>
            </Stack>

            <Stack direction = "row" spacing={2}>
              <div className ="event">
                <div className ="eventMonth">November</div>
                <div className ="eventDay">29</div>
              </div>
              <hr></hr><hr></hr><hr></hr><hr></hr>
              <div>
                <br></br>
                <div className ="eventTitle">Resume Roast</div>
              </div>
            </Stack>

            <Stack direction = "row" spacing={2}>
              <div className ="event">
                <div className ="eventMonth">January</div>
                <div className ="eventDay">11</div>
              </div>
              <hr></hr><hr></hr><hr></hr><hr></hr>
              <div>
                <br></br>
                <div className ="eventTitle">Coffee, Code and Cram</div>
              </div>
            </Stack>

          </Stack>
        </Box>
    </div>
  );
}

export default Schedule;