import { useContext } from "react";
import { SubMenuContext } from "./SubMenu";

export function useSubMenuContext() {
  const context = useContext(SubMenuContext);

  if (context === undefined) {
    throw new Error(
      "useMenuContext must be used within a MenuContext Provider",
    );
  }

  return context;
}
