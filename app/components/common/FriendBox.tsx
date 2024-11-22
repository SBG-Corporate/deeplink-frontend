import React from "react";
import NextLink from "next/link"
import toast from "react-hot-toast";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "/app/store/slices/user/userSlice";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { apiAddFriend, apiDeleteFriend, apiPing } from "/app/utils/api/apiUsuarios";
import { MyPalette } from "/app/themes/types"

interface Props {
  friendId: string;
  name: string;
  subtitle: string;
  userProfilePicture: string;
}

const FriendBox: React.FC<Props> = ({ friendId, name, subtitle, userProfilePicture }) => {
  const dispatch = useDispatch();
  const friendsIds = useSelector((state: any) => state.persisted.user?.friendsIds) || [];
  const token = useSelector((state: any) => state.persisted.token) || "";
  const user = useSelector((state: any) => state.persisted.user);
  const isFriend = friendsIds.find((friend: string) => friend === friendId);
  const { palette } = useTheme<MyPalette>();
  const primaryLight = palette.greyscale.ultraLight;
  const primaryDark = palette.neutral.dark;
  const main = palette.neutral.main;

  const patchFriend = async () => {
    if (user.estado === 0) {
      toast.error("You must be registered in to follow a user")
      return
    }
    let status, data;
    if (friendsIds.includes(friendId)) {
      ({ status, data } = await apiDeleteFriend({ friendId, token }));
    } else {
      ({ status, data } = await apiAddFriend({ friendId, token }));
    }
    dispatch(setFriends({ friendsIds: data.amigos }));
  };


  return (
    <FlexBetween>
      <Box width={"40px"}>
        <NextLink href={`/profile/${friendId}`} passHref style={{ color: 'inherit', textDecoration: 'none' }}>
          <UserImage image={userProfilePicture} size="40px" />
        </NextLink>
      </Box>
      <Box margin={"0 10px"} width={"100%"} display={"flex"} justifyContent={"start"} alignItems={"center"}>
        <NextLink href={`/profile/${friendId}`} passHref style={{ color: 'inherit', textDecoration: 'none' }}>
          <Typography
            color={main}
            variant="body1"
            fontSize={"14px"}
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
        </NextLink>
      </Box>
      {friendId !== user._id &&
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark, fontSize: "16px" }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark, fontSize: "16px" }} />
          )}
        </IconButton>
      }
    </FlexBetween>
  );
};

export default FriendBox;
