import { useContext } from "react";
import { ComboBoxPopupContext } from "./";

export const useComboBoxPopupContext = () => {
  const context = useContext(ComboBoxPopupContext);

  if (context === undefined) {
    throw new Error(
      "useComboBoxPopupContext must be used within a ComboBoxPopupContext Provider",
    );
  }

  return context;
};
