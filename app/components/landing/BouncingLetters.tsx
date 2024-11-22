import { keyframes } from "@emotion/react";
import { Typography, useTheme } from "@mui/material";
import { FC } from "react";
import { MyPalette } from "/app/themes/types";

interface Props {
  letters: string[];
  isBold?: boolean;
}

const BouncingLetters: FC<Props> = ({ letters, isBold = false }) => {
  const { palette } = useTheme<MyPalette>();
  const dark = palette.neutral.dark;

  const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;
  return (

    <Typography
      fontFamily={"Montserrat Alternates"}
      fontWeight={isBold ? "700" : "500"}
      fontSize={"50px"}
      color={dark}
      component="span"
      sx={{ animation: `${fadeIn} 1s ease both` }}
    >
      {letters.map((letter, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.1}s`, display: 'inline-block' }}>{letter}</span>
      ))}
    </Typography>
  )
}

export default BouncingLetters
