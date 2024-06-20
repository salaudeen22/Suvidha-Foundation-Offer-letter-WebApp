import React, { useState } from "react";
import SideBarContext from "./SidebarContext";

const SideBarContextProvider = ({ children }) => {
  const [sidebar, setsidebar] = useState(false);

  return (
    <SideBarContext.Provider value={{ sidebar, setsidebar }}>
      {children}
    </SideBarContext.Provider>
  );
};

export default SideBarContextProvider;
