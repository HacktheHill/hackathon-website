import React from 'react'
import {faInstagram, faLinkedin, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons";
import {faWindowMaximize} from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import "./Headshot.css"

const Headshot = (props) => {
    const path = `./headshots/${props.team}/${props.name}.webp`;
    const alt = `image of ${props.name}`
    var role = props.role
    
    if (!props.role) {
        role = ""
    }

  var insta 
  if(props.insta) {
  insta = 					<a
  href={`https://www.instagram.com/${props.insta}`}
  target="_blank"
  rel="noreferrer"
  aria-label="Instagram"
  >
    <Icon className="invert" icon={faInstagram} />
  </a>
  }
  else {
    <div></div>
  }

  var linkedin 
  if(props.linkedin) {
    linkedin = 					<a
  href={`https://www.linkedin.com/in/${props.linkedin}`}
  target="_blank"
  rel="noreferrer"
  aria-label="Linkedin"
  >
    <Icon className="invert" icon={faLinkedin} />
  </a>
  }
  else {
    <div></div>
  }
  
  var website 
  if(props.website) {
    website = 					<a
  href={props.website}
  target="_blank"
  rel="noreferrer"
  aria-label="Website"
  >
    <Icon className='invert' icon={faWindowMaximize} />
  </a>
  }
  else {
    <div></div>
  }

  return (
    <div className='card'>
      <div className='card-content'>
        <div className='wrapper'>
                <img className='headshot' src={path} alt={alt}/>
        </div>
        
        <div className='back'>
          <p className='personName'>{props.name}</p>
          <p className='teamName'>{props.team}</p>
          <p className='teamName'>{props.role}</p>                                                 {/* teamName?! */}
           <div className="socials">
              {insta}
              {linkedin}
			    		{website}
		  		  </div>

        </div>
      </div>
    </div>
  )
}

export default Headshot