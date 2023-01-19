import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verifyEmail } from "../../../common/api/auth";
import useLoader from "../../../common/hooks/useLoader";
import useNotification from "../../../common/hooks/useNotification";

const VerifyEmail = () => {
  const { id } = useParams();
  const { handleApiResponseNotification } = useNotification();
  const { setShowLoader } = useLoader();
  const navigate = useNavigate();

  useEffect(() => {
    const func = async () => {
      try {
        setShowLoader(true, "Verifying email");
        const response = await verifyEmail({ id });
        handleApiResponseNotification(response);
        if (response.data.status === "OK") {
          navigate("/signin");
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

  return <div className="container">Verifying Email...</div>;
};

export default VerifyEmail;
