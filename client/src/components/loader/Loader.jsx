import useLoader from "../../common/hooks/useLoader";
import "./Loader.css";
import { ReactComponent as LoaderSVG } from "../../assets/Loader.svg";

const Loader = ({ children }) => {
  const { showLoader, loaderText } = useLoader();

  return (
    <div>
      {showLoader ? (
        <div className="loader">
          <span className="loading-text">
            <LoaderSVG className="loader-svg" />
            {loaderText && loaderText.length ? loaderText : "Loading..."}
          </span>
        </div>
      ) : (
        <></>
      )}
      {children}
    </div>
  );
};

export default Loader;
