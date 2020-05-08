import React, { useState } from "react";
import {
  render,
  fireEvent,
  cleanup,
  screen,
  waitForElement,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxPopup,
  ComboBoxClearElement,
  ComboBoxRightElement,
} from "../index.js";

import { Flex, Box, Avatar, Button } from "@chakra-ui/core";

const options = [
  { label: "Dan Abrahmov", img: "https://bit.ly/dan-abramov", value: "1" },
  {
    label: "Kola Tioluwani",
    img: "https://bit.ly/tioluwani-kolawole",
    value: "2",
  },
  { label: "Kent Dodds", img: "https://bit.ly/kent-c-dodds", value: "3" },
  { label: "Ryan Florence", img: "https://bit.ly/ryan-florence", value: "4" },
  {
    label: "Prosper Otemuyiwa",
    img: "https://bit.ly/prosper-baba",
    value: "5",
  },
];

const Combo_Box = () => {
  const [user, setUser] = useState(null);
  return (
    <ThemeProvider>
      <ComboBox
        value={user}
        options={options}
        onChange={setUser}
        data-testid="combobox"
      >
        <ComboBoxRightElement />
        <ComboBoxClearElement />
        <ComboBoxInput
          data-testid="input"
          placeholder="Select user..."
          renderSelectedOption={option => (
            <Flex w="100%" alignItems="center">
              <Avatar name={option.label} src={option.img} size="xs" mr={2} />
              <Box as="h4" fontWeight="bold">
                {option.label}
              </Box>
            </Flex>
          )}
        />
        <ComboBoxPopup
          data-testid="popup"
          itemHeight={60}
          renderItem={({ option }) => (
            <Flex w="100%" alignItems="center" as="li" data-testid="option">
              <Box w="10%">
                <Avatar name={option.label} src={option.img} />
              </Box>
              <Flex w="90%" flexDirection="column" alignItems="left">
                <Box as="h4" fontWeight="bold">
                  {option.label}
                </Box>
              </Flex>
            </Flex>
          )}
        />
      </ComboBox>
      <Button data-testid="button">button</Button>
    </ThemeProvider>
  );
};

afterEach(cleanup);
// input render
it("combo-box", () => {
  const { getByPlaceholderText } = render(<Combo_Box />);
  expect(getByPlaceholderText("Select user...").placeholder).toBe(
    "Select user...",
  );
});

// on input focus
it("combo-box", () => {
  const { getAllByTestId, getByTestId, queryAllByTestId } = render(
    <Combo_Box />,
  );
  const inputBox = getByTestId("input");

  // on focus of input box
  inputBox.focus();
  const options = getAllByTestId("option");
  expect(options.map(item => item.nodeName)).toEqual(
    expect.arrayContaining(["LI", "LI", "LI", "LI", "LI"]),
  );

  // on blur of input box
  fireEvent.click(options[0]);

  // checking the input value if 0th item selected.
  expect(inputBox.value).toBe("Dan Abrahmov");

  expect(queryAllByTestId("option")).toHaveLength(0);
});
