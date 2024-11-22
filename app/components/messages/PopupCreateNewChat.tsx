import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { createNewMessageChat } from '/app/utils/api/apiMessages';
import { DropdownMenu } from "app/components/messages";
import { getFriendsIdsWithChats, getUserChats } from '/app/utils/messages/parseChats';
import { Friend } from '/app/interfaces';
import { setSelectedChat } from '/app/store/slices/messages/messagesSlice';
import { MessagesContext } from '/app/context/messages';

interface PopupCreateNewChat {
  openPopup: boolean;
  handlePopupClose: () => void;
}

export const PopupCreateNewChat: React.FC<PopupCreateNewChat> = ({ openPopup, handlePopupClose }) => {
  const dispatch = useDispatch();
  const friendsListInfo = useSelector((state: any) => state.persisted.friendsListInfo) || [];
  const allChats = useSelector((state: any) => state.messagesSlice.allChats || []);
  const { _id: userId, profilePicture, alias, friendsIds } = useSelector((state: any) => state.persisted.user);
  const token = useSelector((state: any) => state.persisted.token);
  const { toggleUpdateMessages } = useContext(MessagesContext);

  const [friendIdsWithoutChat, setFriendIdsWithoutChat] = useState<Friend[]>([]);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");

  const handleNewMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const onClickCreateNewChat = async () => {
    const { status, data } = await createNewMessageChat({ message, receiverId, token })
    if (status !== 200 && status !== 201) { toast.error("The message has not been sent correctly, please contact the administrator."); return; }
    const receiverData: Friend = friendsListInfo.find((friend: Friend) => friend._id === receiverId)
    const newChat = {
      created: data.created,
      messages: [{
        created: data.created,
        edited: data.created,
        father: null,
        message: data.msg,
        receiver: receiverData,
        seen: 0,
        sender: { alias, profilePicture, _id: userId },
        _id: 0,
      }],
      participants: [{ ...receiverData, type: "receiver" }, { alias, profilePicture, type: "sender", _id: userId }],
      _id: data._id
    }
    toggleUpdateMessages()
    dispatch(setSelectedChat({ selectedChat: newChat }));
    handlePopupClose()
  };

  const getFriendsWithNoChat = async () => {
    const userChats = getUserChats({ userId, allChats })
    const friendIdsWithChat = getFriendsIdsWithChats({ userId, userChats })
    const newFriendIdsWithoutChat = friendsListInfo.filter((friend: Friend) => !friendIdsWithChat.includes(friend._id));
    if (JSON.stringify(newFriendIdsWithoutChat) !== JSON.stringify(friendIdsWithoutChat)) {
      setFriendIdsWithoutChat(newFriendIdsWithoutChat)
    }
  };

  useEffect(() => {
    getFriendsWithNoChat()
  }, [friendsListInfo, allChats])


  return (
    <Dialog
      fullWidth
      open={openPopup}
      onClose={handlePopupClose}>
      <DialogContent>
        {friendIdsWithoutChat.length === 0 && friendsIds !== undefined &&
          <DialogContentText sx={{ marginBottom: "10px", fontSize: "16px", fontWeight: "500", color: "red" }}>
            {friendsIds.length === 0 ? "You only can create a new chat with a friend. Now you have no friends" : "You have a chat with all your followers. To create a new chat you must to follow a new user."}
          </DialogContentText>
        }
        <DialogContentText sx={{ fontSize: "24px", fontWeight: "bold" }}>
          {"Create new chat"}
        </DialogContentText>
      </DialogContent>

      <DialogContent>
        <DropdownMenu setReceiverId={setReceiverId} friendIdsWithoutChat={friendIdsWithoutChat} />
      </DialogContent>

      <DialogContent>
        <TextField
          fullWidth
          label="Message"
          variant="outlined"
          value={message}
          onChange={handleNewMessageChange}
        />
      </DialogContent>

      <DialogActions
        sx={{
          paddingRight: "25px",
          paddingBottom: "25px",
        }}
      >
        <Button
          sx={{
            width: "auto",
            padding: "10px 15px"
          }}
          variant="contained"
          color="primary"
          onClick={onClickCreateNewChat}
          endIcon=<SendIcon />
          disabled={receiverId === ""}
        >
          Send Message
        </Button>
      </DialogActions>

      <DialogActions>
        <Button
          sx={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }}
          onClick={handlePopupClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
