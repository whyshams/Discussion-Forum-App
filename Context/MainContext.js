import { createContext, useState } from "react";

const MainContext = createContext();

export const ContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [postUpdated, setPostUpdated] = useState(false);
  const [singlePostData, setSinglePostData] = useState();

  return (
    <MainContext.Provider
      value={{
        loading,
        setLoading,
        postUpdated,
        setPostUpdated,
        singlePostData,
        setSinglePostData,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export default MainContext;
