import styled from "styled-components"; //Colors of our style/theme for login
import background from "../assets/background.png"; //background of login
import { Link } from "react-router-dom"; //React router

//Reusable colors
export const colors = {
  primary: "#fff",
  theme: "#BE185D",
  light1: "#F3F4F6",
  light2: "#E5E7EB",
  dark1: "#1F2937",
  dark2: "#4B4463",
  dark3: "#9CA3AF",
  red: "#DC2626",
};

//Reusable container 
export const StyledContainer = styled.div`
    margin: 0;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(0deg, rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url(${background});
    background-size: cover;
    background-attachment: fixed;
`;

//Reusable container 
export const StyledContainer2 = styled.div`
    min-height: 100vh;
    min-width: 100vw;
    display: block;
    justify-content: center;
    align-items: center;
`;

//Home components
export const StyledTitle = styled.h2`
    font-size: ${(props) => props.size}px;
    text-align: center;
    color: ${(props) => (props.color ? props.color : colors.primary)};
    padding: 5px;
    margin-bottom: 20px;
`;

//Sub title style
export const StyledSubTitle = styled.p`
    font-size: ${(props) => props.size}px;
    text-align: center;
    color: ${(props) => (props.color ? props.color : colors.primary)};
    padding: 5px;
    margin-bottom: 25x;
`;

//For logo
export const Avatar = styled.div`
    width: 130px;
    height: 130px;
    border-radius: 50px;
    background-image: url(${(props) => props.image});
    background-size: cover;
    background-position: center;
    margin: auto;
    
`;

//In theme buttons
export const StyledButton = styled(Link)`
    padding: 10px;
    width: 150px;
    background-color: transparent;
    font-size: 16px;
    border: 3px solid ${colors.primary};
    border-radius: 25px;
    color: ${colors.primary};
    text-decoration: none;
    text-align: center;
    transition: ease-in-out 0.3s;
    outline: 0;

    &:hover{
        background-color: ${colors.primary};
        color: ${colors.theme};
        cursor: pointer;
    }
`;

//Group for the buttons
export const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    margin-top: 25px;
`;

//Input field styles
export const StyledTextInput = styled.input`
    width: 280px;
    padding: 15px;
    padding-left: 50px;
    font-size: 17px;
    letter-spacing: 1px;
    color: ${colors.dark1};
    background-color: ${colors.light2};
    border: 0;
    outline: 0;
    display: block;
    margin: 5px auto 10px auto;
    transition: ease-in-out 0.3s;

    ${(props) =>
      props.invalid &&
      `background-color: ${colors.red}; color: ${colors.primary};`}

    &:focus {
        background-color: ${colors.dark2};
        color: ${colors.primary};
    }
`;

//label style 
export const StyledLabel = styled.p`
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    
`;

//component that wraps whole form
export const StyledFormArea = styled.div`
    background-color: ${(props) => props.bg || colors.light1};
    text-align: center;
    padding: 45px 55px;
`;

//Form area wihtout padding
export const StyledFormArea2 = styled.div`
    background-color: ${(props) => props.bg || colors.light1};
    text-align: center;
    padding: 0px 55px;
`;

//styled form button
export const StyledFormButton = styled.button`
    padding: 10px;
    width: 150px;
    background-color: transparent;
    font-size: 16px;
    border: 2px solid ${colors.theme};
    border-radius: 25px;
    color: ${colors.theme};
    transition: ease-in-out 0.3s;
    outline: 0;

    &:hover{
        background-color: ${colors.theme};
        color: ${colors.primary};
        cursor: pointer;

    }
`;

//styled form button
export const StyledFormButton2 = styled.button`
    padding: 10px;
    width: 150px;
    background-color: ${colors.theme};
    font-size: 16px;
    border: 2px solid ${colors.theme};
    border-radius: 25px;
    color: ${colors.primary};
    transition: ease-in-out 0.3s;
    outline: 0;

    &:hover{
        background-color: transparent;
        color: ${colors.theme};
        cursor: pointer;

    }
`;

//style for message that displays if password too short/too long and if email is valid or not
export const ErrorMsg = styled.div`
    font-size: 11px;
    color: ${colors.red};
    margin-top: -5px;
    margin-bottom: 10px;
    text-align: left;
`;

//when text is long
export const ExtraText = styled.p`
    font-size: ${(props) => props.size}px;
    text-align: cener;
    color: ${(props) => (props.color ? props.color : colors.dark2)}
    padding: 2px;
    margin-top: 10px;
`;

//link for the signup page
export const TextLink = styled(Link)`
    text-decoration: none;
    color: ${colors.theme};
    transition: ease-in-out 0.3s;

    &:hover {
        text-decoration: underline;
        letter-spacing: 2px;
        font-weight: bold;
    }
    `;

//Style icons for input text for login
export const StyledIcon = styled.p`
    color: ${colors.dark1};
    position: absolute;
    font-size: 21px;
    top: 35px;
    ${(props) => props.right && `right: 15px; `};
    ${(props) => !props.right && `left: 15px;`}
    `;

//copyrigh message at the bottom cus why not
export const CopyrightText = styled.p`
        padding: 5px;
        margin: 20px;
        text-align: center;
        color: ${colors.light2}
    `;