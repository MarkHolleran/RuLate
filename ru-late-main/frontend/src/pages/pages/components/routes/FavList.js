import React from 'react'
import Route from "../map/BusRoute";
import { MarkerF, InfoBox } from '@react-google-maps/api';

//style map component
const divStyle = {
  padding: "5px",
  "white-space": "nowrap",
  background: `white`,
  color:'black',
  "font-size": "10px", 
}

export default function RouteBarList( { favorites,toggleFav, setZoom, setPoint, setMapElem} ) {
  const stopNames = require('../../../components/data/stopName.json')
  const routes= require('../../../components/data/routeStops.json')
  var elems=[]

  //Goes through every route in favorites
  for (let route in favorites){
    const favs=favorites[route]
    const color="#"+routes[route].color
    favs.map(fav=>{
      function handleClick(){
        toggleFav(route,fav)
      }
      var name=fav
      if (stopNames[fav]!==undefined){
        name=stopNames[fav].Name
      }
      function updateMap(){
        const point={
          lat: stopNames[fav].Lat,
          lng: stopNames[fav].Lng
        }
        setPoint(point)
        setZoom(19) //the map will update based on the route selected when adding to favroties
        setMapElem(
          <>
            <Route routeId={route} routeColor={color}/> 
            <MarkerF key={fav} position={point} icon={{url: '../../stop.png'}} >
              <InfoBox position={point} options= {{closeBoxURL:"",  pixelOffset: new window.google.maps.Size(20, -40)}}>
              <div style={divStyle}>
                <h1 style={{"font-size": "2em"}}>{name}</h1>
              </div>
              </InfoBox>
            </MarkerF>
          </>
        )
      }  
      elems.push(
        <div style={{ display: "flex", "justify-content":"center", "align-items":"center" }}>
          
          <button style={{padding: "1vh", margin: "0.2vh",marginRight:0,"font-size": "20px", width: "22vw", backgroundColor: color, color: "white",}} onClick={updateMap}>{routes[route].name+": "}{name}</button>
          <button style={{padding: "0", "font-size": "30px", width: "2vw", color: "white", "background-color": "transparent", "background-repeat": "no-repeat", border: "none", cursor: "pointer", overflow: "hidden", outline: "none"}} onClick={handleClick}>-</button>
        </div>
        )
      })
}
    return (
<>{elems}</>
        )
}
