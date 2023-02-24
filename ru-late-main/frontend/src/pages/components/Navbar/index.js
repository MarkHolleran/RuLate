import React from "react";
import { useSelector } from 'react-redux';
import "./nav.css"

//Adds the title for the main nav bar
const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const { name, admin } = user;
  console.log("ADMIN: "+admin)
  console.log("WINDOW: "+window.location.pathname)
  function classSelector(nav){
    if(window.location.pathname===nav){
      return "active"
    }
    return "nav"
  }
  return (
    <>
      <ul className="nav">
        <li className={classSelector("/dashboard")}><a href="/dashboard" className="img">
          <img src="../../templogo.png" width="80" height="80"/> 
          <img src="../../logo.png" width="80" height="80"/> 
        </a></li>
        {/* <li className="nav"><a href="/dashboard" className="nav">Dashboard</a></li> */}
        <li className={classSelector("/routes")}><a href="/routes" className="nav">Routes/Stops</a></li>
        <li className={classSelector("/notifications")}><a href="/notifications" className="nav">Notifications</a></li>
        <li className={classSelector("/settings")}><a href="/settings" className="nav">Settings</a></li>
        {admin ? (
          <li className={classSelector("/admin")}><a href="/admin" className="nav">Admin</a></li>
          )
          :(<></>)}
        <li style={{float:"right"}} className="nav"><a className="logout" href="/logout">Logout</a></li>
      </ul>
    </>
  );
};

export default Navbar;
