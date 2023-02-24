import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import StopList from "./components/map/StopList";
import BusList from "./components/map/BusList";
import RouteList from "./components/map/RouteList";
import RouteBarList from "./components/map/RouteBarList";
import Map from "./components/map/map";
import api from "../../utils/api";
import axios from "axios";

//Styles for both container and dashboard list
const containerStyle = {
  margin: "0",
  width: "80vw",
  height: "92vh",
};

const listStyle = {
  margin: "0",
  width: "20vw",
  height: "92vh",
  color: "white",
  backgroundColor: "black",
  textAlign: "center",
};

//map reset location
const reset = {
  lat: 40.52299,
  lng: -74.43944,
};

function Dashboard() {

  // React hooks
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [routes, setRoutes] = useState([]);

  // Redux
  const token = useSelector((state) => state.token.token);

  // API call to get active routes
  const input = {
    url: `${api.url}/routes/getAll`,
    options: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${token}`,
      },
    },
  };

  // Make API call once no page load
  useEffect(() => {
    axios.get("https://feeds.transloc.com/3/routes?agencies=1323").then((data) => {
      let routesList = [];
      data.data.routes.map((route) => routesList.push({
          id: route.id,
          name: route.long_name,
          routeColor: route.color,
          textColor: route.text_color,
          active: route.is_active,
          display: false,
          enabled: true,
        })
      );
      api.call(
        input,
        (status, data) => {
          switch (status) {
            case 200:
              // Disables inactive routes in routeList
              data.forEach((route) => {
                if (route.enabled === 0) {
                  routesList.find(element => element.id == route.routeId).enabled = false;
                }
              });
              setRoutes(routesList);
              break;
            default:
              console.log('Unknown error: ' + data.message);
              setConnectionError(true);
              break;
          }
          setLoading(false);
        }
      );
    }).catch((err) => {
      console.log(err.response);
      setConnectionError(true);
      setLoading(false);
    });
  }, []);

  //Handles which route to display based on used selection
  function toggleRoute(id) {
    const newRoutes = [...routes];
    const route = newRoutes.find((route) => route.id === id);
    route.display = !route.display;
    setRoutes(newRoutes);
  }

  //Handles api display error and displays the dashboard
  return (
    <>
      {
        loading ? (<h1>Loading...</h1>) : (
          connectionError ? (
            <h1>There was an error connecting to the TransLoc API.</h1>
          ) : (
            <div style={{ display: "flex" }}>
              <div style={listStyle}>
                <RouteBarList routes={routes} toggleRoute={toggleRoute} />
              </div>
              <Map
                coordinates={reset}
                mapStyle={containerStyle}
                components={
                  <>
                    <BusList routes={routes} />
                    <RouteList routes={routes} />
                    <StopList />
                  </>
                }
              />
            </div>
          )
        )
      }
    </>
  );
}

export default Dashboard;