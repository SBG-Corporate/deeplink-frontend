import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { Box, useMediaQuery } from "@mui/material";
import { getUserById } from "/app/utils/api/apiUsuarios";
import { User } from "/app/interfaces";
import { parseUser } from "/app/utils/api/parseApiData";
import { MainLayout } from "/app/components/layouts";
import { apiGetMessageById, apiIncreaseViews } from "/app/utils/api/apiMessages";
import PostWidget from "/app/components/home/PostWidget";
import { FullScreenLoading } from "/app/components/common/FullScreenLoading";
import { ApiPost } from "/app/interfaces";

const ProfilePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const router = useRouter()
  const { postId } = router.query
  const token = useSelector((state: any) => state.persisted.token);
  const user = useSelector((state: any) => state.persisted.user);

  const [userData, setUserData] = useState<User>()
  const [postData, setPostData] = useState<ApiPost>()

  const getUserData = async () => {
    if (postId === undefined) return

    const response = await apiGetMessageById(postId.toString(), token)
    setPostData(response.data)
    const { status, data } = await getUserById({ userId: response.data.id_user, token })
    const parsedUser = parseUser(data)
    setUserData(parsedUser)
  };

  useEffect(() => {
    getUserData()
  }, [postId]);

  useEffect(() => {
    const increaseViews = async () => {
      const { status, data } = await apiIncreaseViews(postData ? postData._id : "", token, "msg")
    };

    if (postData === undefined) return

    if (!postData.views.includes(user._id)) {
      increaseViews()
    }
  }, [postData]);


  return (
    <MainLayout
      title={'DeepLink user post edit'}
      pageDescription={'DeepLink user post edit page'}
    >

      <Box
        width="calc(100vw - 100px)"
        marginLeft={"100px"}
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box
          marginBottom={"40px"}
          width={"100%"}
          maxWidth={"700px"}
          borderRadius={"20px"}
          boxShadow={"0 0 10px rgba(0, 0, 0, 0.1)"}
          height={"100%"}
        >

          {postData !== undefined && userData !== undefined && userData.profilePicture !== undefined ? (
            <PostWidget
              postId={postData._id}
              id_user={postData.id_user}
              msg={postData.msg}
              files={postData.files}
              likes={postData.likes}
              comments={postData.comments}
              userProfilePicture={userData.profilePicture}
              showComments={true}
            />
          ) : (
            <FullScreenLoading />
          )}

        </Box>
      </Box>
    </MainLayout>
  );
};

export default ProfilePage;
