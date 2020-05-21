import React, { useState } from "react";
import { mount } from 'enzyme';
import { ThemeProvider } from "@chakra-ui/core";
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxPopup,
  ComboBoxClearElement,
  ComboBoxRightElement,
} from "../index.js";
import { Flex, Box, Avatar } from "@chakra-ui/core";

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
          itemHeight={60}
          renderItem={({ option }) => (
            <Flex w="100%" alignItems="center" as="li">
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
describe("Combobox Component Unit Test", function () {
  /**
   * by default input box renders
   */
  it("by default input box renders", () => {
    const wrapper = mount(
      <Combo_Box />,
    );
    const Input = wrapper.find('input');
    expect(Input.props().placeholder).toBe("Select user...");
  });

  /**
   * input focused and all option list renders
   * on selection an option option list close
   */
  it("Input Focus and option list renders", () => {
    const wrapper = mount(
      <Combo_Box />,
    );
    wrapper.find('input').simulate('focus');
    expect(wrapper.find('ul').exists()).toEqual(true);
    expect(wrapper.find('li').exists()).toEqual(true);
    expect(wrapper.find('li')).toHaveLength(5);

    wrapper.find('li').at(0).simulate('click');
    expect(wrapper.find('ul').exists()).toEqual(false);
    expect(wrapper.find('li').exists()).toEqual(false);
  });


  /**
   * input focused and selecting an option
   */
  it("input focus and selectig an option", () => {
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


  /**
   * Combobox clear button click event
   */
  it("Clear button", () => {
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

  /**
   * Disabled option is not selectable
   */
  it("Disabled option is not selectable", () => {
    const wrapper = mount(
      <Combo_Box />,
    );
    // selecting a option
    wrapper.find('input').simulate('focus');
    wrapper.find('li').at(4).simulate('contextmenu');
    expect(wrapper.find('input').prop('value')).toBe("");
  });

  /**
   * keyboard escape event clear input value.
   */
  it("keyboard escape event", () => {
    const wrapper = mount(
      <Combo_Box />,
    );
    // selecting a option
    wrapper.find('input').simulate('focus');
    wrapper.find('input').simulate('change', { target: { value: "Dan" } });
    // escape event
    wrapper.find('input').simulate('keyDown', { key: 'Escape' });
    expect(wrapper.find('input').prop('value')).toBe("");
  });

  /** 
   * keyboard navigation for out of bounds doesn't navigate.
   * For example up arrow on first element 
  */
  it("keyboard navigation pageup and pagedown: bound case", () => {
    const wrapper = mount(
      <Combo_Box />,
    );
    wrapper.find('input').simulate('focus');
    wrapper.find('input').simulate('keyDown', { key: 'ArrowUp' });
    wrapper.find('input').simulate('keyDown', { key: 'Enter' });
    expect(wrapper.find('input').prop('value')).toBe("Dan Abrahmov");
  });

  /**
   * keyboard navigation works correctly to scroll the list
   */
  it("keyboard navigation pageup and pagedown: normal case", () => {
    const wrapper = mount(
      <Combo_Box />,
    );
    wrapper.find('input').simulate('focus');
    wrapper.find('input').simulate('keyDown', { key: 'ArrowDown' });
    wrapper.find('input').simulate('keyDown', { key: 'Enter' });
    expect(wrapper.find('input').prop('value')).toBe("Kola Tioluwani");
  });
})