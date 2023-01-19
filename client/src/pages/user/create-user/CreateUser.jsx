// common imports
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// custom imports
import useFormValidation from "../../../common/hooks/useFormValidation";
import useLoader from "../../../common/hooks/useLoader";
import useNotification from "../../../common/hooks/useNotification";
import useUser from "../../../common/hooks/useUser";
import CustomInput from "../../../components/custom-input/CustomInput";
import { initialControl } from "../../../constants/input-constants";
import useRefreshAuthRequest from "../../../common/hooks/useRefreshAuthRequest";
import { createUser, getUserById, updateUser } from "../../../common/api/user";

// custom css
import "./CreateUser.css";

const CreateUser = () => {
  // custom hook mothods
  const { handleApiResponseNotification } = useNotification();
  const { setShowLoader } = useLoader();
  const { user, accessToken } = useUser();
  const { validateForm } = useFormValidation();
  const { refreshAuthRequest } = useRefreshAuthRequest();
  // state hooks
  const [firstName, setFirstName] = useState(initialControl());
  const [lastName, setLastName] = useState(initialControl());
  const [email, setEmail] = useState(initialControl());
  const [password, setPassword] = useState(initialControl());
  // other hooks
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (user && !user.isAdmin) navigate("/");
  }, [user]);

  useEffect(() => {
    const func = async () => {
      if (id) {
        try {
          setShowLoader(true, "Please wait");
          const response = await refreshAuthRequest(getUserById, {
            id,
            accessToken,
          });
          handleApiResponseNotification(response);
          if (response.data.status === "OK") {
            const user = response.data.data;
            setFirstName({ ...firstName, value: user.firstName });
            setLastName({ ...lastName, value: user.lastName });
            setEmail({ ...email, value: user.email });
          }
          setShowLoader(false);
        } catch (error) {
          handleApiResponseNotification(error.response);
          setShowLoader(false);
        }
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

  const handleDiscard = (event) => {
    event.preventDefault();
    navigate("/users");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = {
      firstName: { control: firstName, set: setFirstName },
      lastName: { control: lastName, set: setLastName },
      email: { control: email, set: setEmail },
      password: { control: password, set: setPassword },
    };

    if (!validateForm(form)) return;

    try {
      setShowLoader(true, "Saving");
      let requestParams = {
        body: {
          firstName: capitalizeFirstLetter(firstName.value),
          lastName: capitalizeFirstLetter(lastName.value),
          email: email.value,
          password: password.value,
        },
        accessToken,
      };
      let request = createUser;
      if (id) {
        request = updateUser;
        requestParams = { ...requestParams, id };
      }

      const response = await refreshAuthRequest(request, requestParams);
      handleApiResponseNotification(response);
      if (response.data.status === "OK") {
        navigate("/users");
      }
      setShowLoader(false);
    } catch (error) {
      handleApiResponseNotification(error.response);
      setShowLoader(false);
    }
  };

  const options = [
    {
      label: "Discard",
      action: handleDiscard,
    },
    {
      label: "Save",
      action: handleSubmit,
    },
  ];

  return (
    <div className="container d-flex flex-column align-items-center mt-3">
      <h2>{id ? "Edit User" : "New User"}</h2>
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
          <div className="col-12 d-flex justify-content-center">
            {options.map((opt) => (
              <button
                onClick={opt.action}
                className="btn btn-primary create-user-button-style"
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

export default CreateUser;
