import React from 'react'
import Route from "./BusRoute";

//returns the route id with color to display on map
export default function Routes({routes}) {
    
  return (
    routes.map(route => {
        console.log("ROUTELIST: "+route.id+", Color: "+route.routeColor);
        if(route.display){
        return <Route routeId={route.id} routeColor={'#'+route.routeColor}/>
        }
    })
  )
}
