import React from 'react'
import { FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi"; // TextInput icons
import { TextInput } from "../../../../components/FormLib";
import {
  ButtonGroup,
  StyledFormButton,
} from "../../../../components/Styles";

//Components to store text box displays and add user buttons
export default function AddUserForm () {
    return (<React.Fragment>
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
            <StyledFormButton type="submit">Add User</StyledFormButton>
            <StyledFormButton type="reset">Reset</StyledFormButton>
          </ButtonGroup>
          </React.Fragment>
    );
};