import { useContext } from "react";
import { ComboBoxContext } from "./ComboBox";

export const useComboBoxContext = () => {
  const context = useContext(ComboBoxContext);

  if (context === undefined) {
    throw new Error(
      "useMenuBarContext must be used within a MenuBarContext Provider",
    );
  }

  return context;
};
