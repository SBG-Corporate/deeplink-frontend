export interface MyPalette {
  palette: {
    mode: "dark" | "light";
    primary: {
      dark: string;
      main: string;
      light: string;
    };
    neutral: {
      dark: string;
      main: string;
      mediumMain: string;
      medium: string;
      light: string;
    };
    greyscale: {
      dark: string;
      main: string;
      mediumMain: string;
      medium: string;
      light: string;
      ultraLight: string;
    };
    background: {
      default: string;
      paper: string;
      lightDark: string;
    };
    backgroundStaking: {
      default: string;
      alt: string;
    };
    connectButton: {
      background: string;
      color: string;
      hooverBackground: string;
      border: string;
    };
    widgets: {
      background: string;
      colorTittle: string;
      colorMain: string;
      colorSecondary: string;
      colorBalance: string;
      border: string;
      textFIeld: string;
    };
    navbar: {
      background: string;
      menuIcon: string;
      connectButton: string;
    };
    messages: {
      sendMessagesBox: string;
    };
    others: {
      green: string;
    };
  },
}