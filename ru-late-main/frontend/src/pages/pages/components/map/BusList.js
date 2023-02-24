import React, { useState, useEffect } from 'react'
import { MarkerF, InfoBox } from '@react-google-maps/api';
import axios from "axios";

//List of route names
const routeNames= require('../../../components/data/routeStops.json')

//Function to get the bus list and dsiplay it on map.
export default function BusList({routes}) {
  var routeList=[]
  routes.map( route => {
    if(route.display){
      console.log("ACTIVE ROUTES ID: "+route.id)
      routeList.push(route.id);
    }
  })
  const [vehicles, setVehicles] = useState([{}]);
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    axios.get("https://feeds.transloc.com/3/vehicle_statuses?agencies=1323&include_arrivals=true").then((response) => { //Gets active buses from transloc
        const {data} = response;
        setVehicles(data.vehicles);
    }).catch(err => console.error(err))
  },[time]);
  var location={}
  return (
    vehicles.map(vehicle => {
      if(routeList.includes(vehicle.route_id)){
        const color="#"+routeNames[vehicle.route_id].color //Gets the color of the route based on the route id
        const divStyle = {
          background: color,
          color:'black',
          "font-size": "10px",
          "border-radius": "50%",
          "border-color":"#585858",
          height: "50px",
          width: "50px",
          overflow: "hidden",
          display: "flex",
          "align-items": "center", 
          "justify-content": "center",
          "border-style": "solid"
        }
        const divStyle2 = {
          background: "white",
          color:'black',
          "font-size": "15px",
          "border-color":"#585858",
          overflow: "hidden",
          display: "flex",
          "align-items": "center", 
          "justify-content": "center",
          "border-style": "solid"
        }
      try{
        location = {
            lat: vehicle.position[0],
            lng: vehicle.position[1]
          };
      }
      catch{
        console.log("ERROR LOCATION NOT FOUND")
        location=null
      }
      const rotate="rotate("+vehicle.heading+"deg)"
      //Markers are added to the map
      //Bus locations and logo and added as well
        return <MarkerF key={vehicle.id} position={location} label={vehicle.route_id}  icon={{url: '../../bus.png'}}>
          <InfoBox position={location} zIndex= {-1} options= {{closeBoxURL:"",  pixelOffset: new window.google.maps.Size(-25, -70), disableAutoPan : true}}>
            <div>
            <div style={divStyle2}>
            {(vehicle.load * 100).toFixed(0) + '%'}
            </div>
            <div style={divStyle}>
            <img src="../../arrow.png" style={{width: "60%", height: "60%", transform: rotate}}/>
            </div>
            </div>
          </InfoBox>
        </MarkerF>
 } })
  )
}