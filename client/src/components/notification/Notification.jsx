import useNotification from "../../common/hooks/useNotification";
import { ApplicationCodes } from "../../constants/application-codes";
import "./Notification.css";

const Notification = () => {
  const { notification, showNotification, setShowNotification } =
    useNotification();

  const getMessage = (code) => {
    return ApplicationCodes[code] ? ApplicationCodes[code] : code;
  };

  return (
    <div
      className={`d-flex flex-column border p-2 notification ${
        showNotification ? "notification-show" : ""
      }`}
    >
      <div className="my-2 mx-auto d-flex flex-column">
        {notification &&
          notification.message &&
          notification.message.length &&
          notification.message.map((m) => (
            <span key={m} className="notification-message">
              {getMessage(m)}
            </span>
          ))}
      </div>
      <button
        className="w-50 align-self-center"
        onClick={() => setShowNotification(false)}
      >
        Close
      </button>
    </div>
  );
};

export default Notification;
