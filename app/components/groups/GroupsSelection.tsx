import { FC } from "react";
import { Box, Grid, Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { IGroup } from "/app/interfaces/Groups";
import { GroupsCard } from "/app/components/groups/GroupsCard";
import { AddGroupButton } from "/app/components/groups/AddGroupButton";

type Props = {
  isFetchingGroups: boolean;
};

export const GroupsSelection: FC<Props> = ({ isFetchingGroups }) => {
  const filteredGroups: IGroup[] = useSelector((state: any) => state.messagesSlice.filteredGroups);

  return (
    <Box
      p={"10px"}
      marginTop={"-30px"}
      width={"100%"}
    >
      {isFetchingGroups ? <>
        <Grid container >
          {[0, 1, 2, 3, 4, 5].map((index) => {
            return (
              <Grid key={index} item marginTop={"30px"} xs={12} md={6} lg={4} xl={3}>
                <Box margin="10px 10px -5px 10px" >
                  <Skeleton variant="rectangular" height={140} />
                  <Skeleton variant="text" height={60} width="100%" sx={{ marginTop: "-10px" }} />
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </>
        :
        <>
          <Grid container  >
            {filteredGroups !== null && filteredGroups.map((group: IGroup, index: number) => {
              return (
                <Grid item key={`group-card-${index}`} marginTop={"30px"} xs={12} md={6} lg={4} xl={3}>
                  <GroupsCard group={group} />
                </Grid>
              )
            })}
            <Grid item marginTop={"30px"} xs={12} md={6} lg={4} xl={3}>
              <Box
                margin={"0 20px"}
                height={"100%"}
                maxWidth={"300px"}
              >
                <AddGroupButton />
              </Box>
            </Grid>
          </Grid>
        </>}
    </Box >
  );
};