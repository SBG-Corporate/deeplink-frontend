import { Box, Button, Typography, useTheme } from "@mui/material";
import { keyframes } from "@emotion/react";
import { getIconFromChallenge } from "/app/utils/challenges";
import { MyPalette } from "/app/themes/types";

const blink = keyframes`
  0% {
    border-color: green;
  }
  50% {
    border-color: transparent;
  }
  100% {
    border-color: green;
  }
`;

interface Props {
  isHomeMenu?: boolean;
  title: string;
  description: string;
  buttonText: string;
  onClick: any;
  padding?: string;
  type?: string;
  isChallengeClaimeable: boolean;
  complete?: boolean;
  puntosDeChallengeConseguidos: number;
  puntosDeChallengeNecesarios: number;
  width?: string,
  height?: string | undefined,
}

const ChallengeBox: React.FC<Props> = ({
  isHomeMenu = false,
  title,
  description,
  buttonText,
  onClick,
  padding = "30px 30px 10px 30px",
  type = "likesInPostsGiven",
  complete = false,
  isChallengeClaimeable,
  puntosDeChallengeConseguidos,
  puntosDeChallengeNecesarios,
  width = "300px",
  height = undefined,
}) => {

  const { palette } = useTheme<MyPalette>();
  const paper = palette.background.paper;
  const dark = palette.neutral.dark;

  let backgroundColor, opacity;
  if (complete) {
    backgroundColor = 'neutral.medium'
    opacity = 0.5
  }
  else if (isChallengeClaimeable) {
    backgroundColor = 'others.green'
  }
  else {
    backgroundColor = paper
    opacity = undefined
  }
  const icon = getIconFromChallenge(type)

  return (
    <Box display="flex" justifyContent="flex-end">
      <Box
        width={width}
        height={height}
        p={padding}
        display="grid"
        alignItems="center"
        sx={{
          borderRadius: "50px",
          boxShadow: 3,
          backgroundColor,
          opacity
        }}
      >
        <Box pb="1rem" display={"flex"} alignItems={"center"}>
          {icon}
          <Box sx={{ marginLeft: "5px", display: "flex", justifyContent: "center", fontSize: "16px", fontWeight: "bold", textAlign: "left" }}>
            {title}
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", fontSize: "12px", textAlign: "justify", paddingBottom: "1rem" }}>
          {description}
        </Box>
        <Box display={"flex"} justifyContent={"center"}>
          <Button
            variant="text"
            onClick={onClick}
            disabled={complete}
            sx={{
              boxShadow: "3",
              borderRadius: "50px",
              width: "fit-content",
              padding: "5px 20px",
              color: dark,
              fontWeight: "bold",
              textTransform: 'none',
              border: (!complete && isChallengeClaimeable) ? "solid 3px green" : undefined,
              animation: (!complete && isChallengeClaimeable) ? `${blink} 2s infinite` : 'none',
              '&.Mui-disabled': {
                color: dark,
              }
            }}
          >{complete ? "Claimed" : buttonText}
          </Button>
        </Box>
        <Box
          sx={{
            height: "100%",
            position: 'relative',
            bottom: '0px',
            right: '0px',
            marginLeft: 'auto',
          }}
        >
          <Typography fontFamily={"Montserrat"}>
            {puntosDeChallengeConseguidos}/{puntosDeChallengeNecesarios}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default ChallengeBox;
