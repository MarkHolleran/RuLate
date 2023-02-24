import { Link } from "react-router-dom";
import { Avatar, colors, ExtraText, StyledFormArea, StyledTitle } from '../components/Styles';
import Logo from '../assets/templogo.png';

const NotFound = () => {

  console.log("404: Page not found");

  // Shows error text; click on logo to redirect to "/home"
  return (
    <StyledFormArea>
      <Link to="/home">
        <Avatar image={Logo} />
      </Link>
      <StyledTitle color={colors.theme} size={30}>
        Error 404
      </StyledTitle>

      <ExtraText>
        Page not found.
      </ExtraText>
    </StyledFormArea>
  )
  
}

export default NotFound;