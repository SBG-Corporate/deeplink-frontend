import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { MyPalette } from "/app/themes/types";
import Delete from "@mui/icons-material/Delete";
import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, LocalFireDepartmentOutlined, LocalFireDepartment } from "@mui/icons-material";
import { Comment, GroupsComment, SubComment } from "/app/interfaces";

interface Props {
  comment: Comment | SubComment | GroupsComment;
  isSubcomment?: boolean;
  setDeleteCommentId: (data: string) => void,
  setOpenPopupRemoveComment: (data: boolean) => void,
  commentPatchLike: (commentId: string) => void,
  commentIsLiked: boolean,
  onClickOpenSubComments: () => void,
  hideSubCommentButton?: boolean,
  setDeleteSubCommentId?: (data: string) => void,
  setOpenPopupRemoveSubComment?: (data: boolean) => void,
  fatherCommentId?: string,
  subCommentPatchLike?: (commentId: string, subCommentId: string) => void,
  likeIcon?: "heart" | "fire",
  size?: "small" | "medium",
}
const ShowComments: React.FC<Props> = ({ isSubcomment = false, comment, setDeleteCommentId, setOpenPopupRemoveComment, setDeleteSubCommentId, setOpenPopupRemoveSubComment, commentPatchLike, commentIsLiked, onClickOpenSubComments, fatherCommentId, subCommentPatchLike, likeIcon = "heart", size = "medium", hideSubCommentButton = false }) => {
  const router = useRouter()
  const user = useSelector((state: any) => state.persisted.user);
  const { palette } = useTheme<MyPalette>();
  const main = palette.neutral.main;
  const ultraLight = palette.greyscale.ultraLight;

  const [isHoveredDeleteComment, setIsHoveredDeleteComment] = useState(false);

  const handleToggleLike = () => {
    if (isSubcomment) {
      if (subCommentPatchLike && fatherCommentId) {
        subCommentPatchLike(fatherCommentId, comment._id)
      }
    } else {
      commentPatchLike(comment._id)
    }
  };

  return (
    <Box
      padding={"0 5px"}
      marginTop={isSubcomment ? "-6px" : undefined}
      marginLeft={isSubcomment ? "20px" : undefined}
      onMouseEnter={() => setIsHoveredDeleteComment(true)}
      onMouseLeave={() => setIsHoveredDeleteComment(false)}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      borderRadius={"10px"}
      sx={{ bgcolor: isHoveredDeleteComment ? ultraLight : undefined }}
    >

      <Box padding={"0 5px"} width={"100%"} display={"flex"} justifyContent={"start"}>
        <Typography marginRight={"3px"} textAlign={"left"} fontWeight={"bold"} sx={{ fontSize: (isSubcomment || size === "small") ? "12px" : undefined, color: main, ":hover": { cursor: "pointer", opacity: 0.7 } }} onClick={() => router.push(`/profile/${comment.id_user}`)}>
          {`${comment.alias}`}:
        </Typography>
        <Typography textAlign={"left"} sx={{ color: main, fontSize: (isSubcomment || size === "small") ? "12px" : undefined }}>
          {`${comment.msg}`}
        </Typography>
      </Box>

      <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
        <Box className="deleteButton" >
          {comment.id_user === user._id && isHoveredDeleteComment &&
            < IconButton
              sx={{ color: "gray" }}
              onClick={() => {
                if (isSubcomment && setOpenPopupRemoveSubComment && setDeleteSubCommentId && fatherCommentId) {
                  setDeleteCommentId(fatherCommentId)
                  setDeleteSubCommentId(comment._id)
                  setOpenPopupRemoveSubComment(true)
                } else {
                  setDeleteCommentId(comment._id)
                  setOpenPopupRemoveComment(true)
                }
              }}
              aria-label='Botón para borrar un comentario'
            >
              <Delete style={{ fontSize: (isSubcomment || size === "small") ? "14px" : undefined }} />
            </IconButton>
          }
        </Box>

        {!isSubcomment && isHoveredDeleteComment && !hideSubCommentButton &&
          < IconButton
            sx={{ color: "gray" }}
            onClick={() => {
              onClickOpenSubComments()
            }}
          >
            <ChatBubbleOutlineOutlined style={{ fontSize: (isSubcomment || size === "small") ? "14px" : undefined }} />
          </IconButton>
        }

        <Box display={"flex"} alignItems={"center"}>
          <IconButton onClick={handleToggleLike}>
            {commentIsLiked ? (
              likeIcon === "heart" ? (
                <FavoriteOutlined sx={{ color: "red" }} style={{ fontSize: (isSubcomment || size === "small") ? "14px" : undefined }} />
              ) : (
                <LocalFireDepartment sx={{ color: "red" }} style={{ fontSize: (isSubcomment || size === "small") ? "14px" : undefined }} />
              )
            ) : (
              likeIcon === "heart" ? (
                <FavoriteBorderOutlined style={{ fontSize: (isSubcomment || size === "small") ? "14px" : undefined }} />
              ) : (
                <LocalFireDepartmentOutlined style={{ fontSize: (isSubcomment || size === "small") ? "14px" : undefined }} />
              )
            )}
          </IconButton>
          <Typography sx={{ marginTop: "2px", color: main, fontSize: (isSubcomment || size === "small") ? "12px" : undefined }}>{comment.likes.length}</Typography>
        </Box>

      </Box>
    </Box>
  )
}

export default ShowComments;
