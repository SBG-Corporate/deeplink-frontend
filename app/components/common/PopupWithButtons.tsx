import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, Typography, useTheme } from '@mui/material'
import { MyPalette } from '/app/themes/types';

interface Props {
  openPopup: boolean;
  handlePopupClose: any;
  onAcceptButton: any;
  text: string;
  textButtonAccept?: string;
  textButtonDeny?: string;
}
const PopupWithButtons: React.FC<Props> = ({ openPopup, handlePopupClose, onAcceptButton, text, textButtonAccept = "Accept", textButtonDeny = "Cancel" }) => {
  const { palette } = useTheme<MyPalette>();
  const ultraLight = palette.greyscale.ultraLight;
  const lightDark = palette.background.lightDark;

  const handlePopupAcceptButton = () => {
    onAcceptButton()
    handlePopupClose()
  }

  return (
    <Dialog
      maxWidth="md"
      open={openPopup}
      onClose={handlePopupClose}
      PaperProps={{ style: { padding: "10px", borderRadius: "20px" } }}
    >
      <DialogContent >
        <Typography variant='h5'>
          {text}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: "20px", display: 'flex', justifyContent: 'center' }}>
        <Button
          sx={{
            backgroundColor: "#ffecec",
            color: "black",
            "&:hover": {
              backgroundColor: "#FFBFBF",
            },
          }}
          variant={"contained"}
          onClick={handlePopupClose}
        >
          {textButtonDeny}
        </Button>
        <Button
          onClick={handlePopupAcceptButton}
          sx={{ bgcolor: ultraLight, ":hover": { bgcolor: lightDark } }}
        >
          {textButtonAccept}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PopupWithButtons