import React, { forwardRef } from "react";
import { PseudoBox, useFormControl } from "@chakra-ui/core";

const Input = forwardRef((props, ref) => {
  const {
    size,
    variant,
    as,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    isReadOnly,
    isFullWidth,
    isDisabled,
    isInvalid,
    isRequired,
    focusBorderColor,
    errorBorderColor,
    ...rest
  } = props;

  const formControl = useFormControl(props);

  return (
    <PseudoBox
      ref={ref}
      as={as}
      readOnly={formControl.isReadOnly}
      aria-readonly={isReadOnly}
      disabled={formControl.isDisabled}
      aria-label={ariaLabel}
      aria-invalid={formControl.isInvalid}
      required={formControl.isRequired}
      aria-required={formControl.isRequired}
      aria-disabled={formControl.isDisabled}
      aria-describedby={ariaDescribedby}
      {...rest}
    />
  );
});

Input.displayName = "Input";

Input.defaultProps = {
  size: "md",
  as: "input",
  variant: "outline",
  isFullWidth: true,
  focusBorderColor: "blue.500",
  errorBorderColor: "red.500",
};

export const MultiSelect = () => {
  return (
    <>
      <Input />
    </>
  );
};
