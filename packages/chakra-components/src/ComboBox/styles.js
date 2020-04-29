import { useColorMode } from "@chakra-ui/core";

/* =========================================================================
  useComboBoxListStyle
  ========================================================================== */

export const useComboBoxListStyle = () => {
  const { colorMode } = useColorMode();
  const elevation = {
    light: {
      bg: "#fff",
      shadow: "sm",
    },
    dark: {
      bg: "gray.700",
      shadow: `rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px`,
    },
  };

  return {
    color: "inherit",
    borderWidth: "1px",
    ...elevation[colorMode],
  };
};
