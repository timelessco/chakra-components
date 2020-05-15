import React, { useState } from "react";
import {
  render,
  fireEvent,
  cleanup,
  screen,
  waitForElement,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { mount } from 'enzyme';
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxPopup,
  ComboBoxClearElement,
  ComboBoxRightElement,
} from "../index.js";
import { act } from "react-dom/test-utils";
import { unmountComponentAtNode } from "react-dom";
import { Flex, Box, Avatar, Button } from "@chakra-ui/core";

const options = [
  { label: "Dan Abrahmov", img: "https://bit.ly/dan-abramov", value: "1", disabled: false },
  {
    label: "Kola Tioluwani",
    img: "https://bit.ly/tioluwani-kolawole",
    value: "2",
    disabled: false
  },
  { label: "Kent Dodds", img: "https://bit.ly/kent-c-dodds", value: "3", disabled: false },
  { label: "Ryan Florence", img: "https://bit.ly/ryan-florence", value: "4", disabled: false },
  {
    label: "Prosper Otemuyiwa",
    img: "https://bit.ly/prosper-baba",
    value: "5",
    disabled: true
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
  const { getAllByTestId, getByTestId, queryAllByTestId, getByRole } = render(
    <Combo_Box />,
  );
  const inputBox = getByTestId("input");

  // on focus of input box
  inputBox.focus();
  const options = getAllByTestId("option");
  expect(options.map(item => item.nodeName)).toEqual(
    expect.arrayContaining(["LI", "LI", "LI", "LI", "LI"]),
  );
  expect(getByRole("popper").nodeName).toBe("UL");

  // on blur of input box
  fireEvent.click(options[0]);

  // checking the input value if 0th item selected.
  expect(inputBox.value).toBe("Dan Abrahmov");

  expect(queryAllByTestId("option")).toHaveLength(0);
});


// on input fucus and select.
it("combo-box", () => {
  const wrapper = mount(
    <Combo_Box />,
  );

  wrapper.find('input').simulate('focus');
  expect(wrapper.find('li').exists()).toEqual(true);
  expect(wrapper.find('li')).toHaveLength(5);

  wrapper.find('li').at(0).simulate('click');
  expect(wrapper.find('li')).toHaveLength(0); 
  expect(wrapper.find('li').exists()).toEqual(false); 
  expect(wrapper.find('input').prop('value')).toBe("Dan Abrahmov");
});


// combobox clear.
it("combo-box", () => {
  const wrapper = mount(
    <Combo_Box />,
  );

  wrapper.find('input').simulate('focus');
  wrapper.find('input').simulate('change', { target: { value: "Dan" } });
  
  // selecting a option
  expect(wrapper.find('input').prop('value')).toBe("Dan");
  wrapper.find('li').at(0).simulate('click');  

  // clear the selection
  wrapper.find('#clear').at(0).simulate('click');
  expect(wrapper.find('input').prop('value')).toBe("");
});

// disabled state not selectable.
it("combo-box", () => {
  const wrapper = mount(
    <Combo_Box />,
  );

  // selecting a option
  wrapper.find('input').simulate('focus');
  wrapper.find('li').at(4).simulate('contextmenu');  

  expect(wrapper.find('input').prop('value')).toBe("");
});

