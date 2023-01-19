// common imports
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// custom imports
import useLoader from "../../../common/hooks/useLoader";
import useNotification from "../../../common/hooks/useNotification";
import useUser from "../../../common/hooks/useUser";
import { signout } from "../../../common/api/auth";

// custom css

const SignOut = () => {
  // custom hook mothods
  const { handleApiResponseNotification } = useNotification();
  const { setShowLoader } = useLoader();
  const { clearUser, clearAccessToken } = useUser();
  // other hooks
  const navigate = useNavigate();

  useEffect(() => {
    const func = async () => {
      try {
        setShowLoader(true, "Signing Out");
        const response = await signout();
        handleApiResponseNotification(response);
        if (response.data.status === "OK") {
          clearUser();
          clearAccessToken();
          navigate("/");
        }
        setShowLoader(false);
      } catch (error) {
        handleApiResponseNotification(error.response);
        setShowLoader(false);
        navigate("/");
      }
    };
    func();
  }, []);

  return <div className="container">Signing Out...</div>;
};

export default SignOut;
