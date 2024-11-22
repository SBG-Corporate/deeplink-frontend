import { FC, useContext, useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { ChatBubbleOutlineOutlined, Delete, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, TextField, Button, CircularProgress, Tooltip } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FlexBetween from "app/components/common/FlexBetween";
import FriendBox from "app/components/common/FriendBox";
import { apiAddLike, apiCommentPost, apiDeleteCommentPost, apiDeleteMessage, apiRemoveLike, apiToggleLikeInComment } from "/app/utils/api/apiMessages";
import { MessagesContext } from "/app/context/messages";
import { Comment, LikesApi, UploadedFile } from "/app/interfaces";
import PopupRemovePost from "./PopupRemovePost";
import { MyPalette } from '/app/themes/types';
import { ShareMenu } from "../articles/ShareMenu";
import ShowComments from "../common/ShowComments";
import { apiCall } from "/app/utils/api/apiUtils";
import { addAliasAndProfilePicturesToCommentsAndSubComments } from "/app/utils/messages/generalUtils";

interface Props {
  userProfilePicture: string;
  postId: string;
  id_user: string;
  msg: string;
  files: UploadedFile[];
  likes: LikesApi[];
  comments: any[];
  showComments?: boolean;
}

const PostWidget: FC<Props> = ({
  userProfilePicture,
  postId,
  id_user,
  msg,
  files,
  likes,
  comments,
  showComments = false
}) => {
  const router = useRouter()
  const token = useSelector((state: any) => state.persisted.token) || "";
  const user = useSelector((state: any) => state.persisted.user);
  const { query } = router;
  const { allAlias, allProfilePictures, messagesPosts, toggleUpdateMessages } = useContext(MessagesContext);
  const { palette } = useTheme<MyPalette>();
  const main = palette.neutral.main;
  const dark = palette.neutral.dark;
  const background = palette.background.default;
  const lightDark = palette.background.lightDark;
  const ultraLight = palette.greyscale.ultraLight;
  const medium = palette.greyscale.medium;

  const [isComments, setIsComments] = useState(showComments);
  const [isSubCommentsIds, setIsSubCommentsIds] = useState<string[]>([]);
  const [commentResponses, setCommentResponses] = useState<Comment[] | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLiked, setisLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [commentInput, setCommentInput] = useState('');
  const [subCommentInputs, setSubCommentInputs] = useState<{ [key: string]: string }>({});
  const [isLoadingSendComment, setIsLoadingSendComment] = useState(false);
  const [isLoadingGettingComments, setIsLoadingGettingComments] = useState(false);
  const [openPopupRemoveComment, setOpenPopupRemoveComment] = useState(false);
  const [openPopupRemoveSubComment, setOpenPopupRemoveSubComment] = useState(false);
  const [isCommented, setIsCommented] = useState(false);

  const [openPopupRemovePost, setOpenPopupRemovePost] = useState(false);
  const [deletePostId, setDeletePostId] = useState("");
  const [deleteCommentId, setDeleteCommentId] = useState("");
  const [deleteSubCommentId, setDeleteSubCommentId] = useState("");
  const [isHoveredDeletePost, setIsHoveredDeletePost] = useState(false);
  const [commentsNumber, setCommentsNumber] = useState(0);

  const commentPatchLike = async (commentId: string) => {
    if (user.estado === 0) {
      toast.error("Only for registered users");
      return;
    }
    const comment = commentResponses?.find((c) => c._id === commentId);
    if (!comment) return;

    const { status, data } = await apiToggleLikeInComment(postId, commentId, token);
    if (status !== 200) {
      console.log("error in commentPatchLike, status code: ", status);
      return;
    }
    const commentsExtended = addAliasAndProfilePicturesToCommentsAndSubComments(data.comments, allAlias, allProfilePictures)
    setCommentResponses(commentsExtended);
    toggleUpdateMessages()
  };

  const subCommentPatchLike = async (commentId: string, subCommentId: string) => {
    if (user.estado === 0) {
      toast.error("Only for registered users");
      return;
    }
    const body = {
      messageId: postId,
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

  const patchLike = async () => {
    if (user.estado === 0) {
      toast.error("You must be registered in to give a like")
      return
    }
    let status, data: any;
    if (isLiked) {
      ({ status, data } = await apiRemoveLike(postId, token));
      setLikeCount(prev => prev - 1)
    } else {
      ({ status, data } = await apiAddLike(postId, token))
      setLikeCount(prev => prev + 1)
    }
    if (status !== 200) { console.log("error in patchLike, status code: ", status); return; }
    setisLiked(prev => !prev)
    toggleUpdateMessages()
  };

  const handleSubmitComment = async () => {
    if (user.estado === 0) {
      toast.error("You must be registered in to write a comment")
      return
    }
    if (commentInput === "") {
      toast.error("Comments cannot be left empty.")
      return
    }
    setIsLoadingSendComment(true);

    const { status, data } = await apiCommentPost({ postId, message: commentInput, token });
    if (status !== 200 && status !== 201) {
      toast.error("Error commenting, please contact the admin.");
      return;
    }
    const commentsExtended = addAliasAndProfilePicturesToCommentsAndSubComments(data.comments, allAlias, allProfilePictures)
    setCommentResponses(commentsExtended);
    setCommentInput('');
    setIsLoadingSendComment(false);
  };

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

    const { status, data } = await apiCall({ type: "post", url: `/msg/subComment/${postId}`, token, body });
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


  const deleteComment = async () => {
    const { status, data } = await apiDeleteCommentPost({ postId, token, commentId: deleteCommentId })
    if (status === 200) {
      const commentsExtended = addAliasAndProfilePicturesToCommentsAndSubComments(data.comments, allAlias, allProfilePictures)
      setCommentResponses(commentsExtended);
      toast.success("Comment deleted");
    } else {
      toast.error("Error deleting comment, please contact the admin");
    }
  };

  const deleteSubComment = async () => {
    const body = {
      commentId: deleteCommentId,
      subCommentId: deleteSubCommentId,
    }

    const { status, data } = await apiCall({ type: "delete", url: `/msg/subComment/${postId}`, token, body });
    if (status === 200) {
      const commentsExtended = addAliasAndProfilePicturesToCommentsAndSubComments(data.comments, allAlias, allProfilePictures)
      setCommentResponses(commentsExtended);
      toast.success("Comment deleted");
    } else {
      toast.error("Error deleting comment, please contact the admin");
    }
  };


  const deletePost = async () => {
    const { status, data } = await apiDeleteMessage(deletePostId, token)
    if (status === 200) {
      toast.success("Post deleted");
    } else {
      toast.error("Error deleting post, please contact the admin");
    }
    toggleUpdateMessages()
  }

  const goToPostPage = () => {
    if (query.postId === undefined) {
      router.push(`/post/${postId}`)
    }
  };

  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const getResponses = () => {
      setIsLoadingGettingComments(true)
      const commentResponses = addAliasAndProfilePicturesToCommentsAndSubComments(comments, allAlias, allProfilePictures)
      setCommentResponses(commentResponses)
      setIsLoadingGettingComments(false);
    }

    if (!isComments) return
    getResponses()
  }, [isComments]);


  useEffect(() => {
    setisLiked(likes ? likes.some((like: LikesApi) => like.id_user === user._id) : false)
    setLikeCount(likes ? Object.keys(likes).length : 0)
    setIsCommented(comments ? comments.some((comment: any) => comment.id_user === user._id) : false)
    if (commentResponses) {
      setCommentsNumber(commentResponses.length)
    } else {
      setCommentsNumber(comments.length)
    }
  }, [likes, commentResponses]);

  return (
    <Box
      padding={"30px 20px"}
      onMouseEnter={() => setIsHoveredDeletePost(true)}
      onMouseLeave={() => setIsHoveredDeletePost(false)}
    >
      <FriendBox
        friendId={id_user}
        name={allAlias[id_user]}
        subtitle={user.alias}
        userProfilePicture={userProfilePicture}
      />
      <Box
        onClick={goToPostPage}
        sx={{ ":hover": { cursor: query.postId === undefined ? "pointer" : undefined } }}
      >
        <Box sx={{ mt: "1rem" }}>
          {msg.split('\n\n').map((paragraph, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              {paragraph.split('\n').map((line, lineIndex) => (
                <Typography key={lineIndex} color={main}>
                  {line}
                </Typography>
              ))}
            </Box>
          ))}
        </Box>
        {files && files !== null && files.length !== 0 && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`${files[0].url}`}
          />
        )}
      </Box>

      <FlexBetween gap="1rem">
        <Box display={"flex"} alignItems={"center"} gap={"5px"}>
          {isLoadingGettingComments ? (
            <Box display="flex" justifyContent="center" marginLeft={"12px"} >
              <CircularProgress size={24} />
            </Box>
          ) :
            <Box display={"flex"} alignItems={"center"} onClick={() => setIsComments(prev => !prev)} sx={{ borderRadius: "5px", ':hover': { cursor: "pointer", bgcolor: ultraLight } }}>
              <ChatBubbleOutlineOutlined style={{ margin: "5px", color: medium }} />
              <Typography>{commentsNumber} comments</Typography>
              {isComments ? <KeyboardArrowDownIcon style={{ marginLeft: "5px" }} /> : <KeyboardArrowRightIcon style={{ marginLeft: "5px" }} />}
            </Box>
          }
        </Box>

        <Box marginRight={"5px"} display={"flex"} alignItems={"center"}>
          <Box className="deleteButton">
            {id_user === user._id && isHoveredDeletePost &&
              < IconButton
                sx={{ color: "gray" }}
                onClick={() => {
                  setDeletePostId(postId)
                  setOpenPopupRemovePost(true)
                }}
                aria-label='Botón para borrar un comentario'
              >
                <Delete />
              </IconButton>
            }
          </Box>

          <Tooltip title="Share article">
            <IconButton onClick={handleShareClick}>
              <ShareOutlined sx={{ fontSize: "20px", color: "gray" }} />
            </IconButton>
          </Tooltip>
          <ShareMenu
            anchorEl={anchorEl}
            onClose={handleClose}
            postUrl={`/post/${postId}`}
          />

          <Box display={"flex"} alignItems={"center"}>
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: "red" }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </Box>
        </Box>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          {commentResponses && commentResponses.map((commentResponse, index) => {
            const commentIsLiked = commentResponse.likes.some(like => like.id_user === user?._id);
            const onClickOpenSubComments = () => {
              if (isSubCommentsIds.includes(commentResponse._id)) {
                const isSubCommentsIdsAux = isSubCommentsIds.filter((commentId) => commentId !== commentResponse._id)
                setIsSubCommentsIds(isSubCommentsIdsAux)
              } else {
                setIsSubCommentsIds(prev => [...prev, commentResponse._id])
              }
            };
            return (
              <Box key={index}>
                <ShowComments
                  comment={commentResponse}
                  setDeleteCommentId={setDeleteCommentId}
                  setOpenPopupRemoveComment={setOpenPopupRemoveComment}
                  commentPatchLike={commentPatchLike}
                  commentIsLiked={commentIsLiked}
                  onClickOpenSubComments={onClickOpenSubComments}
                />
                {commentResponse.subComments.length > 0 &&
                  <Box margin={"-5px 0 0 5px"} display={"flex"} alignItems={"center"} onClick={onClickOpenSubComments} sx={{ borderRadius: "5px", ':hover': { cursor: "pointer", bgcolor: ultraLight } }}>
                    <ChatBubbleOutlineOutlined style={{ margin: "5px", color: medium, fontSize: "14px" }} />
                    <Typography fontSize={"11px"}>{commentResponse.subComments.length} comments</Typography>
                    {isSubCommentsIds.includes(commentResponse._id) ? <KeyboardArrowDownIcon style={{ marginLeft: "5px", fontSize: "14px" }} /> : <KeyboardArrowRightIcon style={{ marginLeft: "5px", fontSize: "14px" }} />}
                  </Box>
                }
                {isSubCommentsIds.includes(commentResponse._id) &&
                  commentResponse.subComments.map((subComment, index) => {
                    const subCommentIsLiked = subComment.likes.some(like => like.id_user === user?._id);
                    return (
                      <ShowComments
                        key={index}
                        isSubcomment={true}
                        comment={subComment}
                        setDeleteCommentId={setDeleteCommentId}
                        setOpenPopupRemoveComment={setOpenPopupRemoveComment}
                        commentPatchLike={commentPatchLike}
                        commentIsLiked={subCommentIsLiked}
                        onClickOpenSubComments={onClickOpenSubComments}
                        fatherCommentId={commentResponse._id}
                        setDeleteSubCommentId={setDeleteSubCommentId}
                        setOpenPopupRemoveSubComment={setOpenPopupRemoveSubComment}
                        subCommentPatchLike={subCommentPatchLike}
                      />
                    )
                  })}
                {isSubCommentsIds.includes(commentResponse._id) &&
                  <Box marginLeft={"25px"} marginTop={"3px"}>
                    <TextField
                      fullWidth
                      size="small"
                      value={subCommentInputs[commentResponse._id] || ''}
                      onChange={(e) => setSubCommentInputs({
                        ...subCommentInputs,
                        [commentResponse._id]: e.target.value
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
                      onClick={() => handleSubmitSubComment(commentResponse._id)}
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
          <Divider />
          <Box mt="1rem">
            <TextField
              fullWidth
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              label={commentResponses?.length === 0 ? "Add the first comment" : "Add a comment"}
              variant="outlined"
              multiline
              maxRows={20}
            />
            <Button
              variant="contained"
              style={{ marginTop: '1rem' }}
              onClick={handleSubmitComment}
              disabled={isLoadingSendComment}
              sx={{
                color: dark,
                bgcolor: background,
                "&:hover": {
                  bgcolor: lightDark,
                },
              }}
            >
              {isLoadingSendComment ? <CircularProgress size={24} color="inherit" /> : "Submit Comment"}
            </Button>
          </Box>
        </Box>
      )}

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
      <PopupRemovePost
        openPopupRemovePost={openPopupRemovePost}
        handlePopupRemovePostClose={() => { setOpenPopupRemovePost(false) }}
        onDeletePost={deletePost}
        text={"You are going to delete this post forever, are you sure?"}
      />
    </Box>
  );
};

export default PostWidget;
