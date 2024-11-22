import React, { useContext } from "react";
import { Box, Skeleton, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MyPostWidget from "app/components/home/MyPostWidget";
import PostsWidget from "app/components/home/PostsWidget";
import { useRouter } from 'next/router'
import { User } from "/app/interfaces";
import { parseUser } from "/app/utils/api/parseApiData";
import { apiCall } from "/app/utils/api/apiUtils";
import { MainLayout } from "/app/components/layouts";
import { MessagesContext } from "/app/context/messages";
import { apiIncreaseViews } from "/app/utils/api/apiMessages";
import { ShowUsersPopup } from "/app/components/account/ShowUsersPopup";
import UserWidget from "/app/components/home/UserWidget";

const ProfilePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const router = useRouter()
  const { userId } = router.query
  const token = useSelector((state: any) => state.persisted.token);
  const user = useSelector((state: any) => state.persisted.user);
  const { isLoadingMessages } = useContext(MessagesContext);

  const [userSelectedData, setUserSelectedData] = useState<User>()
  const [showUsersPopup, setShowUsersPopup] = useState(false);
  const [textUsersPopup, setTextUsersPopup] = useState("");
  const [usersIdsPopup, setUsersIdsPopup] = useState<string[]>([]);


  const openShowUsersPopup = (text: string) => {
    setShowUsersPopup(true)
    setTextUsersPopup(text)
    if (text === "Following") { setUsersIdsPopup(userSelectedData ? userSelectedData.friendsIds : []) }
    if (text === "Followers") { setUsersIdsPopup(userSelectedData ? userSelectedData.followers : []) }
    if (text === "Viewers") { setUsersIdsPopup(userSelectedData ? userSelectedData.views : []) }
  };

  const getUserData = async () => {
    const { status, data } = await apiCall({ type: "get", url: `/user/getUserById/${userId}`, token })
    const parsedUser = parseUser(data)
    setUserSelectedData(parsedUser)
  };

  useEffect(() => {
    if (userId === undefined) return

    getUserData()
  }, [userId]);


  useEffect(() => {
    const increaseViews = async () => {
      const { status, data } = await apiIncreaseViews(userSelectedData ? userSelectedData._id : "", token, "user")
    };

    if (userSelectedData === undefined) { return }
    if (user._id === userSelectedData._id) { return }
    if (userSelectedData.views.includes(user._id)) { return }

    increaseViews()
  }, [userSelectedData]);

  console.log('userSelectedData: ', userSelectedData);


  return (
    <MainLayout
      title={'DeepLink profile'}
      pageDescription={'DeepLink user profile page'}
    >
      <Box
        width="calc(100vw - 110px)"
        marginLeft={"100px"}
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box
          padding={"10px 10px 30px 10px"}
          borderRadius={"20px"}
          boxShadow={"0 0 10px rgba(0, 0, 0, 0.1)"}
          width={"350px"}
          height={"100%"}
        >
          {userSelectedData !== undefined &&
            <UserWidget
              isVerified={userSelectedData !== undefined ? userSelectedData.isVerified : false}
              alias={userSelectedData !== undefined ? userSelectedData.alias : ""}
              friendsIds={userSelectedData !== undefined ? userSelectedData.friendsIds : []}
              userId={userSelectedData !== undefined ? userSelectedData._id : ""}
              profilePicture={userSelectedData !== undefined ? userSelectedData.profilePicture : "https://deeplink-uploads.s3.eu-west-3.amazonaws.com/public/userProfile.png"}
              selectedUser={userSelectedData}
            />
          }
          <Box />

          <Box marginLeft={"20px"}>
            <Typography onClick={() => openShowUsersPopup("Following")} marginTop={"10px"} sx={{ ":hover": { fontWeight: 600, cursor: "pointer", textDecoration: "underline" } }}>{userSelectedData && userSelectedData.friendsIds && userSelectedData.friendsIds.length} {"Following"}</Typography>
            <Typography onClick={() => openShowUsersPopup("Followers")} marginTop={"10px"} sx={{ ":hover": { fontWeight: 600, cursor: "pointer", textDecoration: "underline" } }}>{userSelectedData && userSelectedData.followers && userSelectedData.followers.length} {"Followers"}</Typography>
          </Box>
        </Box>
        <Box
          width={"100%"}
          maxWidth={"700px"}
          borderRadius={"20px"}
          boxShadow={"0 0 10px rgba(0, 0, 0, 0.1)"}
          height={"100%"}
        >
          {userSelectedData !== undefined && userSelectedData._id === user._id &&
            <MyPostWidget profilePicture={userSelectedData !== undefined ? userSelectedData.profilePicture : ""} />
          }
          {isLoadingMessages ? <>
            <Box width={"100%"} padding={"20px"} >
              <Skeleton variant="text" height={30} width="100%" sx={{ marginTop: "35px" }} />
              <Skeleton variant="text" height={60} width="100%" sx={{ marginTop: "-10px" }} />
              <Skeleton variant="rectangular" height={60} sx={{ marginTop: "-5px" }} />
              <Skeleton variant="text" height={30} width="100%" sx={{ marginTop: "35px" }} />
              <Skeleton variant="text" height={60} width="100%" sx={{ marginTop: "-10px" }} />
              <Skeleton variant="rectangular" height={180} sx={{ marginTop: "-5px" }} />
            </Box>
          </> :
            <PostsWidget userId={userId === undefined ? user._id : userId} />
          }
        </Box>

        {showUsersPopup &&
          <ShowUsersPopup
            showUsersPopup={showUsersPopup}
            onClose={() => setShowUsersPopup(false)}
            title={textUsersPopup}
            usersIds={usersIdsPopup}
          />
        }
      </Box>
    </MainLayout>
  );
};

export default ProfilePage;
