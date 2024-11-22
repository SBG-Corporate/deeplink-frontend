import React from "react";
import { Typography, useTheme, Button, Link } from "@mui/material";
import FlexBetween from "app/components/common/FlexBetween";
import WidgetWrapper from "app/components/common/WidgetWrapper";
import { MyPalette } from '/app/themes/types';

const AdvertWidget = () => {
  const { palette } = useTheme<MyPalette>();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Button variant="text">Create add</Button>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src={`${process.env.NEXT_PUBLIC_API_URL_IMAGES}/esports.jpg`}
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>eSports league</Typography>
        <Typography
          color={medium}>
          <Link href="https://www.esports.com/" rel="noreferrer" color="inherit">esports.com</Link>
        </Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        {"eSports, also known as e-Sports, egames, or electronic sports is organized competitive video gaming. It primarily involves teams competing against each other in tournaments for a cash prize. Functionally, it's the same as traditional sports."}
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
