import React from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, Typography, useTheme } from '@mui/material'
import { MyPalette } from '/app/themes/types';

interface Props {
  openPopupShowText: boolean;
  handlePopupShowTextClose: () => void;
  title: string;
  text: string;
}
const PopupShowText: React.FC<Props> = ({ openPopupShowText, handlePopupShowTextClose, title, text }) => {
  const { palette } = useTheme<MyPalette>();
  const ultraLight = palette.greyscale.ultraLight;
  const lightDark = palette.background.lightDark;

  return (
    <Dialog
      open={openPopupShowText}
      onClose={handlePopupShowTextClose}
      PaperProps={{ style: { borderRadius: "20px" } }}
    >
      <DialogContent >
        <Box padding={"20px"} minWidth={"500px"}>
          <Typography variant='h3' marginBottom={"10px"}>
            {title}
          </Typography>
          <Typography variant='h5'>
            {text}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: "20px", display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={handlePopupShowTextClose}
          sx={{ padding: "10px 30px", bgcolor: ultraLight, ":hover": { bgcolor: lightDark } }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PopupShowText