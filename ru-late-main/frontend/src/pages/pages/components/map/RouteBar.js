import React from 'react'

//Handles when the user clicks on a certain route. Displays that route.
export default function RouteBar({ route, toggleRoute }) {
  function handleClick(){
    toggleRoute(route.id)
  }
  const color= "#"+route.routeColor
  return (
        <div>
          <input type="checkbox" checked={route.display} onChange={handleClick}/>
          <button style={{padding: "1vh", margin: "0.2vh",marginRight:0,"font-size": "20px", width: "18vw", backgroundColor: color, color: "#585858",}} onClick={handleClick}>{route.name}</button>        
        </div>
  )
}
