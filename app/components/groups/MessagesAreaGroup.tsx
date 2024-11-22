import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LocalFireDepartmentOutlined, LocalFireDepartment, Delete, ChatBubbleOutlineOutlined } from '@mui/icons-material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { List, Fade, CircularProgress, useTheme, Box, Typography, TextField, Button, IconButton, CardMedia } from '@mui/material';
import { IGroup, IGroupMessages } from '/app/interfaces';
import { MyPalette } from '/app/themes/types';
import { MessagesContext } from '/app/context/messages';
import { User } from '/app/interfaces';
import { addAliasAndProfilePicturesToCommentsInGroups } from '/app/utils/messages/generalUtils';
import ShowComments from '../common/ShowComments';
import { apiCall } from '/app/utils/api/apiUtils';
import { setSelectedGroup } from '/app/store/slices/messages/messagesSlice';
import PopupRemovePost from '../home/PopupRemovePost';

type Props = {};
export const MessagesAreaGroup: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.persisted.token);
  const user: User = useSelector((state: any) => state.persisted.user);
  const selectedGroup: IGroup | null = useSelector((state: any) => state.messagesSlice.selectedGroup);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const router = useRouter();
  const { palette } = useTheme<MyPalette>();
  const dark = palette.neutral.dark;
  const background = palette.background.default;
  const lightDark = palette.background.lightDark;
  const ultraLight = palette.greyscale.ultraLight;
  const { allAlias, allProfilePictures } = useContext(MessagesContext);

  const [isSubCommentsIds, setIsSubCommentsIds] = useState<string[]>([]);
  const [messagesWithAlias, setMessagesWithAlias] = useState<IGroupMessages[] | null>(null);
  const [subCommentInputs, setSubCommentInputs] = useState<{ [key: string]: string }>({});
  const [isLoadingSendComment, setIsLoadingSendComment] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState("");
  const [deleteMessageId, setDeleteMessageId] = useState("");
  const [messageIndex, setMessageIndex] = useState(12);
  const [loadMessages, setLoadMessages] = useState(false);
  const [openPopupRemoveComment, setOpenPopupRemoveComment] = useState(false);
  const [openPopupRemoveMessage, setOpenPopupRemoveMessage] = useState(false);
  const [isLoadingGettingComments, setIsLoadingGettingComments] = useState(false);

  let messagesLength = 0;
  if (selectedGroup !== null) messagesLength = selectedGroup.messages.length;

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

  const handleSubmitComment = async (messageId: string) => {
    if (user.estado === 0) {
      toast.error("You must be registered in to write a comment")
      return
    }
    if (selectedGroup === null) return
    if (subCommentInputs[messageId].length < 3) {
      toast.error("Comments cannot have less than 2 characters")
      return
    }
    setIsLoadingSendComment(true);
    const body = {
      msg: subCommentInputs[messageId],
      messageId,
    }
    const { status, data } = await apiCall({ type: "post", url: `/grupo/addCommentInMessage/${selectedGroup._id}`, token, body });
    if (status !== 200) {
      toast.error("Error commenting, please contact the admin.");
      setIsLoadingSendComment(false);
      return;
    }
    dispatch(setSelectedGroup({ selectedGroup: data }));
    setSubCommentInputs({ ...subCommentInputs, [messageId]: "" })
    setIsLoadingSendComment(false);
  };


  const messagePatchLike = async (messageId: string) => {
    console.log('messageId: ', messageId);
    if (user.estado === 0) {
      toast.error("Only for registered users");
      return;
    }
    if (selectedGroup === null) return
    const messageExist = selectedGroup.messages.find((message) => message._id === messageId);
    if (!messageExist) return;

    const body = {
      groupId: selectedGroup._id,
      messageId,
    }
    const { status, data } = await apiCall({ type: "post", url: `/grupo/toggleLikeInAMessage`, token, body });
    if (status !== 200) {
      console.log("error in commentPatchLike, status code: ", status);
      return;
    }
    dispatch(setSelectedGroup({ selectedGroup: data }));
  };

  const commentPatchLike = async (commentId: string) => {
    if (user.estado === 0) {
      toast.error("Only for registered users");
      return;
    }
    if (selectedGroup === null) return
    let messageId;
    const commentExist = selectedGroup.messages.find((message) => {
      const comment = message.comments.find((c) => c._id === commentId);
      if (comment) {
        messageId = message._id;
        return true;
      }
      return false;
    });
    if (!commentExist) return;
    const body = {
      groupId: selectedGroup._id,
      messageId,
      commentId,
    }

    const { status, data } = await apiCall({ type: "post", url: `/grupo/toggleLikeInMessageComment`, token, body });
    if (status !== 200) {
      console.log("error in commentPatchLike, status code: ", status);
      return;
    }
    dispatch(setSelectedGroup({ selectedGroup: data }));
  };

  const deleteMessage = async () => {
    if (selectedGroup === null) return
    const body = {
      messageId: deleteMessageId,
    }
    const { status, data } = await apiCall({ type: "delete", url: `/grupo/${selectedGroup._id}/deleteMessage`, token, body });
    if (status === 200) {
      dispatch(setSelectedGroup({ selectedGroup: data }));
      toast.success("Message deleted");
    } else {
      toast.error("Error deleting message");
    }
  };


  const deleteComment = async () => {
    if (selectedGroup === null) return
    let messageId = ""
    selectedGroup.messages.forEach((message) => {
      message.comments.forEach((comment) => {
        if (comment._id === deleteCommentId) {
          messageId = message._id
        }
      })
    });
    if (messageId === "") return;
    const body = {
      messageId,
      commentId: deleteCommentId,
    }
    const { status, data } = await apiCall({ type: "delete", url: `/grupo/deleteCommentInMessage/${selectedGroup._id}`, token, body });
    if (status === 200) {
      dispatch(setSelectedGroup({ selectedGroup: data }));
      toast.success("Comment deleted");
    } else {
      toast.error("Error deleting comment");
    }
  };

  useEffect(() => {
    const getResponses = () => {
      if (!selectedGroup) return
      setIsLoadingGettingComments(true)
      const messagesWithAlias = addAliasAndProfilePicturesToCommentsInGroups(selectedGroup?.messages, allAlias, allProfilePictures)
      setMessagesWithAlias(messagesWithAlias)
      setIsLoadingGettingComments(false);
    }
    getResponses()
  }, [selectedGroup]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedGroup]);

  return (
    <Box width={"100%"} height={"100%"} paddingBottom={"50px"}>
      {messagesLength === 0 &&
        <Box paddingTop={"100px"} marginBottom={"-120px"} display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
          <Typography fontSize={"24px"}>
            There are no messages yet.
          </Typography>
        </Box>
      }
      <div
        style={{
          height: "calc(100vh - 350px)",
          overflowY: "auto",
          boxSizing: "border-box",
          width: "100%",
        }}
        id="messagesContainer"
        className="messages-container"
        onScroll={e => handleScrollTop(e)}
      >
        <List>
          {(selectedGroup !== null && messagesWithAlias !== null) ?
            messagesWithAlias.slice(0, messagesLength).map((message: IGroupMessages, index: number) => {
              const onClickOpenSubComments = () => {
                if (isSubCommentsIds.includes(message._id)) {
                  const isSubCommentsIdsAux = isSubCommentsIds.filter((commentId) => commentId !== message._id)
                  setIsSubCommentsIds(isSubCommentsIdsAux)
                } else {
                  setIsSubCommentsIds(prev => [...prev, message._id])
                }
              };
              return (
                <Fade in={true} timeout={500} key={index}>
                  <Box
                    margin={"15px"}
                    display={"flex"}
                    alignItems={"start"}
                    sx={{
                      borderRadius: "10px",
                      '&:hover .deleteButton': {
                        visibility: 'visible',
                      },
                      '&:hover .addComment': {
                        visibility: 'visible',
                      }
                    }}
                  >
                    <CardMedia
                      component='img'
                      className='fadeIn'
                      image={allProfilePictures[message.id_user]}
                      alt='Profile picture'
                      sx={{ margin: "5px", borderRadius: '150px', height: "35px", width: "35px" }}
                    />
                    <Box marginTop={"-2px"} width={"100%"}>
                      <Box display={"flex"} alignItems={"center"}>
                        <Typography style={{ color: dark }}>
                          <span onClick={() => router.push(`/profile/${message.id_user}`)} style={{ cursor: "pointer" }}>
                            {allAlias[message.id_user]}
                          </span>
                          <span style={{ display: "inline", color: "grey", fontSize: "13px", paddingLeft: "4px" }}>
                            {` - ${moment(message.edited).format('LLL')}`}
                          </span>
                        </Typography>

                        <Box margin={"0 0 0 5px"} display="flex" alignItems="center" justifyContent={"right"}>
                          <IconButton onClick={() => messagePatchLike(message._id)} aria-label='Botón para dar like a un cometario'>
                            {message.likes.some(like => like.id_user === user?._id) ? (
                              <LocalFireDepartment sx={{ color: "red", fontSize: "14px" }} />
                            ) : (
                              <LocalFireDepartmentOutlined style={{ fontSize: "14px" }} />
                            )}
                          </IconButton>
                          <Typography fontSize={"11px"} margin="3px 0 0 -5px" variant="body1">
                            {message.likes.length}
                          </Typography>
                        </Box>


                        <Box margin={"-7px 0 0 0"} display={"flex"} justifyContent={"start"} alignItems={"center"}>
                          {message.comments.length > 0 ?
                            <Box margin={"10px 0 0 8px"} padding={"1px 5px"} display={"flex"} alignItems={"center"} onClick={onClickOpenSubComments} sx={{ borderRadius: "5px", ':hover': { cursor: "pointer", bgcolor: ultraLight } }}>
                              <ChatBubbleOutlineOutlined style={{ fontSize: "14px" }} />&nbsp;
                              <Typography fontSize={"11px"}>{message.comments.length} comments</Typography>
                              {isSubCommentsIds.includes(message._id) ? <KeyboardArrowDownIcon style={{ marginLeft: "5px", fontSize: "14px" }} /> : <KeyboardArrowRightIcon style={{ marginLeft: "5px", fontSize: "14px" }} />}
                            </Box>
                            :
                            <Box className={"addComment"} margin={"10px 0 0 8px"} padding={"1px 5px"} display={"flex"} alignItems={"center"} onClick={onClickOpenSubComments} sx={{ visibility: 'hidden', borderRadius: "5px", ':hover': { cursor: "pointer", bgcolor: ultraLight } }}>
                              <ChatBubbleOutlineOutlined style={{ fontSize: "14px" }} />
                              <Typography marginLeft={"5px"} fontSize={"11px"}>Add a comment</Typography>
                            </Box>
                          }
                        </Box>

                        <Box marginRight={"5px"} className="deleteButton" sx={{ visibility: 'hidden' }}>
                          {message.id_user === user?._id &&
                            < IconButton
                              sx={{ color: "gray" }}
                              onClick={() => {
                                setDeleteMessageId(message._id!)
                                setOpenPopupRemoveMessage(true)
                              }}
                              aria-label='Botón para borrar un comentario'
                            >
                              <Delete style={{ fontSize: "14px" }} />
                            </IconButton>
                          }
                        </Box>
                      </Box>

                      <Typography marginTop={"-5px"} component="div" fontSize={"12px"} style={{ color: dark }}>
                        {message.message}
                      </Typography>

                      <Box width={"100%"}>
                        <Box margin={"5px 0 0 0"} width={"100%"}>
                          {isSubCommentsIds.includes(message._id) &&
                            message.comments.map((comment, index) => {
                              const commentIsLiked = comment.likes.some(like => like.id_user === user?._id);
                              return (
                                <ShowComments
                                  key={index}
                                  isSubcomment={false}
                                  comment={comment}
                                  setDeleteCommentId={setDeleteCommentId}
                                  setOpenPopupRemoveComment={setOpenPopupRemoveComment}
                                  commentPatchLike={commentPatchLike}
                                  commentIsLiked={commentIsLiked}
                                  onClickOpenSubComments={onClickOpenSubComments}
                                  hideSubCommentButton={true}
                                  likeIcon={"fire"}
                                  size={"small"}
                                />
                              )
                            })}
                        </Box>

                        {isSubCommentsIds.includes(message._id) &&
                          <Box marginLeft={"10px"} marginTop={"3px"}>
                            <TextField
                              fullWidth
                              size="small"
                              value={subCommentInputs[message._id] || ''}
                              onChange={(e) => setSubCommentInputs({
                                ...subCommentInputs,
                                [message._id]: e.target.value
                              })}
                              label={"Add a comment"}
                              variant="outlined"
                              multiline
                              maxRows={20}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              style={{ marginTop: '5px' }}
                              onClick={() => handleSubmitComment(message._id)}
                              disabled={isLoadingSendComment}
                              sx={{
                                color: dark,
                                bgcolor: background,
                                "&:hover": {
                                  bgcolor: lightDark,
                                },
                              }}
                            >
                              {isLoadingSendComment ? <CircularProgress size={20} color="inherit" /> : "Submit Comment"}
                            </Button>
                          </Box>
                        }
                      </Box>
                    </Box>
                  </Box>
                </Fade>
              );
            })
            : null}
        </List>
        <div ref={messagesEndRef} id="messagesContainerBottom"></div>
      </div>

      <PopupRemovePost
        openPopupRemovePost={openPopupRemoveComment}
        handlePopupRemovePostClose={() => { setOpenPopupRemoveComment(false) }}
        onDeletePost={deleteComment}
        text={"This comment is going to be deleted, are you sure?"}
      />
      <PopupRemovePost
        openPopupRemovePost={openPopupRemoveMessage}
        handlePopupRemovePostClose={() => { setOpenPopupRemoveMessage(false) }}
        onDeletePost={deleteMessage}
        text={"This message is going to be deleted, are you sure?"}
      />
    </Box>
  );
};
