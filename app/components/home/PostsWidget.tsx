import React, { useContext, useEffect, useState } from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PostWidget from "app/components/home/PostWidget";
import { MessagesContext } from "/app/context/messages";
import { IMessageParsed } from "/app/interfaces";
import { MyPalette } from "/app/themes/types";

interface Props {
  userId: string;
}
const PostsWidget: React.FC<Props> = ({ userId }) => {
  const { isLoadingMessages, messagesPosts, allProfilePictures } = useContext(MessagesContext);
  const { palette } = useTheme<MyPalette>();
  const dark = palette.neutral.dark;

  const [userPosts, setUserPosts] = useState<IMessageParsed[]>([]);

  const getUserPosts = (messagesPosts: IMessageParsed[]) => {
    return messagesPosts.filter((post) => post.id_user === userId)
  };

  useEffect(() => {
    if (isLoadingMessages) return;
    if (userId === "all") return
    const userPosts = getUserPosts(messagesPosts)
    setUserPosts(userPosts)
  }, [isLoadingMessages, userId]);


  if (userId === "all") {
    return (
      <Box paddingTop={"15px"}>
        {messagesPosts.length !== 0 && messagesPosts.map((post: IMessageParsed) => {
          const { _id } = post;
          return (
            <Box
              key={"post-widget-" + _id}
              margin={"20px"}
              boxShadow={" 0 0 10px rgba(0, 0, 0, 0.1)"}
              borderRadius={"30px"}
            >
              <PostWidget
                postId={post._id}
                id_user={post.id_user}
                msg={post.msg}
                files={post.files}
                likes={post.likes}
                comments={post.comments}
                userProfilePicture={allProfilePictures[post.id_user]}
              />
            </Box>
          );
        })}
      </Box>
    )
  }

  return (
    <Box  >
      {isLoadingMessages ?
        <Box margin={"50px 0"} height={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
          <Typography sx={{ mb: 1 }} variant="h2" fontWeight={400} fontSize={20}>Loading posts...</Typography>
          <CircularProgress thickness={4} />
        </Box>
        :
        <>
          {userPosts.length === 0 ?
            <Box margin={"50px 0"} height={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
              <Box padding={"10px"} border={`solid 1px ${dark}`} borderRadius={"40px"}>
                <PhotoCameraIcon style={{ fontSize: "40px" }} />
              </Box>
              <Typography fontSize={"26px"}>No posts yet</Typography>
            </Box>
            :
            userPosts[0] !== null && userPosts.map((post: IMessageParsed) => {
              const { _id } = post;
              return (
                <Box
                  key={"post-widget-" + _id}
                  margin={"20px"}
                  boxShadow={" 0 0 10px rgba(0, 0, 0, 0.1)"}
                  borderRadius={"30px"}
                >
                  <PostWidget
                    postId={post._id}
                    id_user={post.id_user}
                    msg={post.msg}
                    files={post.files}
                    likes={post.likes}
                    comments={post.comments}
                    userProfilePicture={allProfilePictures[post.id_user]}
                  />
                </Box>
              );
            })}
        </>
      }
    </Box>
  );
};

export default PostsWidget;
