import { useNavigate } from "react-router-dom";
import { deleteNote } from "../../common/api/notes";
import useLoader from "../../common/hooks/useLoader";
import useNotification from "../../common/hooks/useNotification";
import useRefreshAuthRequest from "../../common/hooks/useRefreshAuthRequest";
import useUser from "../../common/hooks/useUser";
import "./Note.css";

const Note = ({ note }) => {
  const navigate = useNavigate();
  const { setShowLoader } = useLoader();
  const { refreshAuthRequest } = useRefreshAuthRequest();
  const { accessToken } = useUser();
  const { handleApiResponseNotification } = useNotification();

  const handleEdit = () => {
    navigate(`/notes/edit/${note.id}`);
  };

  const handleDelete = async () => {
    try {
      setShowLoader(true, "Deleting");
      const response = await refreshAuthRequest(deleteNote, {
        accessToken,
        id: note.id,
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
        <span className="note-title-description">Title:</span>
        <span className="note-title-actual">{note.title}</span>
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

export default Note;
