import React from 'react'
import { FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi"; // TextInput icons

const UserInfo = ({ name, email, phone }) => {
  
  // "User Information" section of "/settings"
  return (
    <div>
      <h1>User Information</h1>
      <div>
        <div className="userInformationSection">
          <h3>Name</h3>
          <div>
            <FiUser /> {name}
          </div>
        </div>
        <div className="userInformationSection">
          <h3>Email</h3>
          <div>
            <FiMail /> {email}
          </div>
        </div>
        <div className="userInformationSection">
          <h3>Password</h3>
          <div>
            <FiLock /> ********
          </div>
        </div>
        <div className="userInformationSection">
          <h3>Phone Number</h3>
          <div>
            <FiPhone /> {phone ? phone : "N/A"}
          </div>
        </div>
      </div>
    </div>
  );

}

export default UserInfo;