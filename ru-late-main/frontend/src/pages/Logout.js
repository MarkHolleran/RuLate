import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { removeToken } from '../store/tokenSlice';
import { removeUser } from "../store/userSlice";
import { Avatar, colors, ExtraText, StyledFormArea, StyledTitle } from '../components/Styles';
import Logo from '../assets/templogo.png';

const Logout = () => {

  // Redux dispatch
  const dispatch = useDispatch();

  // Removes token and user information from store
  dispatch(removeToken());
  dispatch(removeUser());

  console.log("User has been logged out");

  // Shows logout text; click on logo to redirect to "/home"
  return (
    <StyledFormArea>
      <Link to="/home">
        <Avatar image={Logo} />
      </Link>
      <StyledTitle color={colors.theme} size={30}>
        Logout
      </StyledTitle>
      <ExtraText>
        You have successfully been logged out.
      </ExtraText>
    </StyledFormArea>
  );

}

export default Logout;