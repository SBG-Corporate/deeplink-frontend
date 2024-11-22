import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import { Theme, EmojiStyle } from 'emoji-picker-react';
import toast from 'react-hot-toast';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { Box, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import { IGroup } from '/app/interfaces';
import { answerMessage } from '/app/utils/api/apiMessages';
import { setSelectedChat, setSelectedGroup } from '/app/store/slices/messages/messagesSlice';
import { MyPalette } from '/app/themes/types';
import { apiCall } from '/app/utils/api/apiUtils';

const StyledTextareaAutosize = styled(TextareaAutosize)({
  width: '100%',
  resize: 'none',
  color: 'white',
  borderRadius: '4px',
  padding: '1em',
  fontFamily: 'Roboto',
  fontSize: '15px',
  '&:focus': {
    outline: 'none',
  }
});

type Props = { pageType: "message" | "group" };

export const SendMessage: React.FC<Props> = ({ pageType }) => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state: any) => state.persisted.themeMode);
  const token = useSelector((state: any) => state.persisted.token);
  const { _id: userId } = useSelector((state: any) => state.persisted.user);
  const selectedChat = useSelector((state: any) => state.messagesSlice.selectedChat);
  const selectedGroup: IGroup | null = useSelector((state: any) => state.messagesSlice.selectedGroup);
  const receiver = useSelector((state: any) => state.messagesSlice.receiver);
  const theme = useTheme<MyPalette>();
  const sendMessagesBox = theme.palette.messages.sendMessagesBox;
  const dark = theme.palette.neutral.dark;

  const [chatMessage, setChatMessage] = useState("");
  const [emojiMenuVisible, setEmojiMenuVisible] = useState(false);
  const [boxPosition, setBoxPosition] = useState({ x: 0, y: 0 });

  function isValidMessage(msg: string) {
    let validMessage = true;
    if (msg.trim() === '') validMessage = false;
    return validMessage;
  }

  const handleSubmit = async (message: any) => {
    if (pageType === "group") {
      if (!selectedGroup?.userCanWrite && selectedGroup?.creador !== userId) { toast.error("You cannot write in this group."); return }
      if (chatMessage === "") return
      if (selectedGroup === null) return
      setChatMessage('');
      const body = { message: message.msg }
      const { status, data } = await apiCall({ type: "post", url: `/grupo/${selectedGroup._id}/writeMessage`, token, body });
      console.log('data: ', data);
      if (status === 200) {
        dispatch(setSelectedGroup({ selectedGroup: data }));
      }
    }

    if (pageType === "message") {
      if (chatMessage === "") return
      if (selectedChat === null) return
      setChatMessage('');

      if (isValidMessage(message.msg)) {
        const receiverData = selectedChat.participants.find((participant: any) => participant._id !== userId)
        const { status, data } = await answerMessage({ message: chatMessage, token, lastMessageId: selectedChat.messages[selectedChat.messages.length - 1]._id, receiverId: receiverData._id })
        const newChat = { ...selectedChat, messages: [...selectedChat.messages] }
        let sender, receiver;
        if (userId === selectedChat.participants[0]._id) {
          sender = { _id: selectedChat.participants[0]._id, alias: selectedChat.participants[0].alias, profilePicture: selectedChat.participants[0].profilePicture }
          receiver = { _id: selectedChat.participants[1]._id, alias: selectedChat.participants[1].alias, profilePicture: selectedChat.participants[1].profilePicture }
        } else {
          sender = { _id: selectedChat.participants[1]._id, alias: selectedChat.participants[1].alias, profilePicture: selectedChat.participants[1].profilePicture }
          receiver = { _id: selectedChat.participants[0]._id, alias: selectedChat.participants[0].alias, profilePicture: selectedChat.participants[0].profilePicture }
        }
        const newMessage = {
          _id: "",
          sender,
          receiver,
          message: chatMessage,
          father: selectedChat._id,
          created: Number(new Date()),
          edited: Number(new Date()),
          seen: false
        }
        newChat.messages.push(newMessage)
        dispatch(setSelectedChat({ selectedChat: newChat }));
        if (status !== 200 && status !== 201) { setChatMessage(chatMessage) };
      } else {
        toast.error("You must write something")
      }
    }
  }

  function handleKeyPress(e: any) {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit({
        msg: chatMessage,
      });
    }
  }

  function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.value !== '\n') setChatMessage(e.target.value);
  }

  function handleEmojiClick(emojiData: any, event: any) {
    setChatMessage(chatMessage + emojiData.emoji);
    setEmojiMenuVisible(false);
  }

  const handleMouseClick = (event: any) => {
    setEmojiMenuVisible(!emojiMenuVisible)
    const { clientX, clientY } = event;
    setBoxPosition({ x: clientX, y: clientY });
    setEmojiMenuVisible(!emojiMenuVisible);
  };

  return (
    <React.Fragment>
      <Box
        onClick={() => { if (emojiMenuVisible) setEmojiMenuVisible(false) }}
        sx={{
          position: 'relative',
          padding: '0 0 2em 0',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'end',
          flexBasis: '100%',
          justifyContent: 'center',
          zIndex: 10,
          marginTop: "-50px"
        }}
      >
        <StyledTextareaAutosize
          sx={{
            color: dark,
            background: sendMessagesBox,
            '&::placeholder': {
              color: dark,
              opacity: '0.5',
            },
            '&:-ms-input-placeholder': {
              color: dark,
              opacity: '0.5',
            },
            '&::-ms-input-placeholder': {
              color: dark,
              opacity: '0.5',
            },
          }}
          aria-label="empty textarea"
          placeholder={`Send message to #${pageType === "group" ? selectedGroup && selectedGroup.nombre : receiver !== null && receiver.alias}`}
          value={chatMessage}
          onChange={e => handleOnChange(e)}
          onKeyPress={e => handleKeyPress(e)}
        />

        <SentimentVerySatisfiedIcon
          sx={{
            cursor: 'pointer',
            zIndex: 30,
            position: 'absolute',
            right: '1em',
            bottom: '2em',
          }}
          onClick={(event: any) => handleMouseClick(event)}
        />
      </Box>

      {emojiMenuVisible &&
        <Box
          sx={{
            position: 'fixed',
            bottom: `calc(100vh - ${boxPosition.y}px + 30px) `,
            right: `calc(100vw - ${boxPosition.x}px - 30px)`,
            zIndex: 40,
          }}
        >
          <EmojiPicker
            onEmojiClick={(emojiData: any, event: any) => handleEmojiClick(emojiData, event)}
            theme={themeMode === "dark" ? Theme.DARK : Theme.LIGHT}
            emojiStyle={EmojiStyle.GOOGLE}
          />
        </Box>
      }
    </React.Fragment>
  );
}
