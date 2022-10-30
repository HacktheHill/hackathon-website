import { Grid } from "@mui/material";
import React from "react";
import './Schedule.css';

function Schedule() {
  return (
    <div id="Schedule" className="Schedule">
      {/* <div id="scheduleTitle" className="scheduleTitle">Schedule</div> */}
      <h2 className="scheduleTitle">Schedule</h2>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

      <Grid container id="Events" className="Events">

        <Grid container id="Event1" className="Event1">
          <Grid item className ="eventItem">
              <div className ="eventMonth">November</div>
              <div className ="eventDay">16</div>
          </Grid>

          <Grid item className ="eventTitle">
            <div className ="eventTitle">Wicked Web Dev</div>
          </Grid>
        </Grid>

        <Grid container id="Event2" className="Event2">
          <Grid item className ="eventItem">
              <div className ="eventMonth">November</div>
              <div className ="eventDay">29</div>
          </Grid>

          <Grid item className ="eventTitle">
            <div className ="eventTitle">Resume Roast</div>
          </Grid>
        </Grid>

        <Grid container id="Event3" className="Event3">
          <Grid item className ="eventItem">
              <div className ="eventMonth">January</div>
              <div className ="eventDay">11</div>
          </Grid>

          <Grid item className ="eventTitle">
            <div className ="eventTitle">Coffee, Code and Cram</div>
          </Grid>
        </Grid>

      </Grid>

    </div>
  );
}

export default Schedule;