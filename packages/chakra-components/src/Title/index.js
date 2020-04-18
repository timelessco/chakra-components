import React, { forwardRef } from "react";
import { Link, Icon } from "@chakra-ui/core";

export const Title = forwardRef(({ children, ...props }, ref) => (
  <Link
    rounded="md"
    px={1}
    py={1}
    _hover={{ bg: "gray.100" }}
    ref={ref}
    {...props}
  >
    {children}
    <Icon ml={0} name="chevron-down" color="gray.500" />
  </Link>
));
