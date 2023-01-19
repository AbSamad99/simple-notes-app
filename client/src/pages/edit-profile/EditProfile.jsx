// common imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// custom imports
import useNotification from "../../common/hooks/useNotification";
import useLoader from "../../common/hooks/useLoader";
import useFormValidation from "../../common/hooks/useFormValidation";
import useRefreshAuthRequest from "../../common/hooks/useRefreshAuthRequest";
import useUser from "../../common/hooks/useUser";
import { initialControl } from "../../constants/input-constants";
import CustomInput from "../../components/custom-input/CustomInput";
import { getCurrentUser } from "../../common/api/auth";
import { updateUser } from "../../common/api/user";

// custom css
import "./EditProfile.css";

const EditProfile = () => {
  // custom hook mothods
  const { handleApiResponseNotification } = useNotification();
  const { setShowLoader } = useLoader();
  const { validateForm } = useFormValidation();
  const { refreshAuthRequest } = useRefreshAuthRequest();
  const { accessToken } = useUser();
  // state hooks
  const [firstName, setFirstName] = useState(initialControl());
  const [lastName, setLastName] = useState(initialControl());
  const [email, setEmail] = useState(initialControl());
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
          setFirstName({ ...firstName, value: user.firstName });
          setLastName({ ...lastName, value: user.lastName });
          setEmail({ ...email, value: user.email });
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
      confirmPassword: { control: confirmPassword, set: setConfirmPassword },
    };

    if (!validateForm(form)) return;

    try {
      setShowLoader(true, "Updating Up");
      console.log({ accessToken, id });
      const response = await refreshAuthRequest(updateUser, {
        body: {
          firstName: capitalizeFirstLetter(firstName.value),
          lastName: capitalizeFirstLetter(lastName.value),
          email: email.value,
          password: confirmPassword.value,
        },
        id,
        accessToken,
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

  const editProfileOptions = [
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
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form className="border edit-profile-form-style w-50">
        <div className="row w-100">
          <div className="col-12">
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
          <div className="col-12">
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
              label="Confirm Password"
              control={confirmPassword}
              onChange={setConfirmPassword}
              required={true}
            />
          </div>
          <div className="col-12 d-flex justify-content-center">
            {editProfileOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={opt.handle}
                className="btn btn-primary edit-profile-button-style"
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

export default EditProfile;
