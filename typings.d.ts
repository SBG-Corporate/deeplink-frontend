import { Palette as MuiPalette } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface NeutralPalette {
    dark: string;
    main: string;
    mediumMain: string;
    medium: string;
    light: string;
  }

  interface Palette extends MuiPalette {
    neutral: NeutralPalette;
  }
}

declare module 'react-dropzone' {
  export interface DropzoneProps {
    acceptedFiles?: string;
  }
}
