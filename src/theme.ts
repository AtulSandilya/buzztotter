import Color from "color";

//  Font Weight, Line Height, and Padding Functions --------------------{{{

/* tslint:disable:no-magic-numbers */
/* tslint:disable:object-literal-sort-keys */
const BASE_FONT_SIZE = 15;
const BASE_LINE_HEIGHT = 1.5;
const BASE_PADDING = 11;

export type SizeName =
  | "extraExtraSmall"
  | "extraSmall"
  | "small"
  | "smallNormal"
  | "normal"
  | "largeNormal"
  | "large"
  | "extraLarge"
  | "extraExtraLarge"
  | "smallHero"
  | "hero";

type SizeNameGroup = { [size in SizeName]: number };

const sizeNames: SizeNameGroup = {
  extraExtraSmall: -3,
  extraSmall: -2,
  small: -1,
  smallNormal: -0.5,
  normal: 0,
  largeNormal: 0.5,
  large: 1,
  extraLarge: 2,
  extraExtraLarge: 3,
  smallHero: 3.5,
  hero: 4,
};

const buildSizes = (
  base,
  growthFactor,
  largeSizeReductionFactor?: number,
): SizeNameGroup => {
  const result = { ...sizeNames };
  Object.keys(result).map(key => {
    const largeSizeReduction = largeSizeReductionFactor && result[key] > 0
      ? largeSizeReductionFactor - result[key] * 0.2
      : 1;
    result[key] =
      base * Math.pow(growthFactor, result[key]) * largeSizeReduction;
  });

  return result;
};

//  End Font Weight, Line Height, and Padding Functions ----------------}}}
//  Font Weight Related ------------------------------------------------{{{

export type FontWeight = "normal" | "bold" | "light" | "thin" | "black";

type FontWeightGroup = {
  [weight in FontWeight]: "300" | "normal" | "bold" | "200" | "900"
};

const fontWeights: FontWeightGroup = {
  thin: "200",
  light: "300",
  normal: "normal",
  bold: "bold",
  black: "900",
};

//  End Font Weight Related --------------------------------------------}}}

type Color = string;

export interface ThemeColors {
  bevPrimary: Color;
  bevSecondary: Color;
  bevActiveSecondary: Color;
  brands: {
    facebook: Color;
  };
  bg: {
    offWhite: Color;
    white: Color;
  };
  success: Color;
  successBg: Color;
  failure: Color;
  failureBg: Color;
  icon: Color;
  text: Color;
  shadow: Color;
  uiTextColor: Color;
  uiIconColor: Color;
  uiBoldTextColor: Color;
  uiLight: Color;
  white: Color;
}

interface Theme {
  borderRadius: number;
  colors: ThemeColors;
  font: {
    condensedFamily: string;
    family: string;
    size: SizeNameGroup;
    lineHeight: SizeNameGroup;
    weight: FontWeightGroup;
    allCapsLetterSpacing: number;
  };
  margin: SizeNameGroup;
  padding: SizeNameGroup;
  notificationIcons: {
    [iconName: string]: string;
  };
}

const theme: Theme = {
  borderRadius: 3,
  colors: {
    // Tealish Green
    bevPrimary: "#8ED0BA",
    // Brown
    bevSecondary: "#8B5E3C",
    // Light Brown
    bevActiveSecondary: "#AC9774",
    bg: {
      white: "#ffffff",
      get offWhite() {
        return Color(this.white).darken(0.05).hex().toString();
      },
    },
    brands: {
      facebook: "#3b5988",
    },
    success: "#4BB543",
    successBg: "#188210",
    failure: "#FF0033",
    failureBg: "#770000",
    shadow: "#000000",
    text: "#222222",
    icon: "#AAAAAA",
    uiTextColor: Color("#555555").mix(Color("blue"), 0.05).hex().toString(),
    get uiIconColor() {
      return Color(this.uiTextColor).lighten(0.7).hex().toString();
    },
    uiBoldTextColor: "#555555",
    uiLight: "#cccccc",
    white: "#ffffff",
  },
  font: {
    condensedFamily: "Roboto",
    family: undefined,
    size: buildSizes(BASE_FONT_SIZE, BASE_LINE_HEIGHT),
    lineHeight: buildSizes(BASE_LINE_HEIGHT, BASE_LINE_HEIGHT, 0.85),
    weight: fontWeights,
    allCapsLetterSpacing: 0.5,
  },
  get margin() {
    // Use the padding as the margin
    return this.padding;
  },
  padding: {
    ...buildSizes(BASE_PADDING, BASE_LINE_HEIGHT),
  },

  notificationIcons: {
    beverage: "ic_local_bar_white_48dp",
    cake: "ic_cake_white_48dp",
  },
};

export default theme;
