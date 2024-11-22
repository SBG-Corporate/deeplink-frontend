import React from "react";
import { useSelector } from "react-redux";
import { Typography, useTheme, Box, Button } from "@mui/material";
import SponsoredNewsBox from "./SponsoredNewsBox";
import { MyPalette } from '/app/themes/types';

const SponsoredNews = () => {
  const themeMode = useSelector((state: any) => state.persisted?.themeMode);
  const { palette } = useTheme<MyPalette>();
  const dark = palette.neutral.dark;

  return (
    <Box
      padding="70px 0"
      display={"flex"}
      justifyContent={"start"}
      alignItems={"center"}
      flexDirection={"column"}
      rowGap={"20px"}
      sx={{
        borderRadius: "50px 50px 0 50px",
        backgroundColor: themeMode === "light" ? "#f0fffc" : "#000033"
      }}
    >
      <Box width={"100%"} display={"flex"} justifyContent={"center"}>
        <Typography color={dark} variant="h5" fontWeight="500" fontSize={"12px"}>
          Sponsored news
        </Typography>
      </Box >

      <SponsoredNewsBox
        title={"Paris Blockchain Week 2024"}
        description={"The greatest minds meet in person to build the next web. It's where buisness leaders, investors, entreperneurs, developers gather to ideate and drive progress"}
        onClick={() => { }}
        newsMainImage={"https://inatba.org/wp-content/uploads/2023/05/PBW-BANNER.NOY-FOR-SOCIAL-MEDIA.png"}
      />

      <SponsoredNewsBox
        title={"Check out our new platform"}
        description={"MexC is developing a new platform and they need yourr feedback. The best review will recieve 300 BELLS"}
        onClick={() => { }}
        newsMainImage={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrlJvmI-2UpPItG2V-n0xgHyvH-hgC3CqjgA&usqp=CAU"}
      />

      <SponsoredNewsBox
        title={"Analysis Illuvium in depth"}
        description={"Complete the review template and let us know what you think of illuvium's latest update"}
        onClick={() => { }}
        newsMainImage={"https://www.mondespersistants.com/wp-content/uploads/2021/10/Illuvium.jpg"}
      />
    </Box >
  );
};

export default SponsoredNews;
