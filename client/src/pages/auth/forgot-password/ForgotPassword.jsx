// common imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// custom imports
import useLoader from "../../../common/hooks/useLoader";
import useNotification from "../../../common/hooks/useNotification";
import CustomInput from "../../../components/custom-input/CustomInput";
import { initialControl } from "../../../constants/input-constants";
import { forgotPassword } from "../../../common/api/auth";

// custom css
import "./ForgotPassword.css";

const ForgotPassword = () => {
  // custom hook mothods
  const { handleApiResponseNotification, addNotification } = useNotification();
  const { setShowLoader } = useLoader();
  // state hooks
  const [email, setEmail] = useState(initialControl());
  // other hooks
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email.isValid) {
      setEmail({ ...email, touched: true });
      addNotification(["E00_05"]);
      return;
    }

    setShowLoader(true, "Please wait");
    try {
      const response = await forgotPassword({
        body: {
          email: email.value,
        },
      });
      handleApiResponseNotification(response);
      if (response.data.status === "OK") {
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
      <h2>Forgot Password</h2>
      <form className="border forgot-password-form-style w-50">
        <div className="row w-100">
          <div className="col-12 mb-3">
            <span>Please enter you email address.</span>
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
          <div className="col-12 d-flex justify-content-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary w-75 forgot-password-button-style"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
