import { Formik, Form } from "formik";
import * as yup from "yup";
import api from "../../../../utils/api";
import { FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi";
import { TextInput } from "../../../../components/FormLib";
import { ButtonGroup, ExtraText, StyledFormButton } from "../../../../components/Styles";

const EditAccount = ({ loading, setLoading, token, user }) => {

  // Get user information from parent component
  const { userId, email, name, phone } = user

  // Initial form values
  const initialValues = {
    email: email,
    password: "",
    passwordRepeat: "",
    name: name,
    phone: phone
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
    .matches(phoneMatch, "Invalid phone number")
    .nullable();
  const validationSchema = yup.object({
    email: emailValidation,
    password: passwordValidation,
    passwordRepeat: passwordRepeatValidation,
    name: nameValidation,
    phone: phoneValidation
  });

  // User update function
  const updateUser = (values, { setFieldError }) => {
    // Disable fields
    setLoading(true);

    // API call to attempt user update
    const input = {
      url: `${api.url}/users/update`,
      options: {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          authorization: `Bearer ${token}`
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
        switch (status) {
          case 200:
            console.log("Successful update");
            window.location.reload(false)
            break;
          case 400:
          case 409:
            console.log("Unsuccessful update: " + data.message);
            setFieldError("email", data.message);
            window.location.reload(false)
            break;
          default:
            console.log("Unknown error: " + data.message);
            window.location.reload(false)
            break;
        }
        setLoading(false);
      },
      (err) => {
        console.log(err.response);
        window.location.reload(false)
      }
    );
  }

  // "Edit Account" section of "/settings"
  return (
    <div>
      <h1>Edit Account</h1>
      <div className="editAccountContainer">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => updateUser(values, actions)}
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
              <StyledFormButton type="submit" disabled={loading}>Submit</StyledFormButton>
            </ButtonGroup>
            {
              loading ? (
                <ExtraText>Loading...</ExtraText>
              ) : (
                <></>
              )
            }
          </Form>
        </Formik>
      </div>
    </div>
  )
}

export default EditAccount;