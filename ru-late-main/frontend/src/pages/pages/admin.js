import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
//Imports and such from Signup.js
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import { Formik, Form } from "formik"; // Formik
import * as yup from "yup"; // Input validation
import { StyledFormArea2 } from "../../components/Styles";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import TableRows from './components/admin/TableRows.js'
import Edit from './components/admin/Edit'
import AddUserForm from './components/admin/AddUserForm.js'
import store from "../../store/store"
//import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
//import Table from 'react-bootstrap/Table';
import "./admin.css"
//Initial values of Add User Form
const initialValues = {
  email: "",
  password: "",
  passwordRepeat: "",
  name: "",
  phone: "",
};

const phoneMatch = /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

//Form validation schema
const emailValidation = yup
  .string()
  .email("Invalid email address")
  .required("Required");
const passwordValidation = yup
  .string()
  .min(8, "Password is too short - 8 characters minimum")
  .max(
    30,
    "Password is too long - our database can't handle passwords with more than 30 characters :^("
  )
  .required("Required");
const passwordRepeatValidation = yup
  .string()
  .required("Required")
  .oneOf([yup.ref("password")], "Password does not match");
const nameValidation = yup.string().required("Required");
const phoneValidation = yup
  .string()
  .matches(phoneMatch, "Invalid phone number");
const validationSchema = yup.object({
  email: emailValidation,
  password: passwordValidation,
  passwordRepeat: passwordRepeatValidation,
  name: nameValidation,
  phone: phoneValidation,
});

//Sign up function API call
const signup = (values, { setFieldError }, navigate) => {
  // API call to attempt user signup
  const input = {
    url: `${api.url}/users/signup`,
    options: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        name: values.name,
        phone: values.phone.trim() === "" ? null : values.phone,
      }),
    },
  };

  // Make API call
  api.call(
    input,
    (status, data) => {
      console.log(status);
      console.log(data);
      switch (status) {
        case 201:
          console.log("Successful sign-up");
          navigate("/admin");
          break;
        case 409:
          console.log("Unsuccessful sign-up: " + data.message);
          setFieldError("email", data.message);
          navigate("/admin");
          break;
        default:
          console.log("Unknown error: " + data.message);
          navigate("/admin");
          break;
      }
    },
    (err) => {
      console.log(err.response);
      navigate("/admin");
    }
  );
};

//These 3 styles are used for splitting up the page into sections
// const leftStyle = {
//   margin: "0",
//   width: "66.6vw",
//   height: "92vh",
//   overflow: "auto",
// };

// const middleStyle = {
//   margin: "0",
//   width: "33.3vw",
//   height: "92vh",
// };

// const rightStyle = {
//   margin: "0",
//   width: "33.3vw",
//   height: "82vh",
//   overflow: "auto"

//   //maxHeight: '100%'
// };

const rightStyle = {
  margin: "0",
  width: "66.7vw",
  height: "92vh",
  overflow: "auto",
  backgroundColor: "#F3F4F6", 
};
const addStyle = {
  margin: "0",
  marginBottom: "2vh",
  width: "33.3vw",
  maxHeight: "92vh",
  overflow: "auto",
  // border: "5px solid #ad190e",
  borderRadius: "50px",
  padding: "15px",
  boxShadow: "0px 1vh 2vh #ad190e"
};
const manageStyle = {
  margin: "0",
  width: "65.7vw",
  maxHeight: "82vh",
  overflow: "auto",
};
const  leftStyle= {
  margin: "0",
  width: "33.3vw",
  height: "82vh",
  overflow: "auto"
};

const titleStyle ={
  color: "#BE185D",
  fontSize: 30, 
  backgroundColor: "#F3F4F6", 
  textAlign: "center", 
  height: "10vh", 
  display: "flex",
  "justify-content":"center",
  "text-align":"center",
  "align-items":"center", 
  fontFamily: "'Roboto', sans-serif",
  "-webkit-font-smoothing": "antialiased", 
  "font-weight": "bold"
}

// const tableStyle={
//   border: "1px solid black",
//   borderCollapse: "collapse"
// }

//Returns Color of Route
function colorPerRoute(route) {
  return {
    color: "white",
    "background-color": "#" + route.routeColor,
    "text-align": "center",
  };
}

//Creates the Add User React Form
function createSignupForm(navigate) {
  return (
    <StyledFormArea2>
      <Link to="/home"></Link>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          signup(values, actions, navigate);
        }}>
        <Form>
          <AddUserForm/>
        </Form>
      </Formik>
    </StyledFormArea2>
  );
}

