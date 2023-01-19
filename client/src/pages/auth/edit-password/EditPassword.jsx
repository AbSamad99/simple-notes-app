// common imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// custom imports
import useFormValidation from "../../../common/hooks/useFormValidation";
import useLoader from "../../../common/hooks/useLoader";
import useNotification from "../../../common/hooks/useNotification";
import useRefreshAuthRequest from "../../../common/hooks/useRefreshAuthRequest";
import useUser from "../../../common/hooks/useUser";
import CustomInput from "../../../components/custom-input/CustomInput";
import { initialControl } from "../../../constants/input-constants";
import { getCurrentUser } from "../../../common/api/auth";
import { updateUserPassword } from "../../../common/api/user";

// custom css
import "./EditPassword.css";

const EditPassword = () => {
  // custom hook mothods
  const { handleApiResponseNotification, addNotification } = useNotification();
  const { setShowLoader } = useLoader();
  const { accessToken } = useUser();
  const { validateForm } = useFormValidation();
  const { refreshAuthRequest } = useRefreshAuthRequest();
  // state hooks
  const [currentPassword, setCurrentPassword] = useState(initialControl);
  const [password, setPassword] = useState(initialControl());
  const [confirmPassword, setConfirmPassword] = useState(initialControl());
  const [id, setId] = useState("");
  // other hooks
  const navigate = useNavigate();

  useEffect(() => {
    const func = async () => {
      try {
        setShowLoader(true, "Please wait");
        const response = await refreshAuthRequest(getCurrentUser, {
          accessToken,
        });
        if (response.data.status === "OK") {
          const user = response.data.data;
          setId(user.id);
          setShowLoader(false);
        } else {
          handleApiResponseNotification(response);
          return;
        }
      } catch (error) {
        handleApiResponseNotification(error.response);
      }
    };
    func();
  }, []);

  const handleSubmit = async () => {
    const form = {
      currentPassword: { control: currentPassword, set: setCurrentPassword },
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
      const response = await refreshAuthRequest(updateUserPassword, {
        body: {
          currentPassword: currentPassword.value,
          newPassword: password.value,
        },
        accessToken,
        id,
      });
      handleApiResponseNotification(response);
      if (response.data.status === "OK") {
        navigate("/profile");
      }
      setShowLoader(false);
    } catch (error) {
      handleApiResponseNotification(error.response);
      setShowLoader(false);
    }
  };

  const handleDiscard = () => {
    navigate("/profile");
  };

  const editPasswordOptions = [
    {
      id: "1",
      label: "Discard",
      handle: handleDiscard,
    },
    {
      id: "2",
      label: "Update",
      handle: handleSubmit,
    },
  ];

  return (
    <div className="edit-password-container">
      <h2>Edit Password</h2>
      <form className="border w-50 edit-password-form-style">
        <div className="row w-100">
          <div className="col-12">
            <CustomInput
              type="password"
              label="Current Password"
              control={currentPassword}
              onChange={setCurrentPassword}
              required={true}
            ></CustomInput>
          </div>
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
            {editPasswordOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={opt.handle}
                className="btn btn-primary edit-password-button-style"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPassword;
