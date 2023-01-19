import { useContext } from "react";
import { UserContext } from "../providers/UserProvider";

const useUser = () => {
  const {
    user,
    accessToken,
    setUser,
    setAccessToken,
    clearUser,
    clearAccessToken,
  } = useContext(UserContext);
  return {
    user,
    accessToken,
    setUser,
    setAccessToken,
    clearUser,
    clearAccessToken,
  };
};

export default useUser;
