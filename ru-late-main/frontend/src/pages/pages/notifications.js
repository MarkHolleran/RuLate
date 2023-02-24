import { useState, useEffect } from "react";
import { ButtonGroup, StyledFormArea2, StyledFormButton } from "../../components/Styles";
import { useSelector } from "react-redux";
import axios from "axios";
import api from "../../utils/api";
import "./notifications.css";

const Notifications = () => {

  // State hooks
  const [manageLoading, setManageLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [options, setOptions] = useState(null);
  const [notificationsTable, setNotificationsTable] = useState(null);

  // Values from Redux store
  const token = useSelector((state) => state.token.token);
  const user = useSelector((state) => state.user.user);
  const { userId, email, name, phone } = user;

  // API call to get all routes
  const routesInput = {
    url: `${api.url}/routes/getAll`,
    options: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${token}`
      },
    },
  };

  // API call to get all stops
  const stopsInput = {
    url: `${api.url}/stops/getAll`,
    options: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${token}`
      },
    },
  };

  // API call to get all notifications
  const notificationsInput = {
    url: `${api.url}/notifications/get`,
    options: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${token}`
      }
    }
  };

  useEffect(() => {
    // Variables to store data from API calls
    let routeStopLink = null;
    let routesData = null;
    let stopsData = null;
    let notificationsData = null;

    // TransLoc API call to get stops per route
    axios.get("https://feeds.transloc.com/3/stops?include_routes=true&agencies=1323").then((data) => {
      console.log("Got all routeStopLinks from TransLoc API");
      routeStopLink = data.data;

      // Make API call to get all routes
      api.call(
        routesInput,
        (status, data) => {
          switch (status) {
            case 200:
              console.log("Got all routes from API");
              routesData = data;

              // Make API call to get all stops
              api.call(
                stopsInput,
                (status, data) => {
                  switch (status) {
                    case 200:
                      console.log("Got all stops from API");
                      stopsData = data;
                      
                      // Add stops to each route
                      routesData.forEach((route) => {
                        route.stops = [];
                        const linkStops = routeStopLink.routes.find((linkRoute) => linkRoute.id == route.routeId).stops;
                        linkStops.forEach((stopId) => {
                          route.stops.push(stopsData.find((stop) => stop.stopId == stopId));
                        });
                      });

                      // Update state hooks
                      setRoutes(routesData);
                      setOptions(routesData[0].stops.map((stop) => (
                        <option value={stop.stopId}>{stop.name}</option>
                      )));

                      // Make API call to get all notifications
                      api.call(
                        notificationsInput,
                        (status, data) => {
                          switch (status) {
                            case 200:
                              console.log("Got user's notifications");
                              notificationsData = data;

                              // Add route names, stop names, and timestamps as a string to each notification
                              notificationsData.forEach((notification) => {
                                notification.routeName = routesData.find((route) => route.routeId == notification.routeId).name;
                                notification.stopName = stopsData.find((stop) => stop.stopId == notification.stopId).name;
                                notification.timestampString = new Date(notification.timestamp).toLocaleString();
                              });

                              // Update state hooks
                              setNotificationsTable(notificationsData.map((notification) => (
                                <tr>
                                  <td>{notification.notificationId}</td>
                                  <td>{notification.routeName}</td>
                                  <td>{notification.stopName}</td>
                                  <td>{notification.timestampString}</td>
                                  <td>
                                    <button onClick={() => deleteNotification(notification.notificationId)}>Delete</button>
                                  </td>
                                </tr>
                              )));
                              break;
                            default:
                              console.log("Unknown error: " + data.message);
                              setConnectionError(true);
                              break;
                          }
                          setManageLoading(false);
                        },
                        (err) => {
                          console.log(err.response);
                          setConnectionError(true);
                          setManageLoading(false);
                        }
                      )
                      break;
                    default:
                      console.log("Unknown error: " + data.message);
                      setConnectionError(true);
                      break;
                  }
                  setAddLoading(false);
                },
                (err) => {
                  console.log(err.response);
                  setConnectionError(true);
                  setManageLoading(false);
                  setAddLoading(false);
                }
              )
              break;
            default:
              console.log("Unknown error: " + data.message);
              setConnectionError(true);
              setManageLoading(false);
              setAddLoading(false);
              break;
          }
        },
        (err) => {
          console.log(err.response);
          setConnectionError(true);
          setManageLoading(false);
          setAddLoading(false);
        }
      )
    });
  }, []);

  // Notification deletion function
  function deleteNotification(notificationId) {
    // API call to delete a notification
    const input = {
      url: `${api.url}/notifications/delete/${notificationId}`,
      options: {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          authorization: `Bearer ${token}`
        },
      }
    };

    // Make API call
    api.call(
      input,
      (status, data) => {
        switch (status) {
          case 200:
            console.log("Notification deleted successfully");
            window.location.reload(false);
            break;
          default:
            console.log("Unknown error: " + data.message);
            window.location.reload(false);
            break;
        }
      },
      (err) => {
        console.log(err.response);
        window.location.reload(false);
      }
    )
  }

  // Update stops dropdown when a different route is selected
  function selectRoute({ target }) {
    const routeId = target.value;
    setOptions(routes.find((element => element.routeId == routeId)).stops.map((stop) => (
      <option value={stop.stopId}>{stop.name}</option>
    )));
  }

  // Notification addition function
  function addNotification(event) {
    // Prevents automatic page refresh
    event.preventDefault();

    // API call to add notification
    const input = {
      url: `${api.url}/notifications/add`,
      options: {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          routeId: event.target.addRoute.value,
          stopId: event.target.addStop.value,
          notifTime: (new Date(event.target.addTimestamp.value)).getTime()
        }),
      },
    };

    // Make API call
    api.call(
      input,
      (status, data) => {
        switch (status) {
          case 201:
            console.log("Notification added");
            window.location.reload(false);
            break;
          default:
            console.log("Unknown error: " + data.message);
            window.location.reload(false);
            break;
        }
      },
      (err) => {
        console.log(err.response);
        window.location.reload(false);
      }
    );
  }

  return (
    <>
      {
        (manageLoading || addLoading) ? (<h1>Loading...</h1>) : (
          connectionError ? (
            <h1>There was an error connecting to the API.</h1>
          ) : (
            <StyledFormArea2>
              <div className="title">
                Notifications
              </div>
              <div className="container">
                <div>
                  <h1>Manage Notifications</h1>
                  <table className="notificationsTable">
                    <thead>
                      <tr>
                        <th>Notification ID</th>
                        <th>Route</th>
                        <th>Stop</th>
                        <th>Execution Time</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notificationsTable}
                    </tbody>
                  </table>
                </div>
                <div>
                  <h1>Add Notification</h1>
                  <div>
                    <form onSubmit={addNotification}>
                      <p>Route</p>
                      <select
                        name="addRoute"
                        id="addRoute"
                        className="userInfoText"
                        onChange={selectRoute}
                      >
                        {routes.map((route, index) => {
                          return (
                            <option key={index} value={route.routeId}>
                              {route.name}
                            </option>
                          );
                        })}
                      </select>
                      <br />
                      <p>Stop</p>
                      <select
                        name="addStop"
                        id="addStop"
                      >
                        {options}
                      </select>
                      <br />
                      <p>Date and Time</p>
                      <input
                        type="datetime-local"
                        id="addTimestamp"
                        name="addTimestamp"
                        required
                      ></input>
                      <br />
                      <ButtonGroup>
                        <StyledFormButton type="submit">
                          Add Notification
                        </StyledFormButton>
                      </ButtonGroup>
                    </form>
                  </div>
                </div>
              </div>
            </StyledFormArea2>
          )
        )
      }
    </>
  );
  
};

export default Notifications;
