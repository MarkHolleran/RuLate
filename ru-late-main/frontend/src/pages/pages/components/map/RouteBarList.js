import React from 'react'
import RouteBar from './RouteBar'

//Gives the routes to be displayed on side bar
export default function RouteBarList( { routes, toggleRoute } ) {
  return (
    routes.map(route => {
      if(route.active&&route.enabled){
        return <RouteBar key={route.id} toggleRoute= {toggleRoute} route= {route}/>
      }
    })
  )
}
