import { Box, Grid, useTheme } from "@mui/material";
import FlexBetween from "../common/FlexBetween";
import { MyPalette } from '/app/themes/types';

interface Props {
  title: string;
  description: string;
  onClick: any;
  newsMainImage: string;
}

const SponsoredNewsBox: React.FC<Props> = ({ title, description, onClick, newsMainImage }) => {
  const { palette } = useTheme<MyPalette>();
  const paper = palette.background.paper;

  return (
    <Box
      padding={"20px"}
      borderRadius={"30px"}
      boxShadow=" 0 0 10px rgba(0, 0, 0, 0.1)"
      maxWidth={"400px"}
      onClick={onClick}
      sx={{ backgroundColor: paper }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box display="flex" flexDirection={"column"}>
            <FlexBetween pb="8px">
              <div style={{ display: "flex", justifyContent: "center", fontSize: "14px", fontWeight: "bold", textAlign: "left" }}>
                {title}
              </div>
            </FlexBetween>
            <div style={{ display: "flex", justifyContent: "center", fontSize: "9px", textAlign: "left", paddingBottom: "1rem" }}>
              {description}
            </div>
          </Box>
        </Grid>

        <Grid item xs={6} >
          <Box height={"100%"} display={"flex"} alignItems={"center"}>
            <Box>
              <img src={newsMainImage} width="200px" alt="News image" style={{ borderRadius: "30px" }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SponsoredNewsBox;
