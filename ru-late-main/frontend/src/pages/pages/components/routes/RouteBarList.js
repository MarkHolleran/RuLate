import React from 'react'
import Route from "../map/BusRoute";
import { MarkerF, InfoBox } from '@react-google-maps/api';

//Deals with zoom and setting the position of the route to the correct area on the map
export default function RouteBarList( { selection, favorites, toggleFav, compliment, setZoom, setPoint, setMapElem} ) {
  const routes= require('../../../components/data/routeStops.json')
  const stopNames = require('../../../components/data/stopName.json')
  var temp="white"
  if(!selection===false)
  {
    temp="#"+routes[selection].color //adds color based on user seletion
  }
  const style = {
    color:temp,
    "font-size": "35px",
    display: "flex",
    "justify-content":"center",
    "text-align":"center",
    "align-items":"center",
    margin: "10px"
  };

  const style2 = {
    width: "1.5vw",
    heigth: "1.5vh",
    transform: "scale(1.5)"
  };
  if(!selection===false)
  {
    const color="#"+routes[selection].color
    const style1 = {
      backgroundColor: color,
      color: compliment(selection),
      "-webkit-text-stroke": "0.5px white",
      "font-size": "25px",
      width: "21vw",
    };
    const btnStyle={
      padding: "0", 
      "font-size": "30px", 
      width: "2vw", 
      color: color,
      "background-color": "transparent", 
      "background-repeat": "no-repeat", 
      border: "none", 
      cursor: "pointer", 
      overflow: "hidden", 
      outline: "none"
       
    }
    const divStyle = {
      padding: "5px",
      "white-space": "nowrap",
      background: `white`,
      color:'black',
      "font-size": "10px", 
    }
    
    function checked(stop){
      if(favorites!==undefined){
        console.log(favorites)
        return favorites.includes(stop.toString())
      }
      return false
    }

    return (
      <div>
        <label style={style}>
          {routes[selection].name}
      </label>
        {routes[selection].stops.map(stop=>{
        //For every stop in this route
        function handleClick(){
          toggleFav(selection,stop)
        }
        function updateMap(){
          if(stopNames[stop]!==undefined){
            var namechange=stop
            namechange=stopNames[stop].Name
          }
          const point={
            lat: stopNames[stop].Lat,
            lng: stopNames[stop].Lng
          }
          setPoint(point)
          setZoom(19)
          setMapElem(
            <>
              <Route routeId={selection} routeColor={color}/>
              <MarkerF key={stop} position={point} icon={{url: '../../stop.png'}} >
      <InfoBox position={point} options= {{closeBoxURL:"",  pixelOffset: new window.google.maps.Size(20, -40)}}>
      <div style={divStyle}>
      <h1 style={{"font-size": "2em"}}>{namechange}</h1>
      </div>
      </InfoBox>
    </MarkerF>
            </>
          )
        }
        function addBtn(stop){
          if(checked(stop)){
            return( 
              <button style={btnStyle} onClick={handleClick}>-</button>
            )
          }
          else{
            return( 
              <button style={btnStyle} onClick={handleClick}>+</button>
            )
          }
        }
        const name=stopNames[stop]
        console.log(name)
        if(name!==undefined){
          return(
            <div style={{ display: "flex", "justify-content":"center", "align-items":"center" }}>
            <button style={style1} onClick={updateMap}>{stopNames[stop].Name}</button>
            {addBtn(stop)}
            </div>
          )
        }
        return(
          <div style={{ display: "flex", "justify-content":"center", "align-items":"center" }}>
          <button style={style1} onClick={updateMap}>{stop}</button>
          {addBtn(stop)}
          </div>
        )
        })}
    </div>
        )
  }
    return (
  <div>
</div>
    )
}
