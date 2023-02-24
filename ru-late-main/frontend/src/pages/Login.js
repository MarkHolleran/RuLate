import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../store/tokenSlice";
import * as yup from "yup";
import { Formik, Form } from "formik";
import api from "../utils/api";
import { FiMail, FiLock } from "react-icons/fi";
import { TextInput } from "../components/FormLib";
import { Avatar, ButtonGroup, colors, CopyrightText, ExtraText, StyledFormArea, StyledFormButton, StyledTitle, TextLink } from "../components/Styles";
import Logo from "../assets/templogo.png";

const Login = () => {

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
  };

  // Form validation schema
  const emailValidation = yup
    .string()
    .email("Invalid email address")
    .required("Required");
  const passwordValidation = yup
    .string()
    .min(1, "Password is too short")
    .max(30, "Password is too long")
    .required("Required");
  const validationSchema = yup.object({
    email: emailValidation,
    password: passwordValidation,
  });

  // Redux dispatch
  const dispatch = useDispatch();

  // Redirect
  const navigate = useNavigate();

  // Form submission function
  const login = (values, { setFieldError }) => {
    // API call to attmempt user login
    const input = {
      url: `${api.url}/users/login`,
      options: {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      },
    };

    // Make API call
    api.call(
      input,
      (status, data) => {
        console.log(data);
        switch (status) {
          case 200:
            console.log("Successful login.");
            dispatch(setToken(data.token));
            navigate("/dashboard");
            break;
          case 401:
            console.log("Unsuccessful login: " + data.message);
            setFieldError("email", data.message);
            setFieldError("password", data.message);
            navigate("/login");
            break;
          default:
            console.log("Unknown error: " + data.message);
            navigate("/login");
            break;
        }
      },
      (err) => {
        console.log(err.response);
        navigate("/login");
      }
    );
  };

  return (
    <div>
      <StyledFormArea>
        <Link to="/home">
          <Avatar image={Logo} />
        </Link>
        <StyledTitle color={colors.theme} size={30}>
          Login
        </StyledTitle>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            login(values, actions);
          }}
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
              placeholder="**********"
              icon={<FiLock />}
            />
            <ButtonGroup>
              <StyledFormButton type="submit">Login</StyledFormButton>
            </ButtonGroup>
          </Form>
        </Formik>

        <ExtraText>
          New here? <TextLink to="/signup">Sign Up!</TextLink>
        </ExtraText>
      </StyledFormArea>

      <CopyrightText>
        Copyright &copy;2022 RU Late. All rights reserved.
      </CopyrightText>
    </div>
  );
  
};

export default Login;