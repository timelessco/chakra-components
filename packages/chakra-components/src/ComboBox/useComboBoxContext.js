import { useContext } from "react";
import { ComboBoxContext } from "./";

export const useComboBoxContext = () => {
  const context = useContext(ComboBoxContext);

  if (context === undefined) {
    throw new Error(
      "useComboBoxContext must be used within a ComboBoxContext Provider",
    );
  }

  return context;
};
