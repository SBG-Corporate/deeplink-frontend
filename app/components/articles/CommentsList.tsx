import React, { FC, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { LocalFireDepartmentOutlined, LocalFireDepartment, Delete, ChatBubbleOutlineOutlined } from '@mui/icons-material';
import { Box, Button, CardMedia, CircularProgress, IconButton, TextField, Typography, useTheme } from '@mui/material';
import { Comment, IMessageParsed } from '../../interfaces';
import { BoxLoading } from '../ui/BoxLoading';
import { User } from '/app/interfaces';
import { dateToBeauty } from '/app/utils/generalUtils';
import PopupRemovePost from '../home/PopupRemovePost';
import { MessagesContext } from '/app/context/messages';
import { apiDeleteCommentPost, apiToggleLikeInComment } from '/app/utils/api/apiMessages';
import { MyPalette } from '/app/themes/types';
import ShowComments from '../common/ShowComments';
import { addAliasAndProfilePicturesToCommentsAndSubComments } from '/app/utils/messages/generalUtils';
import { apiCall } from '/app/utils/api/apiUtils';

interface Props {
  post: IMessageParsed
}

export const CommentsList: FC<Props> = ({ post }) => {
  const user: User = useSelector((state: any) => state.persisted.user);
  const token = useSelector((state: any) => state.persisted.token);
  const { allAlias, allProfilePictures, toggleUpdateMessages } = useContext(MessagesContext);

  const { palette } = useTheme<MyPalette>();
  const main = palette.neutral.main;
  const dark = palette.neutral.dark;
  const background = palette.background.default;
  const lightDark = palette.background.lightDark;
  const ultraLight = palette.greyscale.ultraLight;
  const medium = palette.greyscale.medium;

  const [selectedPost, setSelectedPost] = useState<IMessageParsed>(post);
  const [openPopupRemoveComment, setOpenPopupRemoveComment] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState("");
  const [isSubCommentsIds, setIsSubCommentsIds] = useState<string[]>([]);
  const [deleteSubCommentId, setDeleteSubCommentId] = useState("");
  const [openPopupRemoveSubComment, setOpenPopupRemoveSubComment] = useState(false);
  const [commentResponses, setCommentResponses] = useState<Comment[] | null>(null);
  const [subCommentInputs, setSubCommentInputs] = useState<{ [key: string]: string }>({});
  const [isLoadingSendComment, setIsLoadingSendComment] = useState(false);
  const [isLoadingGettingComments, setIsLoadingGettingComments] = useState(false);


  const handleSubmitSubComment = async (commentId: string) => {
    if (user.estado === 0) {
      toast.error("You must be registered in to write a comment")
      return
    }
    if (subCommentInputs[commentId] === "") {
      toast.error("Comments cannot be left empty.")
      return
    }
    setIsLoadingSendComment(true);
    const body = {
      msg: subCommentInputs[commentId],
      commentId,
    }
    const { status, data } = await apiCall({ type: "post", url: `/msg/subComment/${post._id}`, token, body });
    if (status !== 200) {
      toast.error("Error commenting, please contact the admin.");
      setIsLoadingSendComment(false);
      return;
    }
    const commentsExtended = addAliasAndProfilePicturesToCommentsAndSubComments(data.comments, allAlias, allProfilePictures)
    setCommentResponses(commentsExtended);
    setSubCommentInputs({ ...subCommentInputs, [commentId]: "" })
    setIsLoadingSendComment(false);
  };


  const commentPatchLike = async (commentId: string) => {
    if (user.estado === 0) {
      toast.error("Only for registered users");
      return;
    }
    if (selectedPost === undefined) return
    const commentExist = selectedPost.comments?.find((c) => c._id === commentId);
    if (!commentExist) return;
    const { status, data } = await apiToggleLikeInComment(selectedPost._id, commentId, token);
    toggleUpdateMessages()
    if (status !== 200) {
      console.log("error in commentPatchLike, status code: ", status);
      return;
    }
    setSelectedPost(data);
  };

  const deleteComment = async () => {
    const { status, data } = await apiDeleteCommentPost({ postId: selectedPost._id, token, commentId: deleteCommentId })
    if (status === 200) {
      setSelectedPost(data);
      toast.success("Comment deleted");
    } else {
      toast.error("Error deleting comment");
    }
  };

  const deleteSubComment = async () => {
    const body = {
      commentId: deleteCommentId,
      subCommentId: deleteSubCommentId,
    }
    const { status, data } = await apiCall({ type: "delete", url: `/msg/subComment/${post._id}`, token, body });
    if (status === 200) {
      const commentsExtended = addAliasAndProfilePicturesToCommentsAndSubComments(data.comments, allAlias, allProfilePictures)
      setCommentResponses(commentsExtended);
      toast.success("Comment deleted");
    } else {
      toast.error("Error deleting comment, please contact the admin");
    }
  };

  const subCommentPatchLike = async (commentId: string, subCommentId: string) => {
    if (user.estado === 0) {
      toast.error("Only for registered users");
      return;
    }
    const body = {
      messageId: post._id,
      commentId,
      subCommentId,
    }
    const { status, data } = await apiCall({ type: "post", url: `/msg/toggleLikeInSubComment`, token, body });
    if (status !== 200) {
      console.log("error in subCommentPatchLike, status code: ", status);
      return;
    }
    const commentsExtended = addAliasAndProfilePicturesToCommentsAndSubComments(data.comments, allAlias, allProfilePictures)
    setCommentResponses(commentsExtended);
    setSubCommentInputs({ ...subCommentInputs, [commentId]: "" })
  };


  useEffect(() => {
    setSelectedPost(post)
  }, [post])
  useEffect(() => {
    const getResponses = () => {
      setIsLoadingGettingComments(true)
      const commentResponses = addAliasAndProfilePicturesToCommentsAndSubComments(selectedPost.comments, allAlias, allProfilePictures)
      setCommentResponses(commentResponses)
      setIsLoadingGettingComments(false);
    }
    getResponses()
  }, [selectedPost]);

  if (selectedPost === undefined) return <BoxLoading />

  if (selectedPost.comments.length === 0) return <></>

  return (
    <Box
      margin="0 0 20px 0"
      padding="20px"
      maxWidth={"500px"}
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems="start"
      sx={{
        width: "100%",
        borderRadius: "20px",
        backgroundColor: "#dddddd"
      }}
    >
      {commentResponses && commentResponses.map((comment, index) => {
        const onClickOpenSubComments = () => {
          if (isSubCommentsIds.includes(comment._id)) {
            const isSubCommentsIdsAux = isSubCommentsIds.filter((commentId) => commentId !== comment._id)
            setIsSubCommentsIds(isSubCommentsIdsAux)
          } else {
            setIsSubCommentsIds(prev => [...prev, comment._id])
          }
        };
        const commentsExtended = addAliasAndProfilePicturesToCommentsAndSubComments([comment], allAlias, allProfilePictures)
        return (
          <Box
            key={index}
            margin={"10px 0"}
            padding={"10px"}
            width={"100%"}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              '&:hover .deleteButton': { // Use a class to identify the delete button
                visibility: 'visible',
              }
            }}
          >
            <Box display={"flex"} alignItems={"center"}>
              <CardMedia
                image={allProfilePictures[comment.id_user]}
                component='img'
                alt='User profile picture'
                sx={{ padding: "10px", borderRadius: '50px', height: "50px", width: "50px" }}
              />
              <Typography variant='body1' fontSize={"16px"} fontWeight={700}>{allAlias[comment.id_user]}&nbsp;·&nbsp;
                <span style={{ fontWeight: 400, color: lightDark }}>{dateToBeauty(new Date(comment.created).toString())}</span></Typography>
            </Box>
            <Box sx={{ m: "10px 10px 0 10px" }}>
              {comment.msg.split('\n\n').map((paragraph, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  {paragraph.split('\n').map((line, lineIndex) => (
                    <Typography key={lineIndex} color={main}>
                      {line}
                    </Typography>
                  ))}
                </Box>
              ))}
            </Box>
            <Box marginTop={"-10px"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
              <Box>
                {comment.subComments.length > 0 ?
                  <Box display={"flex"} alignItems={"center"} onClick={onClickOpenSubComments} sx={{ borderRadius: "5px", ':hover': { cursor: "pointer", bgcolor: ultraLight } }}>
                    <ChatBubbleOutlineOutlined style={{ margin: "5px", color: medium, fontSize: "14px" }} />
                    <Typography fontSize={"11px"}>{comment.subComments.length} comments</Typography>
                    {isSubCommentsIds.includes(comment._id) ? <KeyboardArrowDownIcon style={{ marginLeft: "5px", fontSize: "14px" }} /> : <KeyboardArrowRightIcon style={{ marginLeft: "5px", fontSize: "14px" }} />}
                  </Box>
                  :
                  < IconButton
                    sx={{ color: "gray" }}
                    onClick={() => {
                      onClickOpenSubComments()
                    }}
                  >
                    <ChatBubbleOutlineOutlined style={{ fontSize: "14px" }} />
                    <Typography marginLeft={"5px"} fontSize={"11px"}>Add a comment</Typography>
                  </IconButton>
                }
              </Box>
              <Box display={"flex"}>
                <Box marginRight={"5px"} className="deleteButton" sx={{ visibility: 'hidden' }}>
                  {comment.id_user === user?._id &&
                    < IconButton
                      sx={{ color: "gray" }}
                      onClick={() => {
                        setDeleteCommentId(comment._id!)
                        setOpenPopupRemoveComment(true)
                      }}
                      aria-label='Botón para borrar un comentario'
                    >
                      <Delete />
                    </IconButton>
                  }
                </Box>
                <Box marginRight={"5px"} display="flex" alignItems="center" justifyContent={"right"}>
                  <IconButton onClick={() => commentPatchLike(comment._id)} aria-label='Botón para dar like a un cometario'>
                    {comment.likes.some(like => like.id_user === user?._id) ? (
                      <LocalFireDepartment sx={{ color: "red" }} />
                    ) : (
                      <LocalFireDepartmentOutlined />
                    )}
                  </IconButton>
                  <Typography marginTop="3px" variant="body1">
                    {comment.likes.length}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {isSubCommentsIds.includes(comment._id) &&
              comment.subComments.map((subComment, index) => {
                const subCommentIsLiked = subComment.likes.some(like => like.id_user === user?._id);
                return (
                  <ShowComments
                    key={index}
                    isSubcomment={true}
                    comment={commentsExtended[0].subComments[index]}
                    setDeleteCommentId={setDeleteCommentId}
                    setOpenPopupRemoveComment={setOpenPopupRemoveComment}
                    commentPatchLike={commentPatchLike}
                    commentIsLiked={subCommentIsLiked}
                    onClickOpenSubComments={onClickOpenSubComments}
                    fatherCommentId={comment._id}
                    setDeleteSubCommentId={setDeleteSubCommentId}
                    setOpenPopupRemoveSubComment={setOpenPopupRemoveSubComment}
                    subCommentPatchLike={subCommentPatchLike}
                    likeIcon={"fire"}
                  />
                )
              })}
            {isSubCommentsIds.includes(comment._id) &&
              <Box marginLeft={"25px"} marginTop={"3px"}>
                <TextField
                  fullWidth
                  size="small"
                  value={subCommentInputs[comment._id] || ''}
                  onChange={(e) => setSubCommentInputs({
                    ...subCommentInputs,
                    [comment._id]: e.target.value
                  })}
                  label={"Add a comment"}
                  variant="outlined"
                  multiline
                  maxRows={20}
                />
                <Button
                  variant="contained"
                  // color="primary"
                  size="small"
                  style={{ marginTop: '5px' }}
                  onClick={() => handleSubmitSubComment(comment._id)}
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
        )
      })}

      <PopupRemovePost
        openPopupRemovePost={openPopupRemoveSubComment}
        handlePopupRemovePostClose={() => { setOpenPopupRemoveSubComment(false) }}
        onDeletePost={deleteSubComment}
        text={"This comment is going to be deleted, are you sure?"}
      />
      <PopupRemovePost
        openPopupRemovePost={openPopupRemoveComment}
        handlePopupRemovePostClose={() => { setOpenPopupRemoveComment(false) }}
        onDeletePost={deleteComment}
        text={"This comment is going to be deleted, are you sure?"}
      />
    </Box >
  )
}
