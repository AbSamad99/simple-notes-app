import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "../../common/api/auth";
import useNotification from "./useNotification";
import useUser from "./useUser";

const useRefreshAuthRequest = () => {
  const { handleApiResponseNotification } = useNotification();
  const { setAccessToken, clearAccessToken, clearUser } = useUser();
  const navigate = useNavigate();

  const clearCredentials = () => {
    clearAccessToken();
    clearUser();
    navigate("/");
  };

  const refreshAuthRequest = async (request, params) => {
    try {
      let response = await request({ ...params });
      return response;
    } catch (error) {
      let response = error.response;
      if (
        response &&
        response.data &&
        response.data.messages &&
        response.data.messages.includes("E00_03")
      ) {
        try {
          const refreshResponse = await refreshAccessToken();
          if (refreshResponse.data.status === "OK") {
            let accessToken = refreshResponse.data.data.accessToken;
            setAccessToken(accessToken);
            return request({ ...params, accessToken });
          } else {
            handleApiResponseNotification(response);
            clearCredentials();
          }
        } catch (error) {
          handleApiResponseNotification(response);
          clearCredentials();
        }
      } else {
        return response;
      }
    }
  };

  return { refreshAuthRequest };
};

export default useRefreshAuthRequest;
