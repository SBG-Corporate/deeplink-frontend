import React from "react";
import { Typography, useTheme, Box, Button } from "@mui/material";
import FlexBetween from "app/components/common/FlexBetween";
import WidgetWrapper from "app/components/common/WidgetWrapper";
import { MyPalette } from '/app/themes/types';

const LatestRewardsWidget = () => {
  const { palette } = useTheme<MyPalette>();
  const dark = palette.neutral.dark;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h4" fontWeight="500">
          Latest rewards
        </Typography>
      </FlexBetween >
      <Box display="flex" justifyContent="space-between" p="1rem" marginBottom="-50px">
        <Box display="flex" justifyContent="flex-end" p="1rem">
          <Box display="grid" alignItems="center" p="1rem">
            <img
              width="80px"
              height="auto"
              alt="advert"
              src={`${process.env.NEXT_PUBLIC_API_URL_IMAGES}/ledger.jpg`}
              style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
            />
            <div style={{ display: "flex", justifyContent: "center", fontSize: "12px", fontWeight: "bold", textAlign: "center" }}>Ledger Nano</div>
            <div style={{ display: "flex", justifyContent: "center", fontSize: "10px", paddingTop: "5px" }}>25 BELLS</div>
            <Button variant="text">Purchase</Button>
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" p="1rem">
          <Box display="grid" alignItems="center" p="1rem">
            <img
              width="100px"
              height="auto"
              alt="advert"
              src={`${process.env.NEXT_PUBLIC_API_URL_IMAGES}/msi.jpg`}
              style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
            />
            <div style={{ display: "flex", justifyContent: "center", fontSize: "12px", fontWeight: "bold", textAlign: "center" }}>MSI Katana</div>
            <div style={{ display: "flex", justifyContent: "center", fontSize: "10px", paddingTop: "5px" }}>755 BELLS</div>
            <Button variant="text">Purchase</Button>
          </Box>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" p="1rem">
        <Box display="flex" justifyContent="flex-end" p="1rem">
          <Box display="grid" alignItems="center" p="1rem">
            <img
              width="80px"
              height="auto"
              alt="advert"
              src={`${process.env.NEXT_PUBLIC_API_URL_IMAGES}/icon-master.png`}
              style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
            />
            <div style={{ display: "flex", justifyContent: "center", fontSize: "12px", fontWeight: "bold", textAlign: "center" }}>Master in blockchain</div>
            <div style={{ display: "flex", justifyContent: "center", fontSize: "10px", paddingTop: "5px" }}>1250 BELLS</div>
            <Button variant="text">Purchase</Button>
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" p="1rem">
          <Box display="grid" alignItems="center" p="1rem">
            <img
              width="100px"
              height="auto"
              alt="advert"
              src={`${process.env.NEXT_PUBLIC_API_URL_IMAGES}/bayc.jpeg`}
              style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
            />
            <div style={{ display: "flex", justifyContent: "center", fontSize: "12px", fontWeight: "bold", textAlign: "center" }}>Bored BELLS club</div>
            <div style={{ display: "flex", justifyContent: "center", fontSize: "10px", paddingTop: "5px" }}>265 BELLS</div>
            <Button variant="text">Purchase</Button>
          </Box>
        </Box>
      </Box>
      <Box display="grid" alignItems="center" p="1rem">
        <Button variant="text">See all</Button>
      </Box>
    </WidgetWrapper>
  );
};

export default LatestRewardsWidget;
