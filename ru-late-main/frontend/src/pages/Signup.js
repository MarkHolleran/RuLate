
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as yup from "yup";
import api from '../utils/api';
import { FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi";
import { TextInput } from "../components/FormLib";
import { Avatar, ButtonGroup, colors, CopyrightText, ExtraText, StyledFormArea, StyledFormButton, StyledTitle, TextLink } from "../components/Styles";
import Logo from "../assets/templogo.png";

const Signup = () => {

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
    passwordRepeat: "",
    name: "",
    phone: ""
  };

  // RegEx for phone number
  const phoneMatch = /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

  // Form validation schema
  const emailValidation = yup
    .string()
    .email("Invalid email address")
    .required("Required");
  const passwordValidation = yup
    .string()
    .min(8, 'Password is too short - 8 characters minimum')
    .max(30, "Password is too long - our database can't handle passwords with more than 30 characters :^(")
    .required("Required");
  const passwordRepeatValidation = yup
    .string()
    .required("Required")
    .oneOf([yup.ref('password')], "Password does not match");
  const nameValidation = yup
    .string()
    .required("Required");
  const phoneValidation = yup
    .string()
    .matches(phoneMatch, "Invalid phone number");
  const validationSchema = yup.object({
    email: emailValidation,
    password: passwordValidation,
    passwordRepeat: passwordRepeatValidation,
    name: nameValidation,
    phone: phoneValidation
  });

  // Redirect
  const navigate = useNavigate();

  // Form submission function
  const signup = (values, { setFieldError }) => {
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
          phone: (values.phone.trim() === "") ? null : values.phone
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
            navigate("/login");
            break;
          case 409:
            console.log("Unsuccessful sign-up: " + data.message);
            setFieldError("email", data.message);
            navigate("/signup");
            break;
          default:
            console.log("Unknown error: " + data.message);
            navigate("/signup");
            break;
        }
      },
      (err) => {
        console.log(err.response);
        navigate("/signup");
      }
    )
  };
  
  return (
    <div>
      <StyledFormArea>
        <Link to="/home">
          <Avatar image={Logo} />
        </Link>
        <StyledTitle color={colors.theme} size={30}>
          Sign Up
        </StyledTitle>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => signup(values, actions)}
        >
          <Form>
            <TextInput
              name="email"
              type="text"
              label="Email Address"
              placeholder="olga1@example.com"
              icon={<FiMail />}
            />
            <TextInput
              name="password"
              type="password"
              label="Password"
              placeholder="********"
              icon={<FiLock />}
            />
            <TextInput
              name="passwordRepeat"
              type="password"
              label="Repeat Password"
              placeholder="********"
              icon={<FiLock />}
            />
            <TextInput
              name="name"
              type="text"
              label="Name"
              placeholder="Olga Simpson"
              icon={<FiUser />}
            />
            <TextInput
              name="phone"
              type="text"
              label="Phone Number (optional)"
              placeholder="(###) ###-####"
              icon={<FiPhone />}
            />
            <ButtonGroup>
              <StyledFormButton type="submit">Signup</StyledFormButton>
            </ButtonGroup>
          </Form>
        </Formik>

        <ExtraText>
          Already have an account? <TextLink to="/login">Login!</TextLink>
        </ExtraText>
      </StyledFormArea>

      <CopyrightText>
        Copyright &copy;2022 RU Late. All rights reserved.
      </CopyrightText>
    </div>
  );
};

export default Signup;