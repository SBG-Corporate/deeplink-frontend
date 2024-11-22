import { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Box, Dialog, DialogContent, DialogContentText, DialogActions, IconButton, Typography, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { ActionButton } from './ActionButton';
import { User } from '/app/interfaces';

interface Props {
  openPopup: boolean;
  handlePopupClose: () => void;
  handleLeftArrowClick: () => void
  handleRightArrowClick: () => void
}

const PopupCreateThoughtsOnTrezor: React.FC<Props> = ({ openPopup, handlePopupClose, handleLeftArrowClick, handleRightArrowClick }) => {
  const themeMode = useSelector((state: any) => state.persisted?.themeMode);
  const user: User = useSelector((state: any) => state.persisted?.user);

  const [isLoading, setisLoading] = useState(false)
  const [inputText, setInputText] = useState("")

  const onClickStep = async () => {
    setisLoading(true)
    if (user.estado === 0) {
      toast.error("You must be registered to claim a challenge")
    }
    setisLoading(false)
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
          <Box display={"flex"} gap={"5px"}>
            <Box padding={"10px 30px"} sx={{ backgroundColor: themeMode === "dark" ? "#004000" : "#ecffe5" }} borderRadius={"30px"} >OPEN</Box>
            <Box padding={"10px 30px"} sx={{ backgroundColor: themeMode === "dark" ? "#1a43bf" : "#e4fff9" }} borderRadius={"30px"} >SPONSORED</Box>
          </Box>
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
            {"Thoughts on"}
          </DialogContentText>
          <DialogContentText sx={{ marginTop: "-40px", fontSize: "80px", fontWeight: "900", fontFamily: "Montserrat" }}>
            {"New TREZOR"}
          </DialogContentText>
          <Box display={"flex"} flexDirection={"row"}>
            <Box>
              <Box display={"flex"}>
                <Box>
                  <DialogContentText sx={{ fontSize: "18px" }}>
                    {"Watch the review below and let us know what you think of the new Trezor model."}
                  </DialogContentText>
                  <Box margin={"20px 0"} display={"flex"} alignItems={"start"} flexDirection={"row"}>
                    <Typography marginRight={"10px"} color={"#e0e0e0"} fontSize={"80px"} fontFamily={"Montserrat"} fontWeight={900}>1</Typography>
                    <Box padding={"20px"} boxShadow={" 0 0 10px rgba(0, 0, 0, 0.1)"} borderRadius={"30px"}>
                      <Typography>Watch the review</Typography>
                      <Box margin={"10px"} padding={"20px"} boxShadow={" 0 0 10px rgba(0, 0, 0, 0.1)"} borderRadius={"30px"}>
                        <iframe width="200" height="115" src="https://www.youtube.com/embed/p2dfiy1dtkE" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <img src="https://cdn3d.iconscout.com/3d/premium/thumb/hand-holding-phone-7421700-6068036.png?f=webp" width={"400px"} alt="Plant pot image" />
                  <Box display={"flex"} justifyContent={"center"}>
                    <Typography marginTop={"10px"} marginRight={"10px"} fontSize={"16px"}>Available: 115/2.500</Typography>
                  </Box>
                </Box>
              </Box>
              <Box marginTop={"10px"} display={"flex"} alignItems={"center"} flexDirection={"row"}>
                <Typography marginRight={"10px"} color={"#e0e0e0"} fontSize={"80px"} fontFamily={"Montserrat"} fontWeight={900}>2</Typography>
                <Box width={"100%"} padding={"20px"} boxShadow={" 0 0 10px rgba(0, 0, 0, 0.1)"} borderRadius={"20px"}>
                  <Typography marginBottom={"10px"}>Write your opinion (min 500 words): </Typography>
                  <TextField
                    id="name-field"
                    label="···"
                    variant="outlined"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    multiline
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'transparent', // Removes the border
                        },
                        '&:hover fieldset': {
                          borderColor: 'transparent', // Removes the border on hover
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'transparent', // Removes the border when focused
                        },
                        borderRadius: '30px', // Sets the border radius
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Adds a boxShadow
                      },
                      // Conditional styling for the label
                      '& .MuiInputLabel-root': {
                        color: 'white',
                      },
                      '& .Mui-focused .MuiInputLabel-root': {
                        color: 'white',
                      }
                    }}
                  />
                </Box>
              </Box>
              <Box display={"flex"} justifyContent={"end"} margin={"20px 10px 0 0"}>
                <ActionButton
                  text={"Claim 0.5 BELLS"}
                  isLoading={isLoading}
                  isNonMobileScreens={true}
                  backgroundColor={"#ffffff"}
                  hooverBackgroundColor={"#e0e0e0"}
                  textColor={"black"}
                  onClick={onClickStep}
                />
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

export default PopupCreateThoughtsOnTrezor;
