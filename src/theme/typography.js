// ----------------------------------------------------------------------

function pxToRem(value) {
  return `${value / 16}rem`;
}

function responsiveFontSizes({ sm, md, lg }) {
  return {
    "@media (min-width:600px)": {
      fontSize: pxToRem(sm),
    },
    "@media (min-width:900px)": {
      fontSize: pxToRem(md),
    },
    "@media (min-width:1200px)": {
      fontSize: pxToRem(lg),
    },
  };
}

const FONT_PRIMARY = "Inter, sans-serif";

const typography = {
  fontFamily: FONT_PRIMARY,
  fontSize: pxToRem(16),
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontWeight: 500,
    fontSize: pxToRem(50),
    ...responsiveFontSizes({ sm: 50, md: 50, lg: 50 }),
  },
  h2: {
    fontWeight: 700,
    fontSize: pxToRem(38),
    ...responsiveFontSizes({ sm: 38, md: 38, lg: 38 }),
  },
  h3: {
    fontWeight: 400,
    fontSize: pxToRem(28),
    ...responsiveFontSizes({ sm: 28, md: 28, lg: 28 }),
  },
  h4: {
    fontWeight: 400,
    fontSize: pxToRem(21),
    ...responsiveFontSizes({ sm: 21, md: 21, lg: 21 }),
  },
  h5: {
    fontWeight: 500,
    fontSize: pxToRem(12),
    ...responsiveFontSizes({ sm: 12, md: 12, lg: 12 }),
  },
  h6: {
    fontWeight: 500,
    fontSize: pxToRem(12),
    ...responsiveFontSizes({ sm: 12, md: 12, lg: 12 }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  button: {
    fontSize: pxToRem(20),
  },
};

export default typography;
