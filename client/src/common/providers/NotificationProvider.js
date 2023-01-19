import { createContext, useCallback, useState } from "react";

// Main notification context object, has a provider and a consumer property
export const NotificationContext = createContext({
  notification: null,
  showNotification: false,
  addNotification: () => {},
  removeNotification: () => {},
  setShowNotification: () => {},
});

// Main Notification provider, we are coupling this with the context as we do not expect it to change much
export default function NotificationProvider({ children }) {
  // As we are using useState hook the below methods will update notification value,
  // which in turn will cause the context value to change, which in turn will re render the child components
  const [notification, setNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const removeNotification = () => {
    setNotification(null);
    setShowNotification(false);
  };

  const addNotification = (message) => {
    let notificationTimeout = sessionStorage.getItem("notificationTimeout");
    if (notificationTimeout) {
      clearTimeout(Number(notificationTimeout));
    }
    notificationTimeout = setTimeout(() => {
      setShowNotification(false);
    }, 5000);
    sessionStorage.setItem("notificationTimeout", notificationTimeout);
    setNotification({ message });
    setShowNotification(true);
  };

  // This is the object/value that is provided to whichever component needs it.
  // Basically, message is what we show on the gui,
  // addNotification is uset to set the message,
  // removeNotification is used to clear the message
  const contextValue = {
    notification,
    showNotification,
    addNotification: useCallback((message) => {
      addNotification(message);
    }, []),
    removeNotification: useCallback(() => {
      removeNotification();
    }, []),
    setShowNotification: useCallback((show) => {
      setShowNotification(show);
    }, []),
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}
