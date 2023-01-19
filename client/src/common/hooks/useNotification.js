import { useContext } from "react";
import { NotificationContext } from "../providers/NotificationProvider";

const useNotification = () => {
  const {
    notification,
    showNotification,
    addNotification,
    removeNotification,
    setShowNotification,
  } = useContext(NotificationContext);

  const handleApiResponseNotification = (response) => {
    if (
      response &&
      response.data &&
      response.data.messages &&
      response.data.messages.length
    ) {
      addNotification(response.data.messages);
    } else if (response.status === 404 || response.status === "FAILURE") {
      addNotification(["E00_01"]);
    }
  };

  return {
    notification,
    showNotification,
    addNotification,
    removeNotification,
    setShowNotification,
    handleApiResponseNotification,
  };
};

export default useNotification;
