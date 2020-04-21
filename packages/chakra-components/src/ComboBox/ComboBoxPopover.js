// import React from "react";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
//   PopoverHeader,
//   PopoverBody,
//   PopoverFooter,
//   PopoverArrow,
//   PopoverCloseButton,
// } from "@chakra-ui/core";
// import { useComboBoxContext } from "./useComboBoxContext";

// const ComboBoxPopover = ({...props}) => {
//   const {
//     isPopoverOpen,
//     setIsPopoverOpen
//   } = useComboBoxContext()
//   return (
//     <Popover isOpen={isPopoverOpen} closeOnBlur closeOnEsc onClose={()=>setIsPopoverOpen(false)}>
//       <PopoverContent zIndex={4}>
//         <PopoverCloseButton />
//         <PopoverHeader>Confirmation!</PopoverHeader>
//         <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
//       </PopoverContent>
//     </Popover>
//   );
// }

// export {ComboBoxPopover};

import React from "react";

import Popper, { PopperArrow } from "@chakra-ui/core/dist/Popper";
import { useComboBoxContext } from "./useComboBoxContext";
import { useMenuListStyle } from "@chakra-ui/core/dist/Menu/styles";

/* =========================================================================
  SubMenuList
  ========================================================================== */

const ComboBoxPopover = ({
  as: Comp = "ul",
  width,
  gutter,
  placement,
  ariaLabel,
  onBlur,
  ...props
}) => {
  const { isPopoverOpen, comboBoxRef, setIsPopoverOpen } = useComboBoxContext();

  const styleProps = useMenuListStyle();

  return (
    <Popper
      usePortal={false}
      as={Comp}
      anchorEl={comboBoxRef.current}
      ref={comboBoxRef}
      isOpen={isPopoverOpen}
      placement={placement}
      width={width}
      rounded="md"
      py={2}
      zIndex="222"
      _focus={{ outline: 0 }}
      role="combobox"
      // aria-label={ariaLabel}
      tabIndex={-1}
      onBlur={() => setIsPopoverOpen(false)}
      {...styleProps}
      {...props}
    />
  );
};

ComboBoxPopover.displayName = "ComboBoxPopover";

/* =========================================================================
  ComboBoxPopoverArrow
  ========================================================================== */

const ComboBoxPopoverArrow = props => <PopperArrow {...props} />;

ComboBoxPopoverArrow.displayName = "ComboBoxPopoverArrow";

export { ComboBoxPopover, ComboBoxPopoverArrow };
