import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Confetti from "react-confetti";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { LastPage } from "@mui/icons-material";
import { Box, Grid, useMediaQuery, Typography, useTheme, IconButton } from '@mui/material';
import ChatPopup from "app/components/chatbot/ChatPopup";
import LatestNewsInHome from "/app/components/home/LatestNewsInHome";
import LatestChallengesInHome from "/app/components/home/LatestChallengesInHome";
import FlexBetween from "/app/components/common/FlexBetween";
import { MyPalette } from '/app/themes/types';
import { setPageType } from "/app/store/slices/user/userSlice";
import { MainLayout } from "/app/components/layouts";
import { CheckTokenExpiresLayout } from "/app/components/common/CheckTokenExpiresLayout";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:800px)");
  const isNonMobileScreensMedium = useMediaQuery("(min-width:1000px)");
  const isNonMobileScreensLg = useMediaQuery("(min-width:1200px)");
  const router = useRouter()
  const dispatch = useDispatch();
  const { palette } = useTheme<MyPalette>();
  const dark = palette.neutral.dark;
  const themeMode = useSelector((state: any) => state.persisted?.themeMode) || "dark";

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    dispatch(setPageType({ pageType: "home", }));
  }, []);

  return (
    <MainLayout
      title={'DeepLink Home'}
      pageDescription={'DeepLink home page'}
    >
      <Box>
        <CheckTokenExpiresLayout />
        <ChatPopup />
        {showConfetti && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          >
            <Confetti numberOfPieces={1000} recycle={false} onConfettiComplete={() => setShowConfetti(false)} />
          </Box>
        )}
        <Box
          padding="0 20px  20px 0"
          marginLeft={isNonMobileScreens ? "100px" : undefined}
          justifyContent="space-between"
        >
          <Grid container spacing={3} padding={"0 20px 20px 0"} maxWidth={"1800px"} >
            <Grid item xs={7}>
              <Box
                minWidth={"350px"}
                padding={isNonMobileScreensMedium ? "50px" : "26px"}
                display={"flex"}
                boxShadow={"0 0 10px rgba(0, 0, 0, 0.1)"}
                borderRadius={"0 100px 100px 0"}
                sx={{
                  bgcolor: themeMode === "light" ? "#fbfeff" : "#000033",
                }}
              >
                <Box>
                  <Typography
                    marginBottom={isNonMobileScreensMedium ? "-20px" : "-10px"}
                    fontFamily={"Roboto"}
                    fontWeight={"900"}
                    fontSize={isNonMobileScreensMedium ? "20px" : "14px"}
                    color={dark}
                  >
                    Welcome to
                  </Typography>
                  <Box display={"flex"}>
                    <Typography
                      fontFamily={"Montserrat Alternates"}
                      fontWeight={"700"}
                      fontSize={isNonMobileScreensMedium ? "50px" : "30px"}
                      color={dark}
                    >
                      Deep
                    </Typography>
                    <Typography
                      fontFamily={"Montserrat Alternates"}
                      fontWeight={"500"}
                      fontSize={isNonMobileScreensMedium ? "50px" : "30px"}
                      color={dark}
                    >
                      Link
                      <LastPage sx={{ margin: "0 0 5px 7px", fontSize: "34px" }} />
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4} />
            <Grid item xs={12} marginTop={isNonMobileScreensMedium ? "30px" : "-10px"} />
            <Grid item xs={12} sm={12} md={11} lg={5.5}>
              <Box
                padding={isNonMobileScreens ? "10px 30px 150px 30px" : "10px 15px 150px 15px"}
                borderRadius={"0 20px 20px 0"}
                boxShadow={"0 0 10px rgba(0, 0, 0, 0.1)"}
              >
                <FlexBetween sx={{ margin: "30px", gridColumn: "span  3" }}>
                  <Typography color={dark} variant="h5" fontWeight="500" fontSize={"20px"}>
                    Latest news
                  </Typography>
                  <IconButton onClick={() => router.push("/user/news")}>
                    <ExitToAppIcon />
                  </IconButton>
                </FlexBetween >
                <Box>
                  <LatestNewsInHome />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={11} lg={6.5}>
              <Box
                padding={"10px 30px 100px 30px"}
                borderRadius={isNonMobileScreensLg ? "20px" : "0 20px 20px 0"}
                boxShadow={"0 0 10px rgba(0, 0, 0, 0.1)"}
              >
                <LatestChallengesInHome
                  setShowConfetti={setShowConfetti}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default HomePage;
