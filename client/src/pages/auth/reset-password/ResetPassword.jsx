// common imports
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// custom imports
import useFormValidation from "../../../common/hooks/useFormValidation";
import useLoader from "../../../common/hooks/useLoader";
import useNotification from "../../../common/hooks/useNotification";
import CustomInput from "../../../components/custom-input/CustomInput";
import { initialControl } from "../../../constants/input-constants";
import { resetPassword, verifyResetPassword } from "../../../common/api/auth";

// custom css
import "./ResetPassword.css";

const ResetPassword = () => {
  // custom hook mothods
  const { handleApiResponseNotification, addNotification } = useNotification();
  const { setShowLoader } = useLoader();
  const { validateForm } = useFormValidation();
  // state hooks
  const [password, setPassword] = useState(initialControl());
  const [confirmPassword, setConfirmPassword] = useState(initialControl());
  // other hooks
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = async () => {
    const form = {
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
      setShowLoader(true, "Resetting");
      const response = await resetPassword({
        body: { password: password.value },
        id,
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

  useEffect(() => {
    const func = async () => {
      try {
        setShowLoader(true, "Please Wait");
        const response = await verifyResetPassword({ id });
        if (response.data.status === "OK") {
        } else {
          handleApiResponseNotification(response);
          navigate("/");
        }
        setShowLoader(false);
      } catch (error) {
        handleApiResponseNotification(error.response);
        navigate("/");
        setShowLoader(false);
      }
    };
    func();
  }, []);

  return (
    <div className="container d-flex flex-column align-items-center mt-3">
      <h2>Reset Password</h2>
      <form className="border w-50 reset-password-form-style">
        <div className="row w-100">
          <div className="col-12">
            <CustomInput
              type="password"
              label="New Password"
              control={password}
              onChange={setPassword}
              required={true}
              maxLength={20}
              minLength={8}
            ></CustomInput>
          </div>
          <div className="col-12">
            <CustomInput
              type="password"
              label="Confirm Password"
              control={confirmPassword}
              onChange={setConfirmPassword}
              required={true}
              maxLength={20}
              minLength={8}
            ></CustomInput>
          </div>
          <div className="col-12 d-flex justify-content-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary w-75 signup-button-style"
            >
              Reset Password
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
