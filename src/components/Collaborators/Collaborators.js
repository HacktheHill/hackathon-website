import './Collaborators.css';
import { Grid } from "@mui/material";
import SESA from '../../assets/Logos/sesa.svg'
import CSSA from '../../assets/Logos/cssa.svg'
import IEEE from '../../assets/Logos/ieee.svg'
import ESS from '../../assets/Logos/ess.svg'
import WIE from '../../assets/Logos/wie.svg'

function Collaborators() {
  return (
    <div className="Collaborators">
       <h1>Collaborators </h1>
        <Grid container id="Associations" className="Associations">
          <Grid item direction="column" className ="CSSABox">
          <a href="https://www.cssa-aei.ca/"><img className="CSSA" alt="CSSA" src={CSSA}></img></a>
          </Grid>
          <Grid item direction="column" className ="IEEEBox">
          <a href="https://ieeeuottawa.ca/"><img className="IEEE" alt="IEEE" src={IEEE}></img></a>
          </Grid>
          <Grid item direction="column" className ="SESABox">
          <a href="https://www.uottawasesa.ca/"><img className="SESA" alt="SESA" src={SESA}></img></a>
          </Grid>
          <Grid item direction="column" className ="ESSBox">
          <a href="https://www.essaeg.ca/"><img className="ESS" alt="ESS" src={ESS}></img></a>
          </Grid>
          <Grid item direction="column" className ="WIEBox">
          <a href="https://wie.ieeeottawa.ca/"><img className="WIE" alt="WIE" src={WIE}></img></a>
          </Grid>
          </Grid>
    </div>

  );
}

export default Collaborators;