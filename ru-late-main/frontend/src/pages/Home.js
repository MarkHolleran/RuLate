import { Link } from 'react-router-dom';
import { Avatar, ButtonGroup, StyledButton, StyledSubTitle, StyledTitle } from "../components/Styles";
import Logo from "../assets/templogo.png";

const Home = () => {

  // Home page, with redirects to "/login" and "/signup"
  return (
    <div>
      <Link to="/home">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "transparent",
            width: "100%",
            padding: "15px",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Avatar image={Logo} />
        </div>
      </Link>
      <StyledTitle size={65}>Welcome to RULate!</StyledTitle>
      <StyledSubTitle size={26}>Feel free to explore our page!</StyledSubTitle>

      <ButtonGroup>
        <StyledButton to="/login">Login</StyledButton>
        <StyledButton to="/signup">Signup</StyledButton>
      </ButtonGroup>
    </div>
  );

};

export default Home;