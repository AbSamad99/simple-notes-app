// common imports
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// custom imports
import useLoader from "../../common/hooks/useLoader";
import useNotification from "../../common/hooks/useNotification";
import useRefreshAuthRequest from "../../common/hooks/useRefreshAuthRequest";
import useUser from "../../common/hooks/useUser";
import { getCurrentUser } from "../../common/api/auth";

// custom css
import "./Profile.css";

const Profile = () => {
  // custom hook mothods
  const { handleApiResponseNotification } = useNotification();
  const { setShowLoader } = useLoader();
  const { accessToken } = useUser();
  const { refreshAuthRequest } = useRefreshAuthRequest();
  // state hooks
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const func = async () => {
      try {
        setShowLoader(true, "Please wait");
        const response = await refreshAuthRequest(getCurrentUser, {
          accessToken,
        });
        if (response.data.status === "OK") {
          setUser(response.data.data);
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

  const profileOptionButtons = [
    {
      id: "1",
      label: "Edit Profile",
      link: "/profile/edit",
    },
    {
      id: "2",
      label: "Edit Password",
      link: "/profile/edit-password",
    },
  ];

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      {user ? (
        <div className="border profile-details">
          <div className="profile-items">
            <span className="profile-title">First Name: </span>
            <span>{user.firstName}</span>
          </div>
          <div className="profile-items">
            <span className="profile-title">Last Name: </span>
            <span>{user.lastName}</span>
          </div>
          <div className="profile-items">
            <span className="profile-title">Email: </span>
            <span>{user.email}</span>
          </div>
          <div className="profile-options">
            {profileOptionButtons.map((opt) => (
              <button
                key={opt.id}
                className="btn btn-primary profile-options-items"
              >
                <span>
                  <Link className="profile-option-link" to={opt.link}>
                    {opt.label}
                  </Link>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Profile;
