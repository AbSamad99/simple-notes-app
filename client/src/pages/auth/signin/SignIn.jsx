// common imports
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// custom imports
import useFormValidation from "../../../common/hooks/useFormValidation";
import useLoader from "../../../common/hooks/useLoader";
import useNotification from "../../../common/hooks/useNotification";
import useUser from "../../../common/hooks/useUser";
import CustomInput from "../../../components/custom-input/CustomInput";
import { initialControl } from "../../../constants/input-constants";
import { signin } from "../../../common/api/auth";

// custom css
import "./SignIn.css";

const SignIn = () => {
  // custom hook mothods
  const { handleApiResponseNotification } = useNotification();
  const { setShowLoader } = useLoader();
  const { user, setUser, setAccessToken } = useUser();
  const { validateForm } = useFormValidation();
  // state hooks
  const [email, setEmail] = useState(initialControl());
  const [password, setPassword] = useState(initialControl());
  // other hooks
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const handleSubmit = async () => {
    const form = {
      email: { control: email, set: setEmail },
      password: { control: password, set: setPassword },
    };

    if (!validateForm(form)) return;

    try {
      setShowLoader(true, "Signing In");
      const response = await signin({
        body: {
          email: email.value,
          password: password.value,
        },
      });
      handleApiResponseNotification(response);
      if (response.data.status === "OK") {
        const data = response.data.data;
        setAccessToken(data.accessToken);
        setUser(data.user);
        navigate("/");
      }
      setShowLoader(false);
    } catch (error) {
      handleApiResponseNotification(error.response);
      setShowLoader(false);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center mt-3">
      <h2>Welcome Back!</h2>
      <form className="border signin-form-style w-50">
        <div className="row w-100">
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
              type="password"
              label="Password"
              control={password}
              onChange={setPassword}
              required={true}
            />
          </div>
          <div className="col-12 d-flex justify-content-start align-items-start mb-3">
            <span className="forgot-password">
              <Link to={"/forgot-password"}>Forgot password</Link>
            </span>
          </div>
          <div className="col-12 d-flex justify-content-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary w-75 signin-button-style"
            >
              Sign In
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
