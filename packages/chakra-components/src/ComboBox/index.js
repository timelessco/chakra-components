import React, { useRef, useEffect, useState } from "react";
import useSelect from "./useSelect";
import styled from "@emotion/styled";
import matchSorter from "match-sorter";
import { FixedSizeList } from "react-window";

const OptionsWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
`;

const Options = styled(FixedSizeList)`
  border: 1px solid black;
`;

const Option = styled.div`
  background: ${props =>
    props.highlighted ? "lightblue" : props.selected ? "lightgray" : "white"};
  display: flex;
  alignitems: center;
  padding: 0.5rem;
`;

const MySelect = ({
  value,
  options,
  onChange,
  multi,
  pageSize = 10,
  itemHeight = 40,
}) => {
  const reactWindowInstanceRef = useRef();
  const optionsRef = useRef();

  const scrollToIndex = (index, position) => {
    if (!reactWindowInstanceRef.current) {
      return;
    }
    reactWindowInstanceRef.current.scrollToItem(index, position);
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
    multi,
    options,
    value,
    onChange,
    scrollToIndex,
    optionsRef,
    shiftAmount,
    filterFn: (options, value) =>
      matchSorter(options, value, { keys: ["label"] }),
  });

  const height =
    Math.max(Math.min(pageSize, visibleOptions.length), 1) * itemHeight;

  const [placeholder, setPlaceholder] = useState(false);

  useEffect(() => {
    if (
      (!isOpen && !selectedOption.value) ||
      (isOpen && !selectedOption.value && !getInputProps().value)
    ) {
      setPlaceholder("Select a value");
    } else {
      setPlaceholder(null);
    }
  }, [isOpen, selectedOption.value, getInputProps().value]);

  console.log("placeholder ", placeholder);
  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
      }}
    >
      {multi ? (
        <div>
          {selectedOption.map(option => (
            <div key={option.value}>
              {option.value}{" "}
              <span
                onClick={() => onChange(value.filter(d => d !== option.value))}
              >
                x
              </span>
            </div>
          ))}
        </div>
      ) : null}
      <input {...getInputProps()} placeholder={placeholder} />
      <span style={{ position: "absolute", left: "0px", top: "0px" }}>
        {selectedOption.value && isOpen && !getInputProps().value
          ? selectedOption.value
          : null}
      </span>
      <OptionsWrapper ref={optionsRef}>
        {isOpen ? (
          <Options
            ref={reactWindowInstanceRef}
            height={height}
            itemCount={visibleOptions.length || 1}
            itemSize={itemHeight}
            width={400}
          >
            {React.forwardRef(({ index, style, ...rest }, ref) => {
              const option = visibleOptions[index];
              if (!visibleOptions.length) {
                return (
                  <Option ref={ref} style={style}>
                    No options were found...
                  </Option>
                );
              }
              return (
                <Option
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
                </Option>
              );
            })}
          </Options>
        ) : null}
      </OptionsWrapper>
    </div>
  );
};

export { MySelect };
