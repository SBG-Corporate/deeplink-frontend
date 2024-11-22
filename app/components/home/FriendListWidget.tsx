import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";
import FriendBox from "app/components/common/FriendBox";
import { Friend } from "/app/interfaces"
import { MyPalette } from '/app/themes/types';

interface Props {
  userId: string;
  friendsIds: string[];
}

const FriendListWidget: React.FC<Props> = ({ userId, friendsIds }) => {
  const { palette } = useTheme<MyPalette>();
  const friendsListInfo = useSelector((state: any) => state.persisted?.friendsListInfo);

  return (
    <Box margin={"10px"}>
      {friendsListInfo !== undefined && friendsListInfo.length !== 0 && Array.isArray(friendsListInfo) &&
        <>
          <Typography
            color={palette.neutral.dark}
            variant="h5"
            fontWeight="500"
            sx={{ mb: "10px" }}
          >
            Following List
          </Typography>
          <Box display="flex" flexDirection="column" gap="5px">
            {friendsListInfo.map((friend: Friend) => (
              <FriendBox
                key={"friend-box-" + friend._id}
                friendId={friend._id}
                name={friend.alias}
                subtitle={friend.alias}
                userProfilePicture={friend.profilePicture}
              />
            ))}
          </Box>
        </>
      }
    </Box>
  );
};

export default FriendListWidget;
