import { createContext, useCallback, useEffect, useState } from "react";

// User Context, used throughout the app to get details of the logged in user
export const UserContext = createContext({
  user: null,
  accessToken: null,
  setUser: () => {},
  setAccessToken: () => {},
  clearUser: () => {},
  clearAccessToken: () => {},
});

// UserProvider component, which is basically a wrapper providing the User info
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem("user")) {
      setUser(JSON.parse(sessionStorage.getItem("user")));
    }
    if (sessionStorage.getItem("accessToken")) {
      setAccessToken(sessionStorage.getItem("accessToken"));
    }
  }, []);

  //  Main Context object
  const contextValue = {
    user,
    accessToken,
    setUser: useCallback((user) => {
      setUser(user);
      sessionStorage.setItem("user", JSON.stringify(user));
    }, []),
    setAccessToken: useCallback((accessToken) => {
      setAccessToken(accessToken);
      sessionStorage.setItem("accessToken", accessToken);
    }, []),
    clearUser: useCallback(() => {
      setUser(null);
      sessionStorage.removeItem("user");
    }, []),
    clearAccessToken: useCallback(() => {
      setAccessToken(null);
      sessionStorage.removeItem("accessToken");
    }, []),
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
