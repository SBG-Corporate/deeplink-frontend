import React, { useContext } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostsWidget from "app/components/home/PostsWidget";
import { CheckTokenExpiresLayout } from "/app/components/common/CheckTokenExpiresLayout";
import { LastPage } from "@mui/icons-material";
import { MessagesContext } from "/app/context/messages";
import { setPageType } from "/app/store/slices/user/userSlice";
import { MainLayout } from "/app/components/layouts";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state: any) => state.persisted?.themeMode);
  const { isLoadingMessages } = useContext(MessagesContext);

  useEffect(() => {
    dispatch(setPageType({ pageType: "explore", }));
  }, []);


  return (
    <MainLayout
      title={'DeepLink Explore'}
      pageDescription={'DeepLink explore posts page'}
    >
      <CheckTokenExpiresLayout />
      <Box
        width="calc(100vw - 100px)"
        marginLeft={"80px"}
        marginTop={"40px"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Box
          margin={"40px 0"}
          display={"flex"}
          flexDirection={"column"}
          width={"100%"}
          maxWidth="700px"
          height={"100%"}
          boxShadow={" 0 0 10px rgba(0, 0, 0, 0.1)"}
          borderRadius={"30px"}
        >
          <Box width={"100%"} display={"flex"} justifyContent={"start"}>
            <Typography
              margin={"-75px 0  -40px 10px"}
              // marginTop={"-10px"}
              fontFamily={"Montserrat"}
              fontWeight={"600"}
              fontSize={"50px"}
              color={themeMode === "light" ? "#dedede" : "#202223"}
              sx={{ zIndex: "90" }}
            >
              Explore <LastPage sx={{ marginLeft: "-15px", fontSize: "34px" }} />
            </Typography>
          </Box>
          {isLoadingMessages ? <>
            <Box width={"100%"} padding={"20px"} >
              <Skeleton variant="text" height={30} width="100%" sx={{ marginTop: "35px" }} />
              <Skeleton variant="text" height={60} width="100%" sx={{ marginTop: "-10px" }} />
              <Skeleton variant="rectangular" height={180} sx={{ marginTop: "-5px" }} />
              <Skeleton variant="text" height={30} width="100%" sx={{ marginTop: "35px" }} />
              <Skeleton variant="text" height={60} width="100%" sx={{ marginTop: "-10px" }} />
              <Skeleton variant="rectangular" height={180} sx={{ marginTop: "-5px" }} />
            </Box>
          </> :
            <PostsWidget userId={"all"} />
          }
        </Box>
      </Box>
    </MainLayout>
  );
};

export default ProfilePage;
