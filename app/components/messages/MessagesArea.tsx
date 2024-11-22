import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import DomPurify from 'dompurify';
import { useRouter } from 'next/navigation';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Fade,
  CircularProgress,
  useTheme,
  Box,
  Typography
} from '@mui/material';
import { IMessage } from '/app/interfaces';
import { MyPalette } from '/app/themes/types';


type MessagesAreaProps = {};
export const MessagesArea: React.FC<MessagesAreaProps> = () => {
  const router = useRouter();
  const selectedChat = useSelector((state: any) => state.messagesSlice.selectedChat);
  const receiver = useSelector((state: any) => state.messagesSlice.receiver);
  const { palette } = useTheme<MyPalette>();
  const dark = palette.neutral.dark;

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [messageIndex, setMessageIndex] = useState(12);
  const [loadMessages, setLoadMessages] = useState(false);

  let messagesLength = 0;
  if (selectedChat !== null) messagesLength = selectedChat.messages.length;

  const isTextCodeBlock = (message: string) => {
    return message.startsWith('```') && message.endsWith('```');
  };

  const handleScrollTop = (e: any) => {
    const element = e.target;
    if (element.scrollTop > 60) {
      setLoadMessages(false);
    }
    if (element.scrollTop === 0) {
      if (messagesLength > messageIndex) {
        setTimeout(() => {
          setLoadMessages(true);
          if (messageIndex + 12 > messagesLength) {
            setMessageIndex(messagesLength);
          } else {
            setMessageIndex(messageIndex + 12);
          }
        }, 400);
      }
    }
  };

  const formatCode = (message: string) => {
    return message.split('```')[1];
  };

  const handleUserClick = (e: any, userId: string) => {
    router.push(`/profile/${userId}`);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat]);

  return (
    <Box width={"100%"} height={"100%"}>
      {messagesLength === 0 && (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              textAlign: 'center',
              padding: '1em',
              fontFamily: 'roboto'
            }}
          >
            <CircularProgress />{' '}
            <Typography
              style={{
                marginTop: '1em',
                flexBasis: '100%',
                color: 'white'
              }}
            >
              Loading Messages
            </Typography>
          </div>
        </div>
      )}
      <div
        style={{
          height: "calc(100vh - 500px)",
          overflowY: "auto",
          boxSizing: "border-box",
          width: "100%",
        }}
        id="messagesContainer"
        className="messages-container"
        onScroll={e => handleScrollTop(e)}
      >
        <List>
          {selectedChat !== null
            ? selectedChat.messages.slice(0, messagesLength).map((message: IMessage, index: number) => {
              return (
                <Fade in={true} timeout={500} key={index}>
                  <ListItem
                    sx={{
                      color: "white",
                      whiteSpace: "pre-line",
                      overflowWrap: "break-word",
                      display: "flex",
                      alignItems: "start",
                    }}
                    className="message" key={index}>
                    <ListItemAvatar
                      sx={{
                        display: "inline",
                        cursor: "pointer",
                        alignSelf: "flexStart",
                      }}
                      className="message-user-icon">
                      <Avatar>
                        <img
                          onClick={e => handleUserClick(e, message.sender._id)}
                          src={message.sender.profilePicture}
                          alt="user icon"
                          height="48"
                        />
                      </Avatar>
                    </ListItemAvatar>
                    {isTextCodeBlock(message.message) ? (
                      <ListItemText
                        primary={
                          <span
                            style={{ display: "inline", cursor: "pointer" }}
                            className="message-user"
                            onClick={e => handleUserClick(e, message.sender._id)}
                          >
                            {receiver !== null && message.sender.alias}
                            <Typography
                              component="span"
                              style={{ display: "inline", cursor: "pointer", color: "grey", fontSize: "13px", paddingLeft: "4px" }}
                              className="message-date"
                            >
                              {` - ${moment(message.edited).format('LLL')}`}
                            </Typography>
                          </span>
                        }
                        secondary={
                          <pre className="prettyprint">
                            <Typography component="div" dangerouslySetInnerHTML={{ __html: DomPurify.sanitize(formatCode((message.message))) }} />
                          </pre>
                        }
                        className="message-text"
                      />
                    ) : (
                      <ListItemText
                        primary={
                          <span
                            style={{ display: "inline", cursor: "pointer", color: dark }}
                            className="message-user"
                          >
                            {receiver !== null && message.sender.alias}
                            <Typography
                              component="span"
                              style={{ display: "inline", cursor: "pointer", color: "grey", fontSize: "13px", paddingLeft: "4px" }}
                              className="message-date"
                            >
                              {` - ${moment(message.edited).format('LLL')}`}
                            </Typography>
                          </span>
                        }
                        secondary={
                          <Typography component="div" fontSize={"12px"} style={{ color: dark }}>
                            {message.message}
                          </Typography>
                        }
                        className="message-text"
                      />
                    )}
                  </ListItem>
                </Fade>
              );
            })
            : null}
        </List>
        <div ref={messagesEndRef} id="messagesContainerBottom"></div>
      </div>
    </Box>
  );
};
