const spaceProps = [
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

const colorProps = ['color', 'bg', 'opacity'];

const typographyProps = [
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

const layoutProps = [
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

const flexProps = [
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

const gridProps = [
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

const backgroundProps = [
  'background',
  'bgImage',
  'bgSize',
  'bgPos,backgroundPosition',
  'bgRepeat,backgroundRepeat',
  'bgAttachment,backgroundAttachment',
];

const borderProps = [
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

const borderRadiusProps = [
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

const positionProps = ['position', 'zIndex', 'top', 'right', 'bottom', 'left'];

const shadowProps = ['textShadow', 'boxshadow'];

const otherProps = [
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
  ...spaceProps,
  ...colorProps,
  ...typographyProps,
  ...layoutProps,
  ...gridProps,
  ...flexProps,
  ...backgroundProps,
  ...borderProps,
  ...borderRadiusProps,
  ...positionProps,
  ...shadowProps,
  ...otherProps,
];
