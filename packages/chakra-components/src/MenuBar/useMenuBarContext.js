import { useContext } from "react";
import { MenuBarContext } from "./menuBar";

export const useMenuBarContext = () => {
  const context = useContext(MenuBarContext);

  if (context === undefined) {
    throw new Error(
      "useMenuBarContext must be used within a MenuBarContext Provider",
    );
  }

  return context;
};
