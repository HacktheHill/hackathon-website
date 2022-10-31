import './Collaborators.css';
import { Grid } from "@mui/material";
import SESA from '../../assets/logos/sesa.svg'
import CSSA from '../../assets/logos/cssa.svg'
import IEEE from '../../assets/logos/ieee.svg'
import ESS from '../../assets/logos/ess.svg'
import WIE from '../../assets/logos/wie.svg'

function Collaborators() {
  return (
    <div className="Collaborators">
       <h2>Collaborators </h2>
        <Grid container id="Associations" className="Associations">
          <Grid item direction="column" className ="CSSABox">
          <a href="https://www.cssa-aei.ca/"><img className="CSSA" alt="CSSA" src={CSSA}></img></a>
          </Grid>
          <Grid item direction="column" className ="IEEEBox">
          <a href="https://ieeeuottawa.ca/"><img className="IEEE" alt="IEEE" src={IEEE}></img></a>
          </Grid>
          <Grid item direction="column" className ="SESABox">
          <a href="https://swesa.netlify.app/"><img className="SESA" alt="SESA" src={SESA}></img></a>
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