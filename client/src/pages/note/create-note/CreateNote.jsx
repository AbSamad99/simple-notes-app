import { useEffect, useState } from "react";
import "./CreateNote.css";
import { initialControl } from "../../../constants/input-constants";
import useNotification from "../../../common/hooks/useNotification";
import useLoader from "../../../common/hooks/useLoader";
import useRefreshAuthRequest from "../../../common/hooks/useRefreshAuthRequest";
import useFormValidation from "../../../common/hooks/useFormValidation";
import useUser from "../../../common/hooks/useUser";
import { useNavigate, useParams } from "react-router-dom";
import { createNote, getNoteById, updateNote } from "../../../common/api/notes";
import CustomInput from "../../../components/custom-input/CustomInput";

const CreateNote = () => {
  const [title, setTitle] = useState(initialControl());
  const [body, setBody] = useState(initialControl());
  const { handleApiResponseNotification } = useNotification();
  const { setShowLoader } = useLoader();
  const { refreshAuthRequest } = useRefreshAuthRequest();
  const { validateForm } = useFormValidation();
  const { accessToken } = useUser();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const func = async () => {
      if (id) {
        try {
          setShowLoader(true, "Please wait");
          const response = await refreshAuthRequest(getNoteById, {
            id,
            accessToken,
          });
          handleApiResponseNotification(response);
          if (response.data.status === "OK") {
            const note = response.data.data;
            setTitle({ ...title, value: note.title });
            setBody({ ...body, value: note.body });
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

  const handleDiscard = () => {
    navigate("/notes");
  };

  const handleSubmit = async () => {
    const form = {
      title: { control: title, set: setTitle },
      body: { control: body, set: setBody },
    };

    if (!validateForm(form)) return;

    try {
      let requestParams = {
        body: {
          title: title.value,
          body: body.value,
        },
        accessToken,
      };
      let request = createNote;
      if (id) {
        request = updateNote;
        requestParams = { ...requestParams, id };
      }
      setShowLoader(true, "Saving");
      const response = await refreshAuthRequest(request, requestParams);
      handleApiResponseNotification(response);
      if (response.data.status === "OK") {
        navigate("/notes");
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

  const getFilteredOptions = () => {
    return options;
  };

  return (
    <div className="create-note-container">
      <h2>{id ? "Edit Note" : "New Note"}</h2>
      <div className="note-inputs">
        <div className="row note-row">
          <div className="col-12">
            <CustomInput
              type="text"
              label="Title"
              control={title}
              maxLength={30}
              onChange={setTitle}
              labelAsPlaceholder={false}
              required={true}
            />
          </div>
          <div className="col-12 mt-3">
            <CustomInput
              type="textarea"
              label="Body"
              control={body}
              maxLength={500}
              rows={5}
              onChange={setBody}
              labelAsPlaceholder={false}
              required={true}
            />
          </div>
          <div className="col-12 d-flex justify-content-center">
            {getFilteredOptions().map((opt) => (
              <button
                onClick={opt.action}
                className="btn btn-primary create-note-button-style"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;
