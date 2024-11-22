import React, { useState } from 'react';
import { Button, useTheme } from "@mui/material";
import ChatGPT from './ChatGPT';
import styles from './ChatPopup.module.css';

const ChatPopup = () => {
  const theme = useTheme();
  const background = theme.palette.background.default;
  const paper = theme.palette.background.paper;
  const primaryMain = theme.palette.primary.main;

  const [showChat, setShowChat] = useState(false);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div className={styles["chat-popup"]} >
      {showChat && (
        <div className={styles["chat-interface"]} style={{ backgroundColor: background, border: `1px solid ${paper}` }} >
          <div className={styles["chat-header"]} style={{ backgroundColor: primaryMain, color: paper }}>
            <span className={styles["chat-title"]} >Assistant powered by ChatGPT</span>
            <button className={styles["close-chat"]} onClick={toggleChat}>
              &times;
            </button>
          </div>
          <ChatGPT />
        </div>
      )}
      {!showChat &&
        <Button onClick={toggleChat}>
          <img src={"/assets/img/avatars/steward_deeplink.png"} alt="button" width={70} />
        </Button>
      }
    </div>
  );
};

export default ChatPopup;
