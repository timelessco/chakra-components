import React, { createContext, useRef } from "react";
import { Input } from "@chakra-ui/core";
import { useComboBoxContext } from "./useComboBoxContext";

export const InputContext = createContext();

const ComboBoxInput = ({ ...props }) => {
  const { setIsPopoverOpen, inputRef } = useComboBoxContext();
  return (
    <Input
      ref={inputRef}
      placeholder="basic"
      onFocus={() => setIsPopoverOpen(true)}
      onBlur={() => setIsPopoverOpen(false)}
    />
  );
};

export { ComboBoxInput };
