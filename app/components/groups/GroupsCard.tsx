import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import LockIcon from '@mui/icons-material/Lock';
import GroupsIcon from '@mui/icons-material/Groups';
import { Box, Typography, CardMedia, Tooltip } from "@mui/material";
import { setSelectedGroup } from "/app/store/slices/messages/messagesSlice";
import { IGroup } from "/app/interfaces/Groups";
import { User } from "/app/interfaces";
import PopupWithButtons from "../common/PopupWithButtons";
import { apiCall } from "/app/utils/api/apiUtils";

type GroupsCardProps = {
  group: IGroup
};

export const GroupsCard: React.FC<GroupsCardProps> = ({ group }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.persisted.token);
  const user: User = useSelector((state: any) => state.persisted.user);

  const [openPopup, setOpenPopup] = useState(false);
  const [closePopup, setClosePopup] = useState(false);

  const onClickGroup = async () => {
    if (user.estado === 0) {
      toast.error("You must be registered to join a group")
      return
    }
    if (!group.miembros.find(miembro => miembro._id === user._id)) {
      setOpenPopup(true)
    } else {
      dispatch(setSelectedGroup({ selectedGroup: group }));
    }
  };

  const onClickPopup = async () => {
    const { status, data } = await apiCall({ type: "post", url: `/grupo/${group._id}/unir`, token });
    if (status === 200) {
      toast.success("Join the group")
      dispatch(setSelectedGroup({ selectedGroup: group }));
    }
  };

  const handlePopupClose = async () => {
    setClosePopup(prev => !prev)
  };
  useEffect(() => {
    setOpenPopup(false)
  }, [closePopup])

  return (
    <Tooltip title={group.descripcion}>
      <Box
        onClick={onClickGroup}
        paddingBottom={"10px"}
        margin={"0 20px"}
        height={"100%"}
        maxWidth={"300px"}
        sx={{
          boxShadow: 3,
          borderRadius: "30px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            opacity: 0.5,
          },
        }}>

        <CardMedia
          component="img"
          style={{
            objectFit: "cover",
            borderRadius: "30px",
            width: "100%",
            height: "150px",
            display: "block",
          }}
          alt="Group image"
          src={group.logo}
        />

        <Typography margin={"15px 20px 0 20px"} textAlign={"right"} variant={"h3"} fontSize={"18px"} fontWeight={"800"} fontFamily={"Montserrat"}>
          {group.nombre}
        </Typography>

        <Box flexGrow={1}></Box>

        <Box padding={"5px 20px"} width={"100%"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
          {group.userCanWrite ? <Box /> : <LockIcon style={{ fontSize: "12px" }} />}
          <Box display={"flex"} alignItems={"center"} >
            <GroupsIcon style={{ fontSize: "12px" }} />
            <Typography marginLeft={"3px"} textAlign={"right"} variant={"body1"} fontSize={"9px"} fontWeight={"500"} fontFamily={"Montserrat"}>
              {group.miembros.length}
            </Typography>
          </Box>
        </Box>

        <PopupWithButtons
          openPopup={openPopup}
          handlePopupClose={handlePopupClose}
          onAcceptButton={onClickPopup}
          text="Do you want to join this group?"
          textButtonAccept="Yes"
          textButtonDeny="No"
        />
      </Box >
    </Tooltip >
  );
};
