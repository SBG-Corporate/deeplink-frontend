import { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Box, Dialog, DialogContent, DialogContentText, DialogActions, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ActionButton } from './ActionButton';
import { User } from '/app/interfaces';

interface Props {
  openPopup: boolean;
  handlePopupClose: () => void;
  handleLeftArrowClick: () => void
  handleRightArrowClick: () => void
}

const PopupCreateNovaWallet: React.FC<Props> = ({ openPopup, handlePopupClose, handleLeftArrowClick, handleRightArrowClick }) => {
  const themeMode = useSelector((state: any) => state.persisted?.themeMode);
  const user: User = useSelector((state: any) => state.persisted?.user);

  const [isLoading1, setisLoading1] = useState(false)
  const [isLoading2, setisLoading2] = useState(false)
  const [isLoading3, setisLoading3] = useState(false)

  const onClickStep1 = async () => {
    setisLoading1(true)
    if (user.estado === 0) {
      toast.error("You must be registered to claim a challenge")
    }
    setisLoading1(false)
  };

  const onClickStep2 = async () => {
    setisLoading2(true)
    if (user.estado === 0) {
      toast.error("You must be registered to claim a challenge")
    }
    setisLoading2(false)
  };

  const onClickStep3 = async () => {
    setisLoading3(true)
    if (user.estado === 0) {
      toast.error("You must be registered to claim a challenge")
    }
    setisLoading3(false)
  };

  return (
    <Dialog
      fullWidth
      open={openPopup}
      onClose={handlePopupClose}
      maxWidth="md"
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '50px',
        }
      }}
    >
      <Box padding={"10px 40px"}>
        <Box width={"100%"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
          <Box padding={"10px 30px"} sx={{ backgroundColor: themeMode === "dark" ? "#004000" : "#ecffe5" }} borderRadius={"30px"} >OPEN</Box>
          <DialogActions>
            <Box >
              <IconButton onClick={handlePopupClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogActions>
        </Box>
        <DialogContent >
          <DialogContentText sx={{ fontSize: "80px", fontWeight: "900", fontFamily: "Montserrat" }}>
            {"Create a"}
          </DialogContentText>
          <DialogContentText sx={{ marginTop: "-40px", fontSize: "80px", fontWeight: "900", fontFamily: "Montserrat" }}>
            {"NOVA wallet"}
          </DialogContentText>
          <Box display={"flex"} flexDirection={"row"}>
            <Box>
              <DialogContentText sx={{ fontSize: "18px" }}>
                {"Create a NOVA wallet and connected it to DeepLink."}
              </DialogContentText>
              <DialogContentText sx={{ fontSize: "18px" }}>
                {"Thanks to this wallet you will be able to claim exclusive bounties."}
              </DialogContentText>
              <Box margin={"-10px 0"} display={"flex"} alignItems={"center"} flexDirection={"row"}>
                <Typography marginRight={"10px"} color={"#e0e0e0"} fontSize={"80px"} fontFamily={"Montserrat"} fontWeight={900}>1</Typography>
                <ActionButton
                  text={"Download NOVA wallet"}
                  isLoading={isLoading1}
                  isNonMobileScreens={true}
                  backgroundColor={"#ffffff"}
                  hooverBackgroundColor={"#e0e0e0"}
                  textColor={"black"}
                  onClick={onClickStep1}
                />
              </Box>
              <Box margin={"-30px 0"} display={"flex"} alignItems={"center"} flexDirection={"row"}>
                <Typography marginRight={"10px"} color={"#e0e0e0"} fontSize={"80px"} fontFamily={"Montserrat"} fontWeight={900}>2</Typography>
                <ActionButton
                  text={"Verify"}
                  isLoading={isLoading2}
                  isNonMobileScreens={true}
                  backgroundColor={"#ffffff"}
                  hooverBackgroundColor={"#e0e0e0"}
                  textColor={"black"}
                  onClick={onClickStep2}
                />
              </Box>
              <Box margin={"-30px 0 0 0"} display={"flex"} alignItems={"center"} flexDirection={"row"}>
                <Typography marginRight={"10px"} color={"#e0e0e0"} fontSize={"80px"} fontFamily={"Montserrat"} fontWeight={900}>3</Typography>
                <ActionButton
                  text={"Claim 0.5 BELLS"}
                  isLoading={isLoading3}
                  isNonMobileScreens={true}
                  backgroundColor={"#ffffff"}
                  hooverBackgroundColor={"#e0e0e0"}
                  textColor={"black"}
                  onClick={onClickStep3}
                />
              </Box>
            </Box>
            <Box>
              <img src="https://cdn-icons-png.flaticon.com/512/2224/2224889.png" width={"400px"} alt="Plant pot image" />
              <Box display={"flex"} justifyContent={"center"}>
                <Typography marginRight={"10px"} fontSize={"16px"}>Available: 115/2.500</Typography>
              </Box>
            </Box>
          </Box>
          <IconButton
            sx={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1
            }}
            onClick={handleLeftArrowClick}
          >
            <ArrowBackIos />
          </IconButton>
          <IconButton
            sx={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1
            }}
            onClick={handleRightArrowClick}
          >
            <ArrowForwardIos />
          </IconButton>
        </DialogContent>
      </Box>
    </Dialog>
  );
}

export default PopupCreateNovaWallet;