//Uses input routeId to toggle disabled field in the database via API
function disableRoute(routeId) {
  const token = store.getState().token.token;

  const routeDBDisable = {
    url: `${api.url}/routes/disable/` + routeId,
    options: {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${token}`,
      },
    },
  };

  api.call(routeDBDisable, (status, data) => {
    if (status === 200) {

      //we can also update the dbroutes here?
    } else {
      console.log("ERROR");
    }
  });
}

//Uses input routeId to toggle disabled field in the database via API
function enableRoute(routeId) {
  const token = store.getState().token.token;

  const routeDBEnable = {
    url: `${api.url}/routes/enable/` + routeId,
    options: {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${token}`,
      },
    },
  };

  api.call(routeDBEnable, (status, data) => {
    if (status === 200) {
      console.log("SuccessfulLT ENABLED");

      //we can also update the dbroutes here?
    } else {
      console.log("ERROR");
    }
  });
}

//Creates one checkbox in the Disable routes list
function oneCheckbox(checked, setChecked, value, route, DBsetRoutes, DBroutes) {
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    const currentIndexDB = DBroutes.indexOf(value);
    const newDB = [...DBroutes];

    if (currentIndex === -1) {
      disableRoute(value);
      //if checked route isn't already in the list add it
      newChecked.push(value);
      newDB.push(value);
    } else {
      enableRoute(value);
      newChecked.splice(currentIndex, 1);
      newDB.splice(currentIndexDB, 1);
    }
    setChecked(newChecked);
    DBsetRoutes(newDB);

  };

  return (
    <ListItem
      style={colorPerRoute(route)}
      key={value}
      secondaryAction={
        <Checkbox
          edge="end"
          onChange={handleToggle(value)}
          checked={checked.indexOf(value) !== -1}
          inputProps={{ "aria-labelledby": value }}
        />
      }
      disablePadding
    >
      <ListItemButton>
        <ListItemText id={value} primary={route.name} />
      </ListItemButton>
    </ListItem>
  );
}


//Creates drop down list object with checkbox in it's drop down
function dropDown(
  value,
  dropdownvalue,
  checked,
  setChecked,
  route,
  open,
  setOpen,
  setSelection,DBsetRoutes, DBroutes
) {
  return (
    <List sx={{backgroundColor: 'transparent', p:.5}}>
    {oneCheckbox(checked, setChecked, value, route,DBsetRoutes, DBroutes)}
    </List>
  );
}
//Creates the Disable routes UI component
function createRoutesToggleForm({routes}, open, setOpen, selection, setSelection, checked, setChecked, value, dropdownvalue,list,DBroutes, DBsetRoutes){
    return (
        <StyledFormArea2 backgroundColor = 'red'>
        {routes.map((route) => {
            dropdownvalue = route.id;
            value = route.id;
            DBroutes.map(DBroute => {
                if (checked.includes(DBroute)){
                }else {
                    checked.push(DBroute)
                }
                return null
            })

            return dropDown(
              value,
              dropdownvalue,
              checked,
              setChecked,
              route,
              open,
              setOpen,
              setSelection,DBsetRoutes, DBroutes
            );
          })}
        </StyledFormArea2>
    );
}

//Table to display current users and make updates to user settings
function createUserRemoveOrMakeAdminList(data, addData, editClick, editInfo, editData, saveEdit, apiCall){
  
    return (
            <form onSubmit = {saveEdit}> 
              <table className="table">
                <thead>
                  <tr>
                    <th className="table" width="10%">UserId</th>
                    <th className="table" width="20%">Email</th>
                    <th className="table" width="15%">Name</th>
                    <th className="table" width="20%">Phone</th>
                    <th className="table" width="10%">Admin</th>
                    <th className="table" width="15%">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((data) => (
                  <Fragment>
                    {addData === data.userId ? (
                      <Edit 
                      data = {data} 
                      editData = {editData} 
                      editInfo = {editInfo}
                      apiCall = {apiCall}/> 
                    ):(
                      <TableRows data = {data} 
                      editClick = {editClick}
                      />
                    )}
                  </Fragment>
                  ))}
                </tbody>
              </table>
            </form>
          );
};

//Calls the api to make updates to the user
function apiUpdateCall(input, apiCall){
  // Make API call
  api.call(
    input,
    (status, data) => {
      if (status===200){
        // Make API call
        apiCall()
      }
      else{
        console.log("ERROR")
      }
      }
  );
}

//Main Controller to pass inputs into other functions
const Admin = () => {
    const [routes, setRoutes] = useState([]);
    const [DBroutes, DBsetRoutes] = useState([]);
    const [checked, setChecked] = React.useState([]);
    const [open, setOpen] = React.useState([]);
    const [selection, setSelection] = React.useState(false);
    const [users, setUsers] = useState([]);
    const [addData, setAddData] = useState(null);

    const [editData, setEditData] = useState({
      userId: '',
      email: '',
      name: '',
      phone: '',
      admin: ''
    })

    var value = 0;
    var dropdownvalue = 0;
    var list = [];

  // Redirect
  const navigate = useNavigate();

  const editInfo = (event) => {
    event.preventDefault();

    const temp = event.target.getAttribute('name')
    const val = event.target.value;

    const newData = {...editData};
    newData[temp] = val

    setEditData(newData)
  }

  const editClick = (event, data)=> {
    event.preventDefault();
    setAddData(data.userId)

    const formVal = {
      userId: data.userId,
      email: data.email,
      name: data.name,
      phone: data.phone,
      admin: data.admin
    }
    setEditData(formVal)
  }

  function apiCall() {
    const token= store.getState().token.token;
    const input2 = {
      url: `${api.url}/users/getAll`,
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
        console.log("USER DATA!")
        console.log(JSON.stringify(data));
        console.log("SuccessfulLT GOT USERS.");
        setUsers(data)
      }
      else{
        console.log("ERROR")
      }
      }
  );
    }
    
  const saveEdit = (event) => {
    event.preventDefault();
    const input = {
      url: `${api.url}/users/update/` + addData,
      options: {
        method: "PUT",
        headers: {
          Accept: "application/json",
          'Content-Type':'application/x-www-form-urlencoded',
          Authorization: "Bearer "+token 
        },
        body: 'email='+editData.email+'&name='+ editData.name +'&phone=' +editData.phone + '&admin=' +editData.admin 
      },
    };
    apiUpdateCall(input, apiCall)
     setAddData(null)
  }

const token = store.getState().token.token

    const routeDBDataInput = {
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
        //let DBroutesList = [];
        data.data.routes.map((route) => routesList.push({
          id: route.id,
          name: route.long_name,
          routeColor: route.color,
          textColor: route.text_color,
          active: route.is_active
        }));
        setRoutes(routesList);
        updateToggleRoutesInDB(DBsetRoutes);

      }).catch((err) => {
        console.log(err.response);
      });
    }, []);

//Retrieves the newest state of the database
function updateToggleRoutesInDB(DBsetRoutes){

      let DBroutesList = [];

      api.call(
          routeDBDataInput,
          (status, data) => {
            switch (status) {
              case 200:
                data.forEach((route) => {
                if (route.enabled === 0){
                  DBroutesList.push(parseInt(route.routeId))
                }
                });
                DBsetRoutes(DBroutesList);
                break;
              default:
                console.log('Unknown error: ' + data.message);
                break;
            }
          }
        );
  }



    const input2 = {
      url: `${api.url}/users/getAll`,
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
  useEffect(() => {
  api.call(
    input2,
    (status, data) => {
      if (status===200){
        console.log("USER DATA!")
        //console.log(JSON.stringify(data));
        console.log("SuccessfulLT GOT USERS.");
        setUsers(data)
      }
      else{
        console.log("ERROR")
      }
      }
  );}, []);

  //Functions and inputs being pass through and displayed on admin page
  return (
    <div style={{ display: "flex" }}>
      <div>
        <div style={titleStyle}>
          Disable Routes
        </div>
        <div style={leftStyle}> {createRoutesToggleForm({routes}, open, setOpen, selection, setSelection, checked, setChecked, value, dropdownvalue,list, DBroutes, DBsetRoutes)}</div>
      </div>
      <div style={rightStyle}>
        <div>
          <div style={titleStyle}>
            Add User
          </div>
          <div style={{  display: "flex",
  "justify-content":"center",
  "text-align":"center",
  "align-items":"center", }}>
          <div style={addStyle}>{createSignupForm(navigate)}</div>
          </div>
        </div>
        <div>
          <div style={titleStyle}>
            Manage Users
          </div>
          <div style={manageStyle}>{createUserRemoveOrMakeAdminList(users, addData, editClick, editInfo, editData, saveEdit, apiCall)}</div>
        </div>
      </div>
    </div>
  );
};

export default Admin;