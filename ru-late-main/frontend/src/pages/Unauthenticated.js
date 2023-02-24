import React, { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import api from "../utils/api";

const Unauthenticated = ({ children }) => {
  
  // State hooks
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [loggedIn, setLoggedIn] = useState(null);

  // Values from Redux store
  const token = useSelector((state) => state.token.token);
  const dispatch = useDispatch();

  // API call to check if user is logged in
  const input = {
    url: `${api.url}/users/get`,
    options: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${token}`,
      },
    }
  }

  // Make API call once on page load
  useEffect(() => {
    api.call(
      input,
      (status, data) => {
        switch (status) {
          case 200:
            console.log("User is already logged in.");
            dispatch(setUser(data));
            setLoggedIn(true);
            break;
          case 401:
          case 404:
            console.log("Invalid Token: " + data.message);
            setLoggedIn(false);
            break;
          default:
            console.log("Unknown error: " + data.message);
            setLoggedIn(false);
            break;
        }
        setLoading(false);
      },
      (err) => {
        console.log(err.response);
        setConnectionError(true);
        setLoading(false);
      }
    );
  }, []);
  
  return (
    <>
      {
        loading ? (<h1>Loading...</h1>) : (
          connectionError ? (
            <h1>There was an error connecting to the API.</h1>
          ) : (
            loggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <>
                {children}
              </>
            )
          )
        )
      }
    </>
  );

}

export default Unauthenticated;