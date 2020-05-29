import React from "react";
import {
  Box,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/core";

export default {
  title: "Alert",
};

export const Basic = () => (
  <Alert status="error" variant="solid" borderRadius="md">
    <AlertIcon />
    <AlertTitle mr={2}>Outdated</AlertTitle>
    <AlertDescription>Your Chakra experience may be degraded.</AlertDescription>
  </Alert>
);

export const Subtle = () => (
  <Alert status="success" mx="auto" alignItems="start">
    <AlertIcon />
    <Box flex="1">
      <AlertTitle>Holy Smokes</AlertTitle>
      <AlertDescription>Something just happened!</AlertDescription>
    </Box>
  </Alert>
);

export const LeftAccent = () => (
  <Alert variant="left-accent" mx="auto" alignItems="start">
    <AlertIcon />
    <Box flex="1">
      <AlertTitle>Holy Smokes</AlertTitle>
      <AlertDescription>Something just happened!</AlertDescription>
    </Box>
  </Alert>
);

export const TopAccent = () => (
  <Alert variant="top-accent" mx="auto" alignItems="start">
    <AlertIcon />
    <Box flex="1">
      <AlertTitle>Holy Smokes</AlertTitle>
      <AlertDescription>Something just happened!</AlertDescription>
    </Box>
  </Alert>
);
