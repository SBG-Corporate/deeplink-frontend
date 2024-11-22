import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, useTheme, IconButton, } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { IGroup } from '/app/interfaces';
import { GroupButton, AddChatButton } from "app/components/messages";
import { setSelectedGroup } from '/app/store/slices/messages/messagesSlice';
import { User } from '/app/interfaces';

interface Props {
  pageType: string;
};

export const GroupsLateralBar: FC<Props> = ({ pageType = "message" }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const selectedGroup: IGroup | null = useSelector((state: any) => state.messagesSlice.selectedGroup);
  const allGroups: IGroup[] = useSelector((state: any) => state.messagesSlice.allGroups);
  const user: User = useSelector((state: any) => state.persisted.user);
  const [myGroups, setMyGroups] = useState<IGroup[]>([]);

  useEffect(() => {
    const myGroups = allGroups.filter(group => group.miembros.find(miembro => miembro._id === user._id))
    setMyGroups(myGroups)
  }, [allGroups, selectedGroup])

  return (
    <Box
      sx={{
        padding: "10px",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "0 0 0 0.75rem",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
      }}
      height={"100%"}
    >
      <Box padding={"20px"}>
        <IconButton onClick={() => dispatch(setSelectedGroup({ selectedGroup: null }))}>
          <ArrowBackIosIcon />
        </IconButton>
      </Box>

      <Box display={"flex"} justifyContent={"start"} alignItems={"center"} flexDirection={"column"} sx={{ height: "calc(100vh - 375px)", width: "80px", overflowY: 'auto' }}>
        {myGroups.map((group, index) => {
          return (
            <Box key={"chat-" + index} paddingBottom={"5px"}>
              <GroupButton
                onClick={() => dispatch(setSelectedGroup({ selectedGroup: group }))}
                imageUrl={group.logo}
                isSelected={selectedGroup && selectedGroup._id === group._id ? true : false}
                tooltipText={group.nombre}
              />
            </Box>
          )
        })}
      </Box>

      <Box p={"10px 0"} >
        <AddChatButton pageType={"group"} />
      </Box>
    </Box >
  )
};


