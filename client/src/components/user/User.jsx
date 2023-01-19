import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../common/api/user";
import useLoader from "../../common/hooks/useLoader";
import useNotification from "../../common/hooks/useNotification";
import useRefreshAuthRequest from "../../common/hooks/useRefreshAuthRequest";
import useUser from "../../common/hooks/useUser";
import "./User.css";

const User = ({ user }) => {
  const navigate = useNavigate();
  const { setShowLoader } = useLoader();
  const { refreshAuthRequest } = useRefreshAuthRequest();
  const { accessToken } = useUser();
  const { handleApiResponseNotification } = useNotification();

  const handleEdit = () => {
    navigate(`/users/edit/${user.id}`);
  };

  const handleDelete = async () => {
    try {
      setShowLoader(true, "Deleting");
      const response = await refreshAuthRequest(deleteUser, {
        accessToken,
        id: user.id,
      });
      handleApiResponseNotification(response);
      window.location.reload();
      // setShowLoader(false);
    } catch (error) {
      handleApiResponseNotification(error.response);
      setShowLoader(false);
    }
  };

  return (
    <div className="border note-card">
      <div className="note-title-options">
        <div>
          <span className="note-title-description">Name:</span>{" "}
          <span className="note-title-actual">
            {user.firstName} {user.lastName}
          </span>
        </div>
        <div>
          <span className="note-title-description">Email:</span>{" "}
          <span className="note-title-actual">{user.email}</span>
        </div>
      </div>
      <div className="note-options-div">
        <span onClick={handleEdit} className="note-option">
          Edit
        </span>
        <span onClick={handleDelete} className="note-option">
          Delete
        </span>
      </div>
    </div>
  );
};

export default User;
