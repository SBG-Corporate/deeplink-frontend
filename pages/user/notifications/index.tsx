import React, { useContext, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { CheckTokenExpiresLayout } from "/app/components/common/CheckTokenExpiresLayout";
import { MainLayout } from "/app/components/layouts";
import { MessagesContext } from "/app/context/messages";
import { LastPage } from "@mui/icons-material";
import { IMessageParsedWithSeen } from "/app/interfaces";
import { MyPalette } from "/app/themes/types";
import PopupShowText from "/app/components/general/PopupShowText";
import { messageInit } from "/app/config/constants";
import { apiCall } from "/app/utils/api/apiUtils";


const NotificationPage = () => {
  const themeMode = useSelector((state: any) => state.persisted?.themeMode);
  const token = useSelector((state: any) => state.persisted?.token);
  const { messagesNotificationWithSeen, toggleUpdateMessages } = useContext(MessagesContext);
  const { palette } = useTheme<MyPalette>();
  const paper = palette.background.paper;
  const light = palette.background.lightDark;

  const [openPopupShowText, setOpenPopupShowText] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<IMessageParsedWithSeen>({ ...messageInit, isSeen: false });

  const onClickNotification = async (notification: IMessageParsedWithSeen) => {
    if (!notification.isSeen) {
      const { status, data } = await apiCall({ type: "post", url: `/msg/markNotificationAsView/${notification._id}`, token });
      if (status === 200) {
        toggleUpdateMessages()
        setSelectedNotification(data)
      }
    }
    setSelectedNotification(notification)
    setOpenPopupShowText(true)
  };

  return (
    <MainLayout
      title={'DeepLink user notifications'}
      pageDescription={'DeepLink user notifications page'}
    >
      <CheckTokenExpiresLayout />
      <Box
        width={"calc(100vw - 100px)"}
        marginLeft={"100px"}
      >
        <Box display={"flex"}>
          <Typography
            margin={"0 0 30px 50px"}
            fontFamily={"Montserrat"}
            fontWeight={"600"}
            fontSize={"50px"}
            color={themeMode === "light" ? "#dedede" : "#202223"}
            sx={{ zIndex: "90" }}
          >
            Notifications
            <LastPage sx={{ marginLeft: "0px", fontSize: "40px" }} />
          </Typography>
        </Box>
        <Box
          display={"flex"}
          width={"100%"}
          height={"100%"}
          sx={{
            borderRadius: "0 0 0.75rem 0.75rem",
            backgroundColor: palette.background.paper,
          }}
        >
          <Box
            m="-30px 50px 50px 100px"
            padding={"20px"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"start"}
            alignItems={"start"}
            maxWidth={"1000px"}
            height={"100%"}
            sx={{
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "30px",
            }}
          >
            {messagesNotificationWithSeen.map((notification) => {
              return (
                <Box
                  key={notification._id}
                  width={"100%"}
                  padding={"10px 20px"}
                  margin={"10px 0"}
                  onClick={() => onClickNotification(notification)}
                  sx={{
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",
                    bgcolor: notification.isSeen ? paper : light,
                    ":hover": {
                      cursor: "pointer",
                      opacity: 0.7,
                    }
                  }}
                >
                  <Typography >
                    <span style={{ fontWeight: 600 }}>{notification.subject}</span> &nbsp;
                    {notification.msg.slice(0, 135 - notification.subject.length)}{(notification.subject.length + notification.msg.length) > 138 && "..."}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </Box>
        <PopupShowText
          openPopupShowText={openPopupShowText}
          handlePopupShowTextClose={() => setOpenPopupShowText(false)}
          title={selectedNotification.subject}
          text={selectedNotification.msg}
        />
      </Box>
    </MainLayout>
  );
};

export default NotificationPage;
