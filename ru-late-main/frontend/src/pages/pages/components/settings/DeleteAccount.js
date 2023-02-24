import { ButtonGroup, StyledFormButton } from "../../../../components/Styles";
import api from "../../../../utils/api";

const DeleteAccount = ({ loading, setLoading, token, setDeleteError, deleteConfirmation, setDeleteButton, setDeleteConfirmation, deleteButton, navigate }) => {
  
  // User deletion function
  const deleteUser = () => {
    // Disable fields
    setLoading(true);

    // API call to attempt user delete
    const input = {
      url: `${api.url}/users/delete`,
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
        console.log(status);
        console.log(data);
        switch (status) {
          case 200:
            console.log("Successful delete");
            navigate("/login");
            break;
          case 405:
            console.log("Unsuccessful delete: " + data.message);
            setDeleteError("You cannot delete your account when you are the only admin.");
            navigate("/settings");
            break;
          default:
            console.log("Unknown error: " + data.message);
            setDeleteError("Unknown error: " + data.message);
            navigate("/settings");
            break;
        }
        setLoading(false);
      },
      (err) => {
        console.log(err.response);
        navigate("/settings");
      }
    );
  }

  // Show second checkbox when first checkbox is checked
  const allowDeleteConfirmation = () => {
    if (deleteConfirmation === true) setDeleteButton(false);
    setDeleteConfirmation(!deleteConfirmation);
  }

  // Show delete account button when second checkbox is checked
  const allowDeleteButton = () => {
    setDeleteButton(!deleteButton);
  }

  // "Delete Account" section of "/settings"
  return (
    <div>
      <h1>Delete Account</h1>
      <div>
        <input id="deleteConfirmationCheckbox" type="checkbox" className="deleteAccountCheckbox" onClick={allowDeleteConfirmation} />
        <label for="deleteConfirmationCheckbox"> Are you sure you want to delete your account?</label>
        <br />
        {
          deleteConfirmation ? (
            <>
              <input id="deleteButtonCheckbox" type="checkbox" className="deleteAccountCheckbox" onClick={allowDeleteButton} />
              <label for="deleteButtonCheckbox"> Are you really sure you want to delete your account?</label>
            </>
          ) : (
            <></>
          )
        }
        {
          (deleteConfirmation && deleteButton) ? (
            <ButtonGroup>
              <StyledFormButton type="submit" disabled={loading} onClick={deleteUser}>Delete</StyledFormButton>
            </ButtonGroup>
          ) : (
            <></>
          )
        }
      </div>
    </div>
  );

}

export default DeleteAccount;