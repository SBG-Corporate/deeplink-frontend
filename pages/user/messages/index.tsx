import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, useTheme } from '@mui/material';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ChatsLateralBar, ChatArea } from "app/components/messages";
import { setAllChats } from "/app/store/slices/messages/messagesSlice";
import { createAllChatsParsed, createAllMessagesParsed } from "/app/utils/messages/parseChats";
import { LastPage } from "@mui/icons-material";
import { MessagesContext } from "/app/context/messages";
import { User } from "/app/interfaces";
import { setPageType } from "/app/store/slices/user/userSlice";
import { CheckTokenExpiresLayout } from "/app/components/common/CheckTokenExpiresLayout";
import { MainLayout } from "/app/components/layouts";

const MessagesPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const themeMode = useSelector((state: any) => state.persisted?.themeMode);
  const user: User = useSelector((state: any) => state.persisted.user);
  const { isLoadingMessages, messagesDirect, allAlias, allProfilePictures } = useContext(MessagesContext);

  const [isFetchingChats, setIsFetchingChats] = useState(false);

  const createChats = async () => {
    setIsFetchingChats(true)
    const allMessagesParsed = createAllMessagesParsed(messagesDirect, allAlias, allProfilePictures)
    const allChatsParsed = createAllChatsParsed(allMessagesParsed, allAlias, allProfilePictures, user._id)
    dispatch(setAllChats({ allChats: allChatsParsed }));
    setIsFetchingChats(false);
  };

  useEffect(() => {
    if (user.estado === 0) {
      return
    }
    if (isLoadingMessages) return;
    createChats();
  }, [isLoadingMessages])

  useEffect(() => {
    dispatch(setPageType({ pageType: "messages", }));
  }, []);

  return (
    <MainLayout
      title={'DeepLink messages'}
      pageDescription={'DeepLink messages page'}
    >
      <Box sx={{ backgroundColor: theme.palette.background.paper }}>
        <CheckTokenExpiresLayout />
        <Box
          padding={"20px"}
          marginLeft={"100px"}
          marginTop={"40px"}
          display={"flex"}
          flexDirection={"column"}
          height={"calc(100vh - 75px)"}
          width={"calc(100vw - 100px)"}
          sx={{ backgroundColor: theme.palette.background.paper }}
        >
          <Box>
            <Typography
              margin={"-50px 0  0 30px"}
              fontFamily={"Montserrat"}
              fontWeight={"600"}
              fontSize={"50px"}
              color={themeMode === "light" ? "#dedede" : "#202223"}
              sx={{ zIndex: "90" }}
            >
              Messages <LastPage sx={{ marginLeft: "-15px", fontSize: "34px" }} />
            </Typography>
          </Box>
          <Box
            marginLeft={"30px"}
            paddingTop={"20px"}
            display={"flex"}
            width={"100%"}
            maxWidth={"1300px"}
            height={"100%"}
            boxShadow={" 0 0 10px rgba(0, 0, 0, 0.1)"}
            borderRadius={"30px"}
          >
            <ChatsLateralBar
              userId={user._id}
            />
            <ChatArea isFetchingChats={isFetchingChats} />
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default MessagesPage;
