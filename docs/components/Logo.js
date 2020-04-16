/** @jsx jsx */
import { useColorMode, Box, Link } from "@chakra-ui/core";
import { jsx } from "@emotion/core";
import NextLink from "next/link";

const LogoSvg = props => {
  const { colorMode } = useColorMode();

  return (
    <Box
      as="svg"
      height="8"
      width="auto"
      viewBox="0 0 38 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill={colorMode === "light" ? "#000" : "#fff"}
        fillRule="nonzero"
        d="M30.48.9C28.72-.55 9.07-.02 7.52.9 5.97 1.8-.25 11.82.01 12.84.7 15.7 16.16 29 19 29c2.58 0 18.1-13.05 18.98-16.16.32-1.13-5.76-10.5-7.51-11.94zm-4.5 11.08h-2v-3H20v8h3v2h-8v-2h3v-8h-4v3h-2v-5h14v5z"
      />
    </Box>
  );
};

const Logo = props => (
  <NextLink href="/" passHref>
    <Link
      borderRadius="md"
      display="block"
      aria-label="Chakra components, Back to homepage"
      {...props}
    >
      <LogoSvg />
    </Link>
  </NextLink>
);

export default Logo;
