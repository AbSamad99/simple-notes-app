import { useEffect, useState } from "react";
import "./NotesList.css";
import { getAllNotes } from "../../../common/api/notes";
import useNotification from "../../../common/hooks/useNotification";
import useRefreshAuthRequest from "../../../common/hooks/useRefreshAuthRequest";
import useUser from "../../../common/hooks/useUser";
import useLoader from "../../../common/hooks/useLoader";
import Note from "../../../components/note/Note";
import { useNavigate } from "react-router-dom";

const NotesList = () => {
  const { accessToken } = useUser();
  const { handleApiResponseNotification } = useNotification();
  const { refreshAuthRequest } = useRefreshAuthRequest();
  const { setShowLoader } = useLoader();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);

  const handleNewNote = () => {
    navigate("/notes/create");
  };

  useEffect(() => {
    const func = async () => {
      try {
        setShowLoader(true, "Please wait");
        const response = await refreshAuthRequest(getAllNotes, { accessToken });
        if (response.data.status !== "OK") {
          handleApiResponseNotification(response);
          return;
        }
        setNotes(response.data.data);
        setShowLoader(false);
      } catch (error) {
        handleApiResponseNotification(error.response);
      }
    };
    func().catch(console.error);
  }, []);

  return (
    <div className="notes-container">
      <div className="notes-page-title">
        <h2>Your Notes</h2>
        <button
          onClick={handleNewNote}
          className="btn btn-primary notes-create-button"
        >
          New Note
        </button>
      </div>
      <div className="notes-list">
        {notes && notes.length ? (
          notes.map((note) => (
            <div key={note.id} className="col-4">
              <Note note={note} />
            </div>
          ))
        ) : (
          <span>No notes to speak of</span>
        )}
      </div>
    </div>
  );
};

export default NotesList;
