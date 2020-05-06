import React from "react";
import { renderer, screen } from "@testing-library/react";
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxPopup,
  ComboBoxClearElement,
  ComboBoxRightElement,
} from "@chakra-components/core";

it("first test", () => {
  const fruits = [
    "Acai",
    "Apples",
    "Apricots",
    "Avocado",
    "Ackee",
    "Bananas",
    "Bilberries",
  ];

  const options = fruits.map((d, i) => ({
    value: d,
    label: d,
  }));

  const handleFruitChange = fruit => {
    alert(`Selected: ${fruit}`);
  };
  renderer(
    <ComboBox options={options} onChange={handleFruitChange}>
      <ComboBoxRightElement />
      <ComboBoxClearElement />
      <ComboBoxInput placeholder="Select a fruit..." id="input" />
      <ComboBoxPopup />
    </ComboBox>,
  );
  const upperInput = screen.findByTestId("input");
});
