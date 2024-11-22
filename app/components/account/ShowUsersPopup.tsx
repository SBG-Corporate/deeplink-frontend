import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Box, Button, Card, CardMedia, Dialog, DialogActions, DialogContent, Typography, useTheme } from '@mui/material'
import { BoxLoading } from '../ui/BoxLoading';
import { apiAddFriend, apiDeleteFriend, getUsersByIds } from '/app/utils/api/apiUsuarios';
import { setFriends } from '/app/store/slices/user/userSlice';
import { MyPalette } from '/app/themes/types';

interface Props {
  showUsersPopup: boolean;
  onClose: () => void;
  title: string;
  usersIds: string[];
}

export const ShowUsersPopup: React.FC<Props> = ({ showUsersPopup, onClose, title, usersIds }) => {
  const router = useRouter()
  const theme = useTheme<MyPalette>();
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.persisted.token);
  const user = useSelector((state: any) => state.persisted.user);

  const [usersInfo, setusersInfo] = useState([])
  const [updateInfo, setUpdateInfo] = useState(false);

  const dark = theme.palette.neutral.dark;
  const light = theme.palette.greyscale.ultraLight;
  const paper = theme.palette.background.paper;

  const onFollowUser = async (userToAddId: string) => {
    if (!user) {
      toast.error("You must be registered in to follow a user");
      return;
    }
    let status, data;
    if (user.friendsIds.includes(userToAddId)) {
      ({ status, data } = await apiDeleteFriend({ friendId: userToAddId, token }));
    } else {
      ({ status, data } = await apiAddFriend({ friendId: userToAddId, token }));
    }
    setUpdateInfo(prev => !prev)
    dispatch(setFriends({ friendsIds: data.amigos }));
  }

  const getUsersInfo = async () => {
    try {
      const { data } = await getUsersByIds({ token, usersIds });
      setusersInfo(data)
    } catch (error) {
      console.log('error when sending email to api: ', error);
    }
  };

  useEffect(() => {
    if (usersIds.length !== 0)
      getUsersInfo()
  }, [usersIds, updateInfo])

  return (
    <Dialog
      maxWidth="lg"
      open={showUsersPopup}
      onClose={onClose}
      PaperProps={{ style: { maxHeight: "700px", borderRadius: "20px" } }}
    >
      <DialogContent >
        {title !== "" &&
          <Typography variant="h2">
            {title}
          </Typography>
        }
        {usersInfo.length === 0 ?
          <BoxLoading /> :
          usersInfo.map((userToShow: any, index: number) => {
            return (
              <Card key={index} sx={{ width: "250px", margin: "20px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", borderRadius: '20px' }}>
                <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                  <Box width={"75px"}>
                    <CardMedia
                      image={userToShow.fotoPerfil}
                      component='img'
                      alt='User profile picture'
                      sx={{ width: "55px", height: "55px", padding: "5px", borderRadius: "150px" }}
                    />
                  </Box>
                  <Box width={"100%"} marginLeft={"10px"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                    <Box display={"flex"} flexDirection={"column"} >
                      <Typography variant="body1" fontSize={"12px"} color={dark} onClick={() => { router.push(`/profile/${userToShow._id}`); onClose() }} sx={{ ":hover": { cursor: "pointer", fontWeight: 600 } }}>{userToShow.alias}</Typography>
                    </Box>
                    <Box marginRight={"15px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                      {user._id !== userToShow._id &&
                        <Typography
                          variant="body1"
                          fontSize={"12px"}
                          color={user.friendsIds.includes(userToShow._id) ? "#9F0000" : "#0000BF"}
                          onClick={() => onFollowUser(userToShow._id)}
                          sx={{ cursor: "pointer" }}>
                          {user.friendsIds.includes(userToShow._id) ? "Unfollow" : "Follow"}
                        </Typography>
                      }
                    </Box>
                  </Box>
                </Box>
              </Card>
            )
          })
        }
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'center', bgcolor: light }}>
        <Button color="primary" onClick={onClose} sx={{ padding: "5px 30px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", borderRadius: '20px', bgcolor: paper }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}