import React from 'react'
import "./Headshot.css"

const Headshot = (props) => {
    const path = `./headshots/${props.team}/${props.name}.webp`;
    const alt = `image of ${props.name}`
    var role = props.role
    
    if (!props.role) {
        role = ""
    }
  return (
    <div className='card'>
        <div className='wrapper'>
                <img className='headshot' src={path} alt={alt}/>
        </div>
        <p className='personName'>{props.name}</p>
        <p className='teamName'>{props.team}</p>
        <p className='teamName'>{props.role}</p>
    </div>
  )
}

export default Headshot