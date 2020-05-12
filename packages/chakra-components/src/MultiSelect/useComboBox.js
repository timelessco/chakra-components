import { useState, useEffect } from "react";

const defaultFilter = (options, input) => {
  if (input) {
    return options.filter(option =>
      option.label.toLowerCase().includes(input.toLowerCase()),
    );
  } else {
    return options;
  }
};

export const useComboBox = ({ options, initialValues, isMulti, listRef }) => {
  let _initialValues = [];

  if (initialValues) {
    if (typeof initialValues === "string" || initialValues instanceof String) {
      _initialValues = [initialValues];
    } else if (Array.isArray(initialValues)) {
      _initialValues = initialValues;
    }
  }

  const [values, setValues] = useState(_initialValues);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputIsHidden, setInputIsHidden] = useState(false);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [notSelectedOptions, setNotSelectedOptions] = useState(options);
  const [filteredOptions, setFilteredOptions] = useState(notSelectedOptions);

  useEffect(() => {
    setSelectedOptions(
      values.map((value, i) => options.find(option => option.value === value)),
    );
  }, [options, values]);

  useEffect(() => {
    if (isMulti) {
      setNotSelectedOptions(
        options.filter(option => !values.includes(option.value)),
      );
    }
  }, [isMulti, options, values]);

  useEffect(() => {
    setFilteredOptions(defaultFilter(notSelectedOptions, inputValue));
  }, [notSelectedOptions, inputValue]);

  useEffect(() => {
    listRef.current && listRef.current.scrollToItem(focusedOptionIndex);
  }, [isOpen, focusedOptionIndex]);

  useEffect(() => {
    if (!isMulti) {
      const selectedOption = filteredOptions.find(
        option => option.value === values[0],
      );

      const selectedIndex = filteredOptions.indexOf(selectedOption);

      if (selectedIndex !== -1) {
        setFocusedOptionIndex(selectedIndex);
      }
    }
  }, [isMulti, filteredOptions, values]);

  return {
    values,
    setValues,
    isFocused,
    setIsFocused,
    isOpen,
    setIsOpen,
    inputValue,
    setInputValue,
    inputIsHidden,
    setInputIsHidden,
    focusedOptionIndex,
    setFocusedOptionIndex,
    selectedOptions,
    filteredOptions,
    setFilteredOptions,
  };
};
