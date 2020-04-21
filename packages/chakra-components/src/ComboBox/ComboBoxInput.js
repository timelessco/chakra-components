import React from "react";
import { Input } from "@chakra-ui/core";
import { useComboBoxContext } from "./useComboBoxContext";

const ComboBoxInput = ({ ...props }) => {
  const { setIsPopoverOpen } = useComboBoxContext();
  return (
    <Input
      placeholder="basic"
      onFocus={() => setIsPopoverOpen(true)}
      onBlur={() => setIsPopoverOpen(false)}
    />
  );
};

export { ComboBoxInput };
