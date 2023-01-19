import { createContext, useCallback, useState } from "react";

export const LoaderContext = createContext({
  showLoader: false,
  loaderText: "",
  setShowLoader: () => {},
});

export default function LoaderProvider({ children }) {
  const [showLoader, setShowLoader] = useState(false);
  const [loaderText, setLoaderText] = useState("");

  const contextValue = {
    showLoader,
    loaderText,
    setShowLoader: useCallback((value, loaderText) => {
      setShowLoader(value);
      setLoaderText(loaderText);
    }, []),
  };

  return (
    <LoaderContext.Provider value={contextValue}>
      {children}
    </LoaderContext.Provider>
  );
}
