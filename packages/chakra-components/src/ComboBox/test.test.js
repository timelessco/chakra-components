import expect from "expect";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Text } from "@chakra-ui/core";

describe("Component", () => {
  let node;

  beforeEach(() => {
    node = document.createElement("div");
  });

  afterEach(() => {
    unmountComponentAtNode(node);
  });

  it("displays a welcome message", () => {
    render(<Text>Welcome to React components</Text>, node, () => {
      expect(node.innerHTML).toContain("Welcome to React components");
    });
  });
});
