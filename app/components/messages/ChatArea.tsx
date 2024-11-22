import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme, Divider, List, CircularProgress } from "@mui/material";
import { IChat } from "/app/interfaces";
import { MessagesArea } from "./MessagesArea";
import { SendMessage } from "/app/components/messages";
import { setReceiver } from "/app/store/slices/messages/messagesSlice";

type ChatProps = {
  isFetchingChats: boolean;
};

export const ChatArea: React.FC<ChatProps> = ({ isFetchingChats }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { alias } = useSelector((state: any) => state.persisted.user);
  const selectedChat = useSelector((state: any) => state.messagesSlice.selectedChat);
  const receiver = useSelector((state: any) => state.messagesSlice.receiver);
  const allChats: IChat[] = useSelector((state: any) => state.messagesSlice.allChats || []);
  const medium = theme.palette.neutral.medium;

  const getReceiver = async () => {
    if (selectedChat.created === 0) return
    let receiver;
    selectedChat?.participants.map((participant: any) => {
      if (participant.alias !== alias) receiver = participant
    })
    if (receiver !== undefined) {
      dispatch(setReceiver({ receiver: receiver }));
    }
  };

  useEffect(() => {
    getReceiver()
  }, [selectedChat])

  return (
    <Box sx={{
      padding: "10px 20px",
      width: "100%",
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "100px",
    }}>
      {selectedChat.created !== 0 ?
        <>
          <Box>
            <Typography
              fontWeight={"bold"}
              variant={"h1"}
              color={medium}>
              Chat with #{receiver !== null && receiver.alias}
            </Typography>
            <Divider sx={{ padding: "5px" }} />
            <List style={{ overflow: 'auto' }} >
              <MessagesArea />
            </List>
          </Box>
          <SendMessage pageType={"message"} />
        </> : <>
          <Box
            height={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {isFetchingChats ?
              <>
                <CircularProgress size={32} />
                <Typography variant={"h1"} marginLeft={"10px"}>
                  Loading chats...
                </Typography>
              </> :
              <Typography maxWidth={"450px"} textAlign={"center"} variant={"h1"} fontFamily={"Montserrat"} fontWeight={500}>
                {allChats.length === 0 ? "To start create a new chat" : "Please select a chat"}
              </Typography>
            }
          </Box>
        </>
      }
    </Box >
  );
};