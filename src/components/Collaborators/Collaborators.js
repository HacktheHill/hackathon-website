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
          <img className="CSSA" alt="CSSA" src={CSSA}></img>
          </Grid>
          <Grid item direction="column" className ="IEEBox">
          <img className="IEEE" alt="IEEE" src={IEEE}></img>
          </Grid>
          <Grid item direction="column" className ="SESABox">
            <img className="SESA" alt="SESA" src={SESA}></img>
          </Grid>
          <Grid item direction="column" className ="ESSBox">
          <img className="ESS" alt="ESS" src={ESS}></img>
          </Grid>
          <Grid item direction="column" className ="WIEBox">
          <img className="WIE" alt="WIE" src={WIE}></img>
          </Grid>
          </Grid>
    </div>

  );
}

export default Collaborators;