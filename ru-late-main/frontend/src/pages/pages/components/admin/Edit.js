import React from 'react'
import store from "../../../../store/store"
import api from "../../../../utils/api";
import "../../../pages/admin.css"
//Save and Delete button styles

export default function Edit ({data, editData, editInfo, apiCall} ) {
    function deleteUser (){
        const token= store.getState().token.token;
        const input2 = {
            url: `${api.url}/users/delete/`+ data.userId,
            options: {
              method: "DELETE",
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
              console.log("Deleted")
              apiCall()
            }
            else{
              console.log("ERROR")
            }
            }
        );
    }

    //Buttons/Input boxes for when an admind wants to make an update to user settings
    return(<tr className="table">
        <td className="table">  
          {data.userId}
        </td>
        <td className="table">
            <input className="table" 
                type = 'text' 
                //required = 'required'
                playholder= 'Enter a Email'
                name = 'email'
                value = {editData.email}
                onChange = {editInfo}
            ></input>
        </td>
        <td className="table">
            <input className="table" 
                type = 'text' 
                //required = 'required'
                playholder= 'Enter a Name'
                name = 'name'
                onChange = {editInfo}
                value = {editData.name}
            ></input>
        </td>
        <td className="table">
            <input className="table" 
                type = 'text' 
                //required = 'required'
                playholder= 'Enter a Phone Number'
                name = 'phone'
                onChange = {editInfo}
                value = {editData.phone}
            ></input>
        </td>
        <td className="table">
            <input className="table" 
                type = 'text' 
                //required = 'required'
                playholder= 'Enter a Admin Role'
                name = 'admin'
                onChange = {editInfo}
                value = {editData.admin}
            ></input>
        </td>
        <td className="table">
            <button type="submit" style = {{fontSize: '15px', padding: '5px', marginRight:"5px", backgroundColor: 'green', color: 'white', width: '47%' }}>Save</button>
            <button type="button" onClick = {deleteUser} style = {{fontSize: '15px', padding: '5px', backgroundColor: 'red', color: 'white', width: '47%' }}>Delete</button>
       
        </td>
    </tr>
    //}
);
};
    
