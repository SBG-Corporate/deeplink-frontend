import { Typography, useTheme } from "@mui/material";

interface Props {
  onClick: any;
  text: string;
  bold: boolean;
  fontSize?: string;
}

const ButtonTypography: React.FC<Props> = ({ onClick, text, bold, fontSize = "9px" }) => {
  const theme = useTheme();
  const dark = theme.palette.neutral.dark;
  const neutralLight = theme.palette.neutral.light;

  return (
    <Typography
      onClick={onClick}
      color={dark}
      variant="h5"
      fontSize={fontSize}
      fontWeight={bold ? "900" : "500"}
      sx={{
        "&:hover": {
          color: neutralLight,
          cursor: "pointer",
        },
      }}
    >
      {text}
    </Typography>
  )
}

export default ButtonTypography;
