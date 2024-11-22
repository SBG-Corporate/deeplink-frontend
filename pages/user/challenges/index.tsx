import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import LatestChallenges from "app/components/challenges/LatestChallenges";
import SponsoredChallenges from "/app/components/challenges/SponsoredChallenges";
import { LastPage } from "@mui/icons-material";
import { CheckTokenExpiresLayout } from "/app/components/common/CheckTokenExpiresLayout";
import { setPageType } from "/app/store/slices/user/userSlice";
import { MainLayout } from "/app/components/layouts";

const ChallengesPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const themeMode = useSelector((state: any) => state.persisted?.themeMode);

  const [openPopupCreateNovaWallet, setopenPopupCreateNovaWallet] = useState(false);
  const [openPopupCreateThoughtsOnTrezor, setopenPopupCreateThoughtsOnTrezor] = useState(false);

  useEffect(() => {
    dispatch(setPageType({ pageType: "challenges", }));
  }, []);

  return (
    <MainLayout
      title={'Bounties'}
      pageDescription={'DeepLink bounties challenges'}
    >
      <CheckTokenExpiresLayout />
      <Box>
        <Typography
          marginLeft={"160px"}
          fontFamily={"Montserrat"}
          fontWeight={"600"}
          fontSize={"50px"}
          color={themeMode === "light" ? "#dedede" : "#202223"}
          sx={{ position: "relative", zIndex: "1" }}
        >
          Bounties <LastPage sx={{ marginLeft: "-15px", fontSize: "34px" }} />
        </Typography>
      </Box>

      <Box
        margin={"30px 60px"}
        display={"flex"}
        maxWidth={"1600px"}
        height={"100%"}
        sx={{
          borderRadius: "0 0 0.75rem 0.75rem",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box
          m="-30px 50px 50px 100px"
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"start"}
          width={"100%"}
          height={"100%"}
          sx={{
            boxShadow: "3",
            borderRadius: "50px",
          }}
        >
          <LatestChallenges
            openPopupCreateNovaWallet={openPopupCreateNovaWallet}
            setopenPopupCreateNovaWallet={setopenPopupCreateNovaWallet}
            setopenPopupCreateThoughtsOnTrezor={setopenPopupCreateThoughtsOnTrezor}
          />
          <SponsoredChallenges
            openPopupCreateThoughtsOnTrezor={openPopupCreateThoughtsOnTrezor}
            setopenPopupCreateNovaWallet={setopenPopupCreateNovaWallet}
            setopenPopupCreateThoughtsOnTrezor={setopenPopupCreateThoughtsOnTrezor}
            openPopupCreateNovaWallet={openPopupCreateNovaWallet}
          />
        </Box>
      </Box>
    </MainLayout >
  );
};

export default ChallengesPage;
