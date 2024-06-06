import React, { useState } from "react";
import SideBarContext from "./SidebarContext";

const SideBarContextProvider = ({ children }) => {
  const [sidebar, setsidebar] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  return (
    <SideBarContext.Provider
      value={{ sidebar, setsidebar, signedIn, setSignedIn }}
    >
      {children}
    </SideBarContext.Provider>
  );
};

export default SideBarContextProvider;
