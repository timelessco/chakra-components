import React, {
  createContext,
  useState,
  forwardRef,
  useRef,
  useEffect,
} from "react";
import { Flex, PseudoBox } from "@chakra-ui/core";
import { useId } from "@reach/auto-id";

import { getFocusables, useForkRef } from "@chakra-ui/core/dist/utils";
// import { useMenuBarStyle } from "./styles";

const PseudoBoxContainer = forwardRef(({ ...props }, ref) => {
  return <PseudoBox ref={ref} {...props} />;
});

/* =========================================================================
   ComboBoxContext
   ========================================================================== 
*/

export const ComboBoxContext = createContext();

/* =========================================================================
  ComboBox Component
  ========================================================================== */

const ComboBox = forwardRef(
  ({ as: Comp = PseudoBoxContainer, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = useState(-1);

    const comboBoxId = `combobox-${useId()}`;

    const inputRef = useRef(null);
    const comboBoxRef = useRef(null);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const context = {
      inputRef,
      comboBoxRef,
      isPopoverOpen,
      setIsPopoverOpen,
    };

    const comboBoxForkRef = useForkRef(comboBoxRef, ref);

    return (
      <ComboBoxContext.Provider value={context}>
        <Comp ref={comboBoxForkRef} id={comboBoxId} {...props} />
      </ComboBoxContext.Provider>
    );
  },
);

ComboBox.displayName = "ComboBox";

export { ComboBox };
