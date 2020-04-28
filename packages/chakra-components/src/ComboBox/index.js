/** @jsx jsx */
import { jsx } from "@emotion/core";
import { forwardRef, cloneElement } from "react";
import {
  Box,
  Input,
  Icon,
  useTheme,
  InputRightElement,
  InputLeftElement,
  InputLeftAddon,
  InputRightAddon,
} from "@chakra-ui/core";
import { cleanChildren } from "@chakra-ui/core/dist/utils";

import { inputSizes } from "@chakra-ui/core/dist/Input/styles";

const ComboBox = forwardRef(({ children, size = "md", ...props }, ref) => {
  const { sizes } = useTheme();
  const height = inputSizes[size] && inputSizes[size]["height"];
  let pl = null;
  let pr = null;
  let right = null;
  const validChildren = cleanChildren(children);

  return (
    <Box display="flex" position="relative" ref={ref} {...props}>
      {validChildren.map(child => {
        if (child.type === ComboBoxLeftElement) {
          pl = height;
        }

        if (child.type === ComboBoxRightElement) {
          pr = height;
        }

        if (child.type === ComboBoxClearElement) {
          right = sizes[height];
          pr += height;

          return cloneElement(child, { size, right });
        }

        if (child.type === ComboBoxInput) {
          return cloneElement(child, {
            size,
            pl: child.props.pl || pl,
            pr: child.props.pr || pr,
          });
        }
        return cloneElement(child, { size });
      })}
    </Box>
  );
});

const ComboBoxInput = forwardRef((props, ref) => {
  return <Input ref={ref} cursor="default" {...props}></Input>;
});

const ComboBoxRightElement = forwardRef((props, ref) => {
  return (
    <InputRightElement
      ref={ref}
      children={<Icon name="chevron-down" fontSize="1.5rem" />}
      pointerEvents="none"
      {...props}
    />
  );
});

const ComboBoxLeftElement = forwardRef((props, ref) => {
  return <InputLeftElement pointerEvents="none" ref={ref} {...props} />;
});

const ComboBoxLeftAddon = forwardRef((props, ref) => {
  return <InputLeftAddon ref={ref} {...props} />;
});

const ComboBoxRightAddon = forwardRef((props, ref) => {
  return <InputRightAddon ref={ref} {...props} />;
});

const ComboBoxClearElement = forwardRef((props, ref) => {
  return (
    <InputRightElement
      ref={ref}
      children={<Icon name="close" fontSize="12px" />}
      cursor="default"
      pointerEvents="none"
      {...props}
    />
  );
});

export {
  ComboBox,
  ComboBoxInput,
  ComboBoxLeftElement,
  ComboBoxRightElement,
  ComboBoxLeftAddon,
  ComboBoxRightAddon,
  ComboBoxClearElement,
};
