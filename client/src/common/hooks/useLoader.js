import { useContext } from "react";
import { LoaderContext } from "../providers/LoaderProvider";

const useLoader = () => {
  const { showLoader, loaderText, setShowLoader } = useContext(LoaderContext);
  return { showLoader, loaderText, setShowLoader };
};

export default useLoader;
