/** @jsx jsx */
import { jsx } from "@emotion/core";
import { forwardRef, cloneElement, useRef, createContext } from "react";
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
import useSelect from "./useSelect";
// import matchSorter from "match-sorter";
import { FixedSizeList } from "react-window";
import { useComboBoxContext } from "./useComboBoxContext";

import { inputSizes } from "@chakra-ui/core/dist/Input/styles";

export const ComboBoxContext = createContext();

const ComboBox = forwardRef(
  (
    {
      value,
      options,
      onChange,
      pageSize = 10,
      itemHeight = 40,
      children,
      size = "md",
      ...props
    },
    ref,
  ) => {
    const { sizes } = useTheme();
    const height = inputSizes[size] && inputSizes[size]["height"];
    let pl = null;
    let pr = null;
    let right = null;
    const validChildren = cleanChildren(children);

    const reactWindowInstanceRef = useRef();
    const optionsRef = useRef();

    const scrollToIndex = index => {
      if (!reactWindowInstanceRef.current) {
        return;
      }
      reactWindowInstanceRef.current.scrollToItem(index);
    };

    const shiftAmount = pageSize;

    const {
      visibleOptions,
      selectedOption,
      highlightedOption,
      getInputProps,
      getOptionProps,
      isOpen,
    } = useSelect({
      options,
      value,
      onChange,
      scrollToIndex,
      optionsRef,
      shiftAmount,
    });

    const Optionsheight =
      Math.max(Math.min(pageSize, visibleOptions.length), 1) * itemHeight;

    const context = {
      visibleOptions,
      selectedOption,
      highlightedOption,
      getInputProps,
      getOptionProps,
      isOpen,
      height: Optionsheight,
      itemHeight,
      optionsRef,
      reactWindowInstanceRef,
    };

    return (
      <ComboBoxContext.Provider value={context}>
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
      </ComboBoxContext.Provider>
    );
  },
);

const ComboBoxInput = forwardRef((props, ref) => {
  const { getInputProps } = useComboBoxContext();

  return (
    <Input ref={ref} cursor="default" {...getInputProps()} {...props}></Input>
  );
});

const ComboBoxList = forwardRef((props, ref) => {
  const {
    optionsRef,
    isOpen,
    reactWindowInstanceRef,
    height,
    visibleOptions,
    itemHeight,
    highlightedOption,
    selectedOption,
    getOptionProps,
  } = useComboBoxContext();

  return (
    <Box
      ref={optionsRef}
      position="absolute"
      top="100%"
      left={0}
      zIndex={1}
      {...props}
    >
      {isOpen && (
        <FixedSizeList
          ref={reactWindowInstanceRef}
          height={height}
          itemCount={visibleOptions.length || 1}
          itemSize={itemHeight}
          css={{ background: "white" }}
        >
          {forwardRef(({ index, style, ...rest }, ref) => {
            const option = visibleOptions[index];
            if (!visibleOptions.length) {
              return (
                <div ref={ref} style={style}>
                  No options were found...
                </div>
              );
            }
            return (
              <div
                {...getOptionProps({
                  index,
                  option,
                  ref,
                  style,
                  highlighted: option === highlightedOption,
                  selected: option === selectedOption,
                })}
              >
                {option.label}
              </div>
            );
          })}
        </FixedSizeList>
      )}
    </Box>
  );
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
  ComboBoxList,
};
