import React from 'react'
import "../../../pages/admin.css"
//Stores the infomration that the api call pulls/fills table with
export default function tableRows ({data, editClick}) {
        return (<tr className="table">
            <td className="table">{data.userId}</td>
            <td className="table">{data.email}</td>
            <td className="table">{data.name}</td>
            <td className="table">{data.phone}</td>
            <td className="table">{data.admin}</td>
            <td className="table">
                <button type = 'button' onClick = {(event)=>editClick(event, data)} style = {{fontSize: '15px', padding: '5px', backgroundColor: 'black', color: 'white', width: '100%' }} >Edit</button>
            </td>
        </tr>
    );
    };