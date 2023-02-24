import React from 'react'
import { MarkerF, InfoBox } from '@react-google-maps/api';

//List of stop names
const stops= require('../../../components/data/stops.json')

//style for stop map component
const divStyle = {
  maxWidth: "100px",
  background: `transparent`,
  color:'black',
  "font-size": "7px",
  "-webkit-text-stroke": "0.5px white" 
}

//Adding the stops logo to the map based on stop location
//Names of the stops are also displayed to the right of the stop logo
export default function Stops() {
    
  return (
    stops.map(marker => {
        const location = {
            lat: marker.Lat,
            lng: marker.Lng
          };
          console.log(marker.Lat+","+marker.Lng)
        return <MarkerF key={marker.StopId} position={location} icon={{url: '../../stop.png'}}> 
          <InfoBox position={location} options= {{closeBoxURL:"",  pixelOffset: new window.google.maps.Size(20, -40)}}>
              <div style={divStyle}>
                <h1 style={{"font-size": "2em"}}>{marker.Name}</h1>
              </div>
              </InfoBox>
        </MarkerF>
    })
  )
}