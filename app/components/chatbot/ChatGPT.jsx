import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { Configuration, OpenAIApi } from "openai";
import { TextField, Button } from '@mui/material';
import styles from './ChatGPT.module.css';
import FlexBetween from 'app/components/common/FlexBetween'


const ChatGPT = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ user: 'Assistant', text: "Hello, I'm your personal assistant. Ask me anything you want." }]);

  const sendMessage = async (message) => {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant in a blockchain social media web." },
        ...messages.map(msg => ({ role: msg.user === 'User' ? 'user' : 'assistant', content: msg.text })),
        { role: "user", content: message }
      ],
      temperature: 0.5,
      max_tokens: 100,
    });

    const aiReply = response.data.choices[0].message.content.trim();
    setMessages((prevMessages) => [...prevMessages, { user: 'Assistant', text: aiReply }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessages((prevMessages) => [...prevMessages, { user: 'User', text: input }]);
    chatGPTMutation.mutate(input);
    setInput('');
  };

  const configuration = new Configuration({
    organization: process.env.NEXT_PUBLIC_OPENAI_ORG_ID,
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const chatGPTMutation = useMutation(sendMessage);




  return (
    <div className={styles["chat-gpt"]}>
      <div className={styles["messages"]}>
        {messages.map((message, index) => (
          <div key={index} className={styles[`message ${message.user}`]}>
            <strong>{message.user}:</strong> {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <FlexBetween p={"15px"} gap={"10px"} className={styles["messages-form"]}>
          <TextField
            size='small'
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <Button
            variant="outlined"
            className={styles["messages-button"]}
            type="submit"
          >Send</Button>
        </FlexBetween>
      </form>
    </div>
  );
};


export default ChatGPT;