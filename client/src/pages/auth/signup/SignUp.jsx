// common imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// custom imports
import useFormValidation from "../../../common/hooks/useFormValidation";
import useLoader from "../../../common/hooks/useLoader";
import useNotification from "../../../common/hooks/useNotification";
import useUser from "../../../common/hooks/useUser";
import CustomInput from "../../../components/custom-input/CustomInput";
import { initialControl } from "../../../constants/input-constants";
import { signup } from "../../../common/api/auth";

// custom css
import "./SignUp.css";

const SignUp = () => {
  // custom hook mothods
  const { addNotification, handleApiResponseNotification } = useNotification();
  const { setShowLoader } = useLoader();
  const { user } = useUser();
  const { validateForm } = useFormValidation();
  // state hooks
  const [firstName, setFirstName] = useState(initialControl());
  const [lastName, setLastName] = useState(initialControl());
  const [email, setEmail] = useState(initialControl());
  const [password, setPassword] = useState(initialControl());
  const [confirmPassword, setConfirmPassword] = useState(initialControl());
  // other hooks
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const capitalizeFirstLetter = (inputString) => {
    return inputString.length > 0
      ? `${inputString.slice(0, 1).toUpperCase()}${inputString.slice(
          1,
          inputString.length
        )}`
      : "";
  };

  const handleSubmit = async () => {
    const form = {
      firstName: { control: firstName, set: setFirstName },
      lastName: { control: lastName, set: setLastName },
      email: { control: email, set: setEmail },
      password: { control: password, set: setPassword },
      confirmPassword: { control: confirmPassword, set: setConfirmPassword },
    };

    if (!validateForm(form)) return;

    if (confirmPassword.value !== password.value) {
      setConfirmPassword({
        value: confirmPassword.value,
        isValid: false,
        touched: true,
      });
      addNotification(["E01_19"]);
      return;
    }

    try {
      setShowLoader(true, "Signing Up");
      const response = await signup({
        body: {
          firstName: capitalizeFirstLetter(firstName.value),
          lastName: capitalizeFirstLetter(lastName.value),
          email: email.value,
          password: password.value,
        },
      });
      handleApiResponseNotification(response);
      if (response.data.status === "OK") {
        navigate("/signin");
      }
      setShowLoader(false);
    } catch (error) {
      handleApiResponseNotification(error.response);
      setShowLoader(false);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center mt-3">
      <h2>Sign Up</h2>
      <form className="border signup-form-style w-50">
        <div className="row w-100">
          <div className="col-6">
            <CustomInput
              type="text"
              label="First Name"
              control={firstName}
              onChange={setFirstName}
              allowSpecialCharacters={false}
              allowNumeric={false}
              required={true}
            />
          </div>
          <div className="col-6">
            <CustomInput
              type="text"
              label="Last Name"
              control={lastName}
              onChange={setLastName}
              allowSpecialCharacters={false}
              allowNumeric={false}
              required={true}
            />
          </div>
          <div className="col-12">
            <CustomInput
              type="email"
              label="Email"
              control={email}
              onChange={setEmail}
              required={true}
            />
          </div>
          <div className="col-12">
            <CustomInput
              type={"password"}
              label="Password"
              control={password}
              onChange={setPassword}
              required={true}
              maxLength={20}
              minLength={8}
            />
          </div>
          <div className="col-12">
            <CustomInput
              type={"password"}
              label="Confirm Password"
              control={confirmPassword}
              onChange={setConfirmPassword}
              required={true}
              maxLength={20}
              minLength={8}
            />
          </div>
          <div className="col-12 d-flex justify-content-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary w-75 signup-button-style"
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
