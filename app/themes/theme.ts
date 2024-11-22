type ColorMap = {
  [key: number]: string;
};

export const colorTokens = {
  grey: {
    0: "#FFFFFF",
    10: "#F6F6F6",
    50: "#F0F0F0",
    100: "#E0E0E0",
    200: "#C2C2C2",
    300: "#A3A3A3",
    400: "#858585",
    500: "#666666",
    600: "#4D4D4D",
    700: "#333333",
    800: "#1A1A1A",
    900: "#0A0A0A",
    1000: "#000000",
  } as ColorMap,
  primary: {
    50: "#E6FBFF",
    100: "#CCF7FE",
    200: "#99EEFD",
    300: "#66E6FC",
    400: "#33DDFB",
    500: "#00D5FA",
    600: "#00A0BC",
    700: "#006B7D",
    800: "#00353F",
    900: "#001519",
  } as ColorMap,

  purple: {
    light: "#7f7faa",
    mediumLight: "#666699",
    medium: "#53596f",
    mediumDark: "rgb(255 255 255 / 0.45)",
    dark: "#333366",
    ultraDark: "#20293a",
    ultraUltraDark: "rgb(0 0 0 / 0.4)"
  },
  chart: {
    green: "#65B167"
  },
  connectButton: {
    backgroundDark: "#53596f",
    hooverBackgroundDark: "#787c96",
    colorDark: "#ffffff",
    borderDark: "#53596f",
    backgroundLight: "#ffffff",
    hooverBackgroundLight: "#C2C2C2",
    colorLight: "#000000",
    borderLight: "#f6f6ff",
  },
  navbar: {
    textColorDark: "#ffffff",
    backgroundDark: "#2d3648",
    menuIconDark: "#5c637a",
    connectButtonDark: "#5c637a",
    textColorLight: "#20293a",
    backgroundLight: "#f8f8ff",
    menuIconLight: "#677a9c",
    connectButtonLight: "#20293a",
  },
  widgets: {
    backgroundDark: "#787c96",
    colorTittleDark: "#202229",
    colorMainDark: "#061428",
    colorSecondaryDark: "#3f485f",
    colorBalanceDark: "#253046",
    borderDark: "#53596f",
    textFIeldDark: "#707692",
    lightBlueDark: "#000033",

    backgroundLight: "#efefff",
    colorTittleLight: "#404045",
    colorMainLight: "#354e77",
    colorSecondaryLight: "#919ebb",
    colorBalanceLight: "#677a9c",
    textFIeldLight: "#d8dbee",
    borderLight: "#f6f6ff",
    lightBlueLight: "#f0fffc",
  }
};

export const themeSettings = (mode: 'light' | 'dark') => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
          primary: {
            dark: colorTokens.grey[200],
            main: colorTokens.grey[200],
            light: colorTokens.grey[800],
          },
          neutral: {
            dark: colorTokens.grey[0],
            main: colorTokens.grey[200],
            mediumMain: colorTokens.grey[600],
            medium: colorTokens.grey[400],
            light: colorTokens.grey[700],
          },
          greyscale: {
            dark: colorTokens.grey[100],
            main: colorTokens.grey[200],
            mediumMain: colorTokens.grey[300],
            medium: colorTokens.grey[400],
            light: colorTokens.grey[700],
            ultraLight: colorTokens.grey[900],
          },
          background: {
            default: colorTokens.grey[900],
            paper: colorTokens.grey[800],
            lightDark: colorTokens.grey[800],
          },
          backgroundStaking: {
            default: colorTokens.purple.ultraDark, //#20293a
            alt: colorTokens.grey[800], //#1A1A1A
          },
          connectButton: {
            background: colorTokens.connectButton.backgroundDark,
            color: colorTokens.connectButton.colorDark,
            hooverBackground: colorTokens.connectButton.hooverBackgroundDark,
            border: colorTokens.connectButton.borderDark,
          },
          widgets: {
            background: colorTokens.widgets.backgroundDark,
            colorTittle: colorTokens.widgets.colorTittleDark,
            colorMain: colorTokens.widgets.colorMainDark,
            colorSecondary: colorTokens.widgets.colorSecondaryDark,
            colorBalance: colorTokens.widgets.colorBalanceDark,
            border: colorTokens.widgets.borderDark,
            textFIeld: colorTokens.widgets.textFIeldDark,
            lightBlue: colorTokens.widgets.lightBlueDark,
          },
          navbar: {
            background: colorTokens.navbar.backgroundDark,
            menuIcon: colorTokens.navbar.menuIconDark,
            connectButton: colorTokens.navbar.connectButtonDark,
            textColor: colorTokens.navbar.textColorDark,
          },
          messages: {
            sendMessagesBox: colorTokens.grey[700],
          },
          others: {
            green: "#004d00",
          },
        }
        : {
          primary: {
            dark: colorTokens.grey[800],
            main: colorTokens.grey[1000],
            light: colorTokens.grey[800],
          },
          neutral: {
            dark: colorTokens.grey[1000],
            main: colorTokens.grey[500],
            mediumMain: colorTokens.grey[400],
            medium: colorTokens.grey[500],
            light: colorTokens.grey[300],
          },
          greyscale: {
            dark: colorTokens.grey[700],
            main: colorTokens.grey[500],
            mediumMain: colorTokens.grey[400],
            medium: colorTokens.grey[500],
            light: colorTokens.grey[300],
            ultraLight: colorTokens.grey[50],
          },
          background: {
            default: colorTokens.grey[0],
            paper: colorTokens.grey[0],
            lightDark: colorTokens.grey[200],
          },
          backgroundStaking: {
            default: colorTokens.grey[0], //#FFFFFF
            alt: colorTokens.grey[0], //#FFFFFF
          },
          connectButton: {
            background: colorTokens.connectButton.backgroundLight,
            color: colorTokens.connectButton.colorLight,
            hooverBackground: colorTokens.connectButton.hooverBackgroundLight,
            border: colorTokens.connectButton.borderLight,
          },
          widgets: {
            background: colorTokens.widgets.backgroundLight,
            colorTittle: colorTokens.widgets.colorTittleLight,
            colorMain: colorTokens.widgets.colorMainLight,
            colorSecondary: colorTokens.widgets.colorSecondaryLight,
            colorBalance: colorTokens.widgets.colorBalanceLight,
            border: colorTokens.widgets.borderLight,
            textFIeld: colorTokens.widgets.textFIeldLight,
            lightBlue: colorTokens.widgets.lightBlueLight,
          },
          navbar: {
            background: colorTokens.navbar.backgroundLight,
            menuIcon: colorTokens.navbar.menuIconLight,
            connectButton: colorTokens.navbar.connectButtonLight,
            textColor: colorTokens.navbar.textColorLight,
          },
          messages: {
            sendMessagesBox: colorTokens.grey[10],
          },
          others: {
            green: "#D9ECD9",
          },
        }),
    },
    typography: {
      fontFamily: ["Rubik", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  }
};
