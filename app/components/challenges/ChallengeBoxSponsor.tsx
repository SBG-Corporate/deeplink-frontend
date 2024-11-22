import { Box, Button, useTheme } from "@mui/material";
import FlexBetween from "../common/FlexBetween";
import { MyPalette } from "/app/themes/types";

interface Props {
  title: string;
  description: string;
  buttonText: string;
  onClick: any;
  challengeState?: string;
  icon: any;
  padding?: string;
}

const ChallengeBoxSponsor: React.FC<Props> = ({ title, description, buttonText, onClick, challengeState = "notStarted", icon, padding = "2rem" }) => {
  const { palette } = useTheme<MyPalette>();
  const paper = palette.background.paper;
  const dark = palette.neutral.dark;

  let backgroundColor, opacity;
  if (challengeState === "completed") {
    backgroundColor = 'others.green'
    opacity = 0.5
  }
  else if (challengeState === "finished") {
    backgroundColor = 'neutral.medium'
    opacity = 0.5
  }
  else {
    backgroundColor = paper
    opacity = undefined
  }

  return (
    <Box display="flex" justifyContent="flex-end" width="300px">
      <Box
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
        <FlexBetween pb="1rem">
          {icon}
          <div style={{ display: "flex", justifyContent: "center", fontSize: "16px", fontWeight: "bold", textAlign: "left" }}>
            {title}
          </div>
        </FlexBetween>
        <div style={{ display: "flex", justifyContent: "center", fontSize: "12px", textAlign: "justify", paddingBottom: "1rem" }}>
          {description}
        </div>
        <Box display={"flex"} justifyContent={"center"}>
          <Button
            variant="text"
            onClick={onClick}
            disabled={challengeState !== "notStarted"}
            sx={{
              boxShadow: "3",
              borderRadius: "50px",
              width: "fit-content",
              padding: "5px 20px",
              color: dark,
              fontWeight: "bold",
              textTransform: 'none',
            }}
          >{buttonText}
          </Button>
        </Box>

      </Box>
    </Box>
  );
}

export default ChallengeBoxSponsor;
