import React, { FC, useContext, useState } from 'react'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Box, Button, CircularProgress, TextField } from '@mui/material'
import { IMessageParsed } from '/app/interfaces';
import { apiCommentPost } from '/app/utils/api/apiMessages';
import { MessagesContext } from '/app/context/messages';

interface Props {
  selectedPost: IMessageParsed,
  setSelectedPost: (data: IMessageParsed) => void;
}

export const PostComment: FC<Props> = ({ selectedPost, setSelectedPost }) => {
  const token = useSelector((state: any) => state.persisted.token);
  const user = useSelector((state: any) => state.persisted.user);
  const { toggleUpdateMessages } = useContext(MessagesContext);

  const [commentText, setCommentText] = useState("");
  const [sendingToApi, setSendingToApi] = useState(false);

  const commentPost = async () => {
    if (user.estado === 0) {
      toast.error("You must be registered in to write a comment")
      return
    }
    if (commentText === "") {
      toast.error("Comments cannot be left empty.")
      return
    }
    if (commentText.length > 1000) {
      toast.error("The comment cannot be longer than 1000 characters")
      return
    }

    setSendingToApi(true)
    const { status, data } = await apiCommentPost({ postId: selectedPost._id, message: commentText, token });
    if (status !== 200 && status !== 201) {
      toast.error("Error commenting, please contact the admin.");
      setSendingToApi(false)
      return;
    }
    toggleUpdateMessages()
    setCommentText("")
    setSendingToApi(false)
  };

  return (
    <Box
      margin="0 0 20px 0"
      padding="20px"
      maxWidth={"500px"}
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems="end"
      sx={{
        width: "100%",
        borderRadius: "20px",
        backgroundColor: "#dddddd"
      }}
    >
      <TextField
        type="text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder={"Write your comment"}
        multiline
        maxRows={20}
        sx={{
          width: "100%",
          color: "gray",
          borderRadius: "20px",
          backgroundColor: "#ffffff",
          '& input': {
            color: "gray",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "transparent",
              borderWidth: 0
            },
            "&:hover fieldset": {
              borderColor: "transparent"
            },
            "&.Mui-focused fieldset": {
              borderColor: "transparent"
            }
          },
          '& .MuiInputBase-input': {
            fontSize: { xs: '0.875rem', sm: '1rem' },
            padding: { xs: '10px 14px', sm: '10px 14px' }
          },
        }}
      />
      <Button
        color="primary"
        onClick={commentPost}
        disabled={sendingToApi}
        sx={{
          marginTop: "10px",
          padding: "0 30px",
          height: "40px",
          marginRight: "15px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          bgcolor: "white",
        }}>
        {sendingToApi && <CircularProgress sx={{ marginRight: "10px" }} size={20} />}Comment
      </Button>
    </Box>
  )
}
