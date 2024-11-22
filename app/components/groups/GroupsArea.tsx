import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import LockIcon from '@mui/icons-material/Lock';
import { Box, Typography, useTheme, Button, Divider, List, } from "@mui/material";
import { GroupsSelection } from "app/components/groups/GroupsSelection";
import { IGroup } from "/app/interfaces/Groups";
import { MessagesAreaGroup } from "./MessagesAreaGroup";
import { SendMessage } from "../messages";
import PopupWithButtons from "../common/PopupWithButtons";
import { apiCall } from "/app/utils/api/apiUtils";
import { setSelectedGroup } from "/app/store/slices/messages/messagesSlice";

type GroupsAreaProps = {
  isFetchingGroups: boolean;
};

export const GroupsArea: React.FC<GroupsAreaProps> = ({ isFetchingGroups }) => {
  const theme = useTheme();
  const medium = theme.palette.neutral.medium;
  const dispatch = useDispatch();
  const selectedGroup: IGroup = useSelector((state: any) => state.messagesSlice.selectedGroup);
  const token = useSelector((state: any) => state.persisted?.token);
  const user = useSelector((state: any) => state.persisted?.user);

  const [openPopup, setOpenPopup] = useState(false);

  const onClickPopup = async () => {
    const { status, data } = await apiCall({ type: "post", url: `/grupo/${selectedGroup._id}/salir`, token });
    if (status === 200) {
      toast.success("Left the group")
      dispatch(setSelectedGroup({ selectedGroup: null }));
    }
  };

  return (
    <Box sx={{
      padding: "10px",
      width: "100%",
      height: "100%",
      borderRadius: "30px",
      display: "flex",
      flexDirection: "column",
      gap: "100px",
    }}>
      {selectedGroup ?
        <Box width={"100%"} height={"100%"}>
          <Box >
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography
                fontWeight={"bold"}
                fontSize={"24px"}
                color={medium}>
                Group: {selectedGroup && selectedGroup.nombre}
              </Typography>
              <Button sx={{ bgcolor: "#FFDFDF", borderRadius: "10px" }} onClick={() => setOpenPopup(true)}>
                Exit group
              </Button>
            </Box>
            {!selectedGroup.userCanWrite &&
              <Box marginBottom={"-5px"} display={"flex"} alignItems={"center"}>
                <LockIcon style={{ fontSize: "14px" }} />
                <Typography>Private group (only creator can write)</Typography>
              </Box>
            }
            <Divider sx={{ padding: "5px" }} />
            <List style={{ overflow: 'auto' }} >
              <MessagesAreaGroup />
            </List>
          </Box>
          {(selectedGroup.userCanWrite || selectedGroup.creador === user._id) &&
            <SendMessage pageType={"group"} />
          }
        </Box>
        :
        <GroupsSelection isFetchingGroups={isFetchingGroups} />
      }
      <PopupWithButtons
        openPopup={openPopup}
        handlePopupClose={() => { setOpenPopup(false) }}
        onAcceptButton={onClickPopup}
        text={"Do you want to exit this group?"}
        textButtonAccept={"Yes"}
        textButtonDeny={"No"}
      />
    </Box >
  );
};