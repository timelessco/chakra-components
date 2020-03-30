export const space = [
  'm',
  'mt',
  'mr',
  'mb',
  'ml',
  'mx',
  'my',
  'p',
  'pt',
  'pr',
  'pb',
  'pl',
  'px',
  'py',
];

export const color = ['color', 'bg', 'opacity'];

export const typography = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'fontStyle',
  'textTransform',
  'textDecoration',
];

export const layout = [
  'w',
  'h',
  'minW',
  'maxW',
  'minH',
  'maxH',
  'd',
  'size',
  'verticalAlign',
  'overflow',
  'overflowX',
  'overflowY',
];

export const flex = [
  'alignItems',
  'alignContent',
  'justifyItems',
  'justifyContent',
  'flexWrap',
  'flexDirection',
  'flex',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'justifySelf',
  'alignSelf',
  'order',
];

export const grid = [
  'gridGap',
  'gridRowGap',
  'gridColumnGap',
  'gridColumn',
  'gridRow',
  'gridArea',
  'gridAutoFlow',
  'gridAutoRows',
  'gridAutoColumns',
  'gridTemplateRows',
  'gridTemplateColumns',
  'gridTemplateAreas',
];

export const background = [
  'background',
  'bgImage',
  'bgSize',
  'bgPos,backgroundPosition',
  'bgRepeat,backgroundRepeat',
  'bgAttachment,backgroundAttachment',
];

export const border = [
  'borderStyle',
  'borderColor',
  'borderTop',
  'borderTopWidth',
  'borderTopStyle',
  'borderTopColor',
  'borderRight',
  'borderRightWidth',
  'borderRightStyle',
  'borderRightColor',
  'borderBottom',
  'borderBottomWidth',
  'borderBottomStyle',
  'borderBottomColor',
  'borderLeft',
  'borderLeftWidth',
  'borderLeftStyle',
  'borderLeftColor',
  'borderX',
  'borderY',
];

export const borderRadius = [
  'rounded',
  'roundedTopLeft',
  'roundedTopRight',
  'roundedBottomRight',
  'roundedBottomLeft',
  'roundedTop',
  'roundedRight',
  'roundedBottom',
  'roundedLeft',
];

export const position = [
  'position',
  'zIndex',
  'top',
  'right',
  'bottom',
  'left',
];

export const shadow = ['textShadow', 'boxshadow'];

export const other = [
  'animation',
  'appearance',
  'transform',
  'transformOrigin',
  'visibility',
  'whiteSpace',
  'userSelect',
  'pointerEvents',
  'wordBreak',
  'overflowWrap',
  'textOverflow',
  'boxSizing',
  'cursor',
  'resize',
  'transition',
  'objectFit',
  'objectPosition',
  'objectPosition',
  'fill',
  'stroke',
  'outline',
  'as',
];

export default [
  ...space,
  ...color,
  ...typography,
  ...layout,
  ...grid,
  ...flex,
  ...background,
  ...border,
  ...borderRadius,
  ...position,
  ...shadow,
  ...other,
];
