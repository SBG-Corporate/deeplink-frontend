import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";
import { LastPage } from "@mui/icons-material";
import { apiPing } from "/app/utils/api/apiUsuarios";
import { setAllGroups, setFilteredGroups } from "/app/store/slices/messages/messagesSlice";
import { IGroup } from "/app/interfaces/Groups";
import { setPageType } from "/app/store/slices/user/userSlice";
import { CheckTokenExpiresLayout } from "/app/components/common/CheckTokenExpiresLayout";
import GroupsFiltersNavbar from "/app/components/groups/GroupsFiltersNavbar";
import { MainLayout } from "/app/components/layouts";
import { apiCall } from "/app/utils/api/apiUtils";
import { User } from "/app/interfaces";
import { GroupsLateralBar } from "/app/components/groups/GroupsLateralBar";
import { GroupsArea } from "/app/components/groups/GroupsArea";


const GroupsPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const user: User = useSelector((state: any) => state.persisted?.user);
  const themeMode = useSelector((state: any) => state.persisted?.themeMode);
  const token = useSelector((state: any) => state.persisted?.token) || null;
  const selectedGroup: IGroup | null = useSelector((state: any) => state.messagesSlice.selectedGroup);

  const [isFetchingGroups, setIsFetchingGroups] = useState(false);
  const [groupFilter, setGroupFilter] = useState("yourGroups");

  useEffect(() => {
    const getAllGroups = async () => {
      setIsFetchingGroups(true)
      await apiPing()
      const { status, data } = await apiCall({ type: "get", url: "/grupo?full=true", token });
      if (status !== 200) { console.log("error, status: ", status, " data: ", data); setIsFetchingGroups(false); return; }

      dispatch(setAllGroups({ allGroups: data }));
      let filteredGroups = data.filter((group: IGroup) => group.miembros.find(miembro => miembro._id === user._id))
      if (groupFilter !== "yourGroups") {
        filteredGroups = data.filter((group: IGroup) => group.category === groupFilter)
      }
      dispatch(setFilteredGroups({ filteredGroups }));
      setIsFetchingGroups(false);
    };
    getAllGroups();
  }, [groupFilter, selectedGroup])

  useEffect(() => {
    dispatch(setPageType({ pageType: "groups", }));
  }, []);


  return (
    <MainLayout
      title={'DeepLink groups'}
      pageDescription={'DeepLink groups page'}
    >
      <CheckTokenExpiresLayout />
      <Box marginLeft={"90px"}>
        <Box
          marginRight={"30px"}
          padding={"10px 20px"}
          marginTop={"30px"}
          display={"flex"}
          flexDirection={"column"}
          width={"calc(100vw - 100px)"}
          sx={{ backgroundColor: theme.palette.background.paper }}
        >
          <Box >
            <Typography
              margin={"-45px 0  0 10px"}
              fontFamily={"Montserrat"}
              fontWeight={"600"}
              fontSize={"50px"}
              color={themeMode === "light" ? "#dedede" : "#202223"}
              sx={{ zIndex: "90" }}
            >
              Groups <LastPage sx={{ marginLeft: "-15px", fontSize: "34px" }} />
            </Typography>
          </Box>
          <Box
            marginRight={"30px"}
            flexDirection={!selectedGroup ? "column" : "row"}
            display={"flex"}
            width={"100%"}
            maxWidth="1200px"
            boxShadow={" 0 0 10px rgba(0, 0, 0, 0.1)"}
            borderRadius={"30px"}
          >
            {selectedGroup === null &&
              <GroupsFiltersNavbar
                groupFilter={groupFilter}
                setGroupFilter={setGroupFilter}
              />
            }
            {selectedGroup !== null &&
              <GroupsLateralBar pageType="groups" />
            }
            <GroupsArea isFetchingGroups={isFetchingGroups} />
          </Box>
        </Box>
      </Box>

    </MainLayout >
  );
};

export default GroupsPage;
