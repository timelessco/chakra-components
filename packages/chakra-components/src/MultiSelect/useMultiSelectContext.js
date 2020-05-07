import { useContext } from "react";
import { MultiSelectContext } from "./";

export const useMultiSelectContext = () => {
  const context = useContext(MultiSelectContext);

  if (context === undefined) {
    throw new Error(
      "useMultiSelectContext must be used within a MultiSelectContext Provider",
    );
  }

  return context;
};
