const rootOptions = [
  "m",
  "mt",
  "mr",
  "mb",
  "ml",
  "mx",
  "my",
  "margin",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "marginY",
  "marginX",
  "p",
  "pt",
  "pr",
  "pb",
  "pl",
  "px",
  "py",
  "padding",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingY",
  "paddingX",
  "size",
  "color",
  "bg",
  "background",
  "opacity",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "textAlign",
  "fontStyle",
  "textTransform",
  "textDecoration",
  "h",
  "height",
  "verticalAlign",
  "background",
];

const splitProps = props => {
  const ghostProps = {};
  for (const key in props) {
    if (rootOptions.includes(key)) {
      ghostProps[key] = props[key];
    }
  }
  return ghostProps;
};

export default splitProps;
