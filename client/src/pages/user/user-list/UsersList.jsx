// common imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// custom imports
import useLoader from "../../../common/hooks/useLoader";
import useNotification from "../../../common/hooks/useNotification";
import useUser from "../../../common/hooks/useUser";
import useRefreshAuthRequest from "../../../common/hooks/useRefreshAuthRequest";
import { getAllUsers } from "../../../common/api/user";
import User from "../../../components/user/User";

const UsersList = () => {
  // custom hook mothods
  const { handleApiResponseNotification } = useNotification();
  const { setShowLoader } = useLoader();
  const { accessToken } = useUser();
  const { refreshAuthRequest } = useRefreshAuthRequest();
  const { user } = useUser();
  // other hooks
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const handleNewUser = () => {
    navigate("/users/create");
  };

  useEffect(() => {
    if (!user || !user.isAdmin) navigate("/");
    const func = async () => {
      try {
        setShowLoader(true, "Please wait");
        const response = await refreshAuthRequest(getAllUsers, { accessToken });
        if (response.data.status !== "OK") {
          handleApiResponseNotification(response);
          return;
        }
        setUsers(response.data.data);
        setShowLoader(false);
      } catch (error) {
        handleApiResponseNotification(error.response);
      }
    };
    func().catch(console.error);
  }, []);

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate("/");
      setShowLoader(false);
    }
  }, [user]);

  return (
    <div className="notes-container">
      <div className="notes-page-title">
        <h2>Users</h2>
        <button
          onClick={handleNewUser}
          className="btn btn-primary notes-create-button"
        >
          New User
        </button>
      </div>
      <div className="notes-list">
        {users && users.length ? (
          users.map((user) => (
            <div key={user.id} className="col-4">
              <User user={user} />
            </div>
          ))
        ) : (
          <span>No Users to speak of</span>
        )}
      </div>
    </div>
  );
};

export default UsersList;
