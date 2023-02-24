import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { StyledFormArea2 } from "../../components/Styles";
import "./settings.css"
import UserInfo from "./components/settings/UserInfo";
import EditAccount from "./components/settings/EditAccount";
import DeleteAccount from "./components/settings/DeleteAccount";

const Settings = () => {

  // State hooks
  const [loading, setLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const [deleteButton, setDeleteButton] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Values from Redux store
  const token = useSelector((state) => state.token.token);
  const user = useSelector((state) => state.user.user);
  const { userId, email, name, phone } = user;

  // Redirect
  const navigate = useNavigate();

  return (
    <div>
      <StyledFormArea2>
        <div className="title">
          User Settings
        </div>
        <div className="container">
          <UserInfo name={name} email={email} phone={phone} />
          <EditAccount loading={loading} setLoading={setLoading} token={token} user={user} />
          <DeleteAccount loading={loading} setLoading={setLoading} token={token} setDeleteError={setDeleteError} 
            deleteConfirmation={deleteConfirmation} setDeleteButton={setDeleteButton} setDeleteConfirmation={setDeleteConfirmation} 
            deleteButton={deleteButton} navigate={navigate} />
        </div>
      </StyledFormArea2>
    </div>
  );

}

export default Settings;