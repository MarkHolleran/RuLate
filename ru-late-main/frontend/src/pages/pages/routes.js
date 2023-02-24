import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DirectionsBusFilledIcon from "@mui/icons-material/DirectionsBusFilled";
import complementaryColors from 'complementary-colors';
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import NavigateAfter from "@mui/icons-material/NavigateNext";
import axios from "axios";
import { useState, useEffect } from "react";
import RouteBarList from "./components/routes/RouteBarList";
import Route from "./components/map/BusRoute";
import FavList from "./components/routes/FavList";
import Map from "./components/map/map"
import api from "../../utils/api";
import store from "../../store/store"

//Lists of routeNames and stops are required
const stops= require('../components/data/routeStops.json')
const routeNames = require('../components/data/routeStops.json')

//These 3 styles are used for splitting up the page into sections
const leftStyle = {
  margin: "0",
  width: "25vw",
  height: "92vh",
  overflow: "auto"
};

const middleStyle = {
  margin: "0",
  width: "25vw",
  height: "92vh"
};

const rightStyle = {
  margin: "0",
  width: "50vw",
  height: "92vh",
};

//Map reset location
const reset = {
  lat: 40.52299,
  lng: -74.43944
};

//extracts the .routeColor attribute from a route and returns a style
function colorPerRoute(route) {
  return {
    color: "white",
    "background-color": "#" + route.routeColor,
    "text-align": "center",
  };
}

//Compliment route colors based on route selection
function compliment(selection){
  if (selection!==false){
    var color= "#"+routeNames[selection].color
    if (color==="#000000"){
      color="#FFFFFF"
    }
    else if (color==="#FFFFFF"){
      color="#000000"
    }
    var myColor = new complementaryColors(color);
    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
  const res=rgbToHex(myColor.complementary()[1].r,myColor.complementary()[1].g,myColor.complementary()[1].b)
  return res
  }
  const res="black"
  return res
}

//creates one dropdown menu button and within it a checkbox is made
function dropDown(
  dropdownvalue,
  route,
  open,
  setOpen,
  setSelection,
  setMapElem,
  setPoint,
  setZoom
) {

  //When a user clicks on a route the route is then displayed through points
  const handleClick = (dropdownvalue) => () => {
 
      const temp=open[dropdownvalue]
      Object.keys(open).forEach(v => open[v] = false)
    setOpen((open) => ({
      ...open,
      [dropdownvalue]: !temp,
    }));
    if(!temp){
      //Creating points based on user selection
      const point= {
        lat: stops[dropdownvalue].Lat,
        lng: stops[dropdownvalue].Lng
      };

      setSelection(dropdownvalue)
      setPoint(point)
      setZoom(14)
      setMapElem(<Route routeId={dropdownvalue} routeColor={'#'+stops[dropdownvalue].color}/>)     
    }
    else{
      setSelection(false)
      setZoom(14)
      setMapElem(<></>)
    }
  };

  //Handles bus icon direction and user selection
  return (
    <List>
      <ListItemButton
        style={colorPerRoute(route)}
        key={dropdownvalue}
        onClick={handleClick(dropdownvalue)}
      >
        <ListItemIcon>
          <DirectionsBusFilledIcon />
        </ListItemIcon>
        <ListItemText primary={route.name} textAlign="center" />
        {open[dropdownvalue] ? <NavigateAfter /> : <NavigateBefore />}
      </ListItemButton>
    </List>
  );
}



function Routes() {

  //React hooks
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [routes, setRoutes] = useState([]);

  // API call to get active routes
  
  // Make API call once no page load
  useEffect(() => {
    axios.get("https://feeds.transloc.com/3/routes?agencies=1323").then((data) => {
      console.log(data);
      let routesList = [];
      data.data.routes.map((route) => routesList.push({
        id: route.id,
        name: route.long_name,
        routeColor: route.color,
        textColor: route.text_color,
        active: route.is_active,
        display: false,
        mark: false,
      }));
      setRoutes(routesList);
      setLoading(false);
    }).catch((err) => {
      console.log(err.response);
      setConnectionError(true);
      setLoading(false);
    });
    const token= store.getState().token.token;
  const input = {
    url: `${api.url}/favorites/getDict`,
    options: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer "+token 
      },
    },
  };

  // Make API call
  api.call(
    input,
    (status, data) => {
      if (status===200){
        console.log(JSON.stringify(data));
        console.log("Successful get favs.");
        setFavorites(data)
      }
      else{
        console.log("Error")
      }
      }
  );
  }, []);

  const [checked, setChecked] = React.useState([]);
  const [open, setOpen] = React.useState([]);
  const [selection, setSelection] = React.useState(false);
  const [mapElem, setMapElem] = React.useState(<></>);
  const [point, setPoint] = React.useState(reset);
  const [favorites, setFavorites]= React.useState({});
  const [zoom, setZoom] = React.useState(14);
  var value = 0;
  var dropdownvalue = 0;
  var list = [];

  const listStyle = {
    color: "black",
    "background-color": "white",
    "text-align": "center",
    overflow: "auto",
  };

  //Returns a list of the users favorite, takes userId
  function apiCall(input){
    // Make API call
    api.call(
      input,
      (status, data) => {
        const token= store.getState().token.token;
        if (status===200||status===201){
          const input2 = {
            url: `${api.url}/favorites/getDict`,
            options: {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: "Bearer "+token 
              },
            },
          };
        
          // Make API call
          api.call(
            input2,
            (status, data) => {
              if (status===200){
                console.log(JSON.stringify(data));
                console.log("Successful get favs.");
                setFavorites(data)
              }
              else{
                console.log("Error")
              }
              }
          );
        }
        else{
          console.log("Error")
        }
        }
    );
  }

  
  //Checks the route for each element and pushes whats wanted
  checked.forEach((element) => {
    list.push({
      routename: routes[element - 1].name,
      routeid: routes[element - 1].id,
      routeColor: routes[element - 1].routeColor,
      checked: element,
    });
  });

  // Handles adding and removing a user favorite
  function toggleFav(r, stop) {
    const getR=favorites[r.toString()]
    var fav=[]
    if(getR!==undefined){  
      console.log(getR)
      fav = getR
    }
    const token= store.getState().token.token; //User's token to be passed to api to ensure valid user
    const index = fav.indexOf(stop.toString());
    var input={}
    if (index > -1) { 
        input = {
          url: `${api.url}/favorites/delete`,
          options: {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              'Content-Type':'application/x-www-form-urlencoded',
              Authorization: "Bearer "+token 
            },
            body: 'routeId='+r+'&stopId='+ stop
          },
        };
    }
    else{
        input = {
          url: `${api.url}/favorites/add`,
          options: {
            method: "POST",
            headers: {
              Accept: "application/json",
              'Content-Type':'application/x-www-form-urlencoded',
              Authorization: "Bearer "+token 
            },
            body: 'routeId='+r+'&stopId='+ stop
          },
        };
    }
    apiCall(input)
  }

  //Handle the style for the routes selection and favorites box
  const rStyle = {
    margin: "0",
    width: "25vw",
    height: "46vh",
    "background-color": compliment(selection),
    overflow: "auto"
  };
  const fStyle = {
    margin: "0",
    width: "25vw",
    height: "41vh",
    "background-color": "#333333",
    overflow: "auto",
    paddingTop: "1vh"
  };
  
  //Handles api error and returns what will be displayed in UI
  return (
    <>
      {
        loading ? (<h1>Loading...</h1>) : (
          connectionError ? (
            <h1>There was an error connecting to the TransLoc API.</h1> 
          ) : (
    <div style={{ display: "flex" }}>
      <div style={leftStyle}>
          <div style={listStyle}>
            {routes.map((route) => {
              dropdownvalue = route.id;
              value = value + 1;

              return dropDown(
                dropdownvalue,
                route,
                open,
                setOpen,
                setSelection,
                setMapElem,
                setPoint,
                setZoom
              );
            })}
          </div>
      </div>

      <div style={middleStyle}>
        <div style={rStyle}>
      <RouteBarList selection={selection} favorites={favorites[selection]} toggleFav={toggleFav} compliment={compliment} setZoom={setZoom} setPoint={setPoint} setMapElem={setMapElem}/>
      </div>
      <h2 style={{display: "flex", "justify-content":"center", "align-items":"center",height: "5vh",color:"#e8b923",background: "#ad190e"}}>Favorites</h2>

      <div style={fStyle}>
       <FavList favorites={favorites} toggleFav={toggleFav} setZoom={setZoom} setPoint={setPoint} setMapElem={setMapElem}/>
      </div>
      </div>

      <Map coordinates={point} components={mapElem} mapStyle={rightStyle} zoom={zoom}/>
    </div>
    )
    )
  }
</>
);
}

export default Routes;
