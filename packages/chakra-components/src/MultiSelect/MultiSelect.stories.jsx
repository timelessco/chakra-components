import React, { useState } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/core";
import { MultiSelect } from "@chakra-components/core";
import { options } from "./options";

export default {
  title: "MultiSelect",
  decorators: [
    story => (
      <Box maxWidth="500px" mx="auto">
        {story()}
      </Box>
    ),
  ],
};

export const SingleSelect = () => {
  const [fruit, setFruit] = useState(null);

  return (
    <MultiSelect
      options={options}
      placement="bottom"
      value={fruit}
      onChange={setFruit}
    />
  );
};

export const MultipleSelect = () => {
  const [fruit, setFruit] = useState(["Acai"]);

  return (
    <MultiSelect
      isMulti
      options={options}
      value={fruit}
      onChange={setFruit}
      placeholder="Select a fruit..."
    />
  );
};

export const ListboxSelect = () => {
  const [fruit, setFruit] = useState(["Apples"]);

  return (
    <MultiSelect
      isListBox
      options={options}
      value={fruit}
      onChange={setFruit}
      placeholder="Select a fruit..."
    />
  );
};

export const AsyncSingleSelect = () => {
  const loadOptions = (inputValue, successCb, errorCb) => {
    axios
      .get(`https://restcountries.eu/rest/v2/name/${inputValue}`)
      .then(response => {
        successCb(
          response.data.map(ep => ({
            label: `${ep.name}`,
            value: `${ep.name}`,
            code: `${ep.alpha2Code}`,
            timeZone: `${ep.timezones[0]}`,
          })),
        );
      })
      .catch(e => {
        errorCb("Remote fetch failed");
      });
  };

  const [country, setCountry] = useState(null);

  return (
    <MultiSelect
      isAsync
      loadOptions={loadOptions}
      defaultOptions
      value={country}
      onChange={setCountry}
      placeholder="Select a country..."
    />
  );
};
