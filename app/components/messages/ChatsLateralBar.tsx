import React, { useContext } from 'react';
import { Box, useTheme, Grid } from '@mui/material';
import { IChat } from '/app/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { GroupButton, AddChatButton } from "app/components/messages";
import { setSelectedChat } from '/app/store/slices/messages/messagesSlice';
import { MessagesContext } from '/app/context/messages';
import { User } from '/app/interfaces';
import { apiCall } from '/app/utils/api/apiUtils';

type ChatsLateralBarProps = {
  userId: string;
};

export const ChatsLateralBar: React.FC<ChatsLateralBarProps> = ({ userId }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const selectedChat: IChat = useSelector((state: any) => state.messagesSlice.selectedChat || { _id: "", participants: [], messages: [], created: 0 });
  const allChats: IChat[] = useSelector((state: any) => state.messagesSlice.allChats || []);
  const user: User = useSelector((state: any) => state.persisted.user);
  const token = useSelector((state: any) => state.persisted.token);
  const { toggleUpdateMessages, notViewsInMessagesDirect } = useContext(MessagesContext);

  const onClickChat = async (type: string, _id: string) => {
    const chatSelected = allChats.find(chat => chat.friendId === _id);
    if (chatSelected !== undefined) {
      dispatch(setSelectedChat({ selectedChat: chatSelected }));
    }
    const { status, data } = await apiCall({ type: "post", url: `/msg/markDirectAsView/${_id}`, token });
    toggleUpdateMessages()
  };

  return (
    <Box
      sx={{
        padding: "10px",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "0 0 0 0.75rem",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      height={"100%"}
    >
      <Grid container direction="column" alignItems="center">
        {allChats.map((chat, index) => {
          const chatImage = userId === chat.participants[0]._id ? chat.participants[1].profilePicture : chat.participants[0].profilePicture;
          let chatDestinatario = ""
          chat.participants.forEach((participant) => {
            if (participant._id !== user._id) { chatDestinatario = participant._id }
          })
          const notViewedMessages = notViewsInMessagesDirect.filter(userId => userId === chat.friendId).length;

          return (
            <Grid key={"chat-" + index} item paddingBottom={"5px"}>
              <GroupButton
                onClick={() => onClickChat("chat", chat.friendId)}
                imageUrl={chatImage}
                isSelected={selectedChat.friendId === chat.friendId ? true : false}
                notViewedMessages={notViewedMessages}
              />
            </Grid>
          )
        })}
        <Grid p={"10px 0"} item >
          <AddChatButton />
        </Grid>
      </Grid>
    </Box >
  )
};


