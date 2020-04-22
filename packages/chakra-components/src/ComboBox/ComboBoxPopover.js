import React from "react";

import Popper, { PopperArrow } from "@chakra-ui/core/dist/Popper";
import { useComboBoxContext } from "./useComboBoxContext";
import { useMenuListStyle } from "@chakra-ui/core/dist/Menu/styles";

/* =========================================================================
  ComboBoxPopover
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
  const {
    isPopoverOpen,
    comboBoxRef,
    inputRef,
    setIsPopoverOpen,
  } = useComboBoxContext();
  const styleProps = useMenuListStyle();

  return (
    <Popper
      usePortal={false}
      as={Comp}
      anchorEl={comboBoxRef.current}
      ref={inputRef}
      isOpen={true}
      placement={placement}
      width={width}
      rounded="md"
      py={2}
      px={2}
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
