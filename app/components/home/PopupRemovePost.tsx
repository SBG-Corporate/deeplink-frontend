import { FC } from 'react'
import { Button, Dialog, DialogActions, DialogContent, Typography, useTheme } from '@mui/material'
import { MyPalette } from '/app/themes/types';

interface Props {
  openPopupRemovePost: boolean;
  handlePopupRemovePostClose: () => void;
  onDeletePost: () => void;
  text: string;
}

const PopupRemovePost: FC<Props> = ({ openPopupRemovePost, handlePopupRemovePostClose, onDeletePost, text }) => {
  const { palette } = useTheme<MyPalette>();
  const ultraLight = palette.greyscale.ultraLight;
  const lightDark = palette.background.lightDark;

  const handleRemovePost = async () => {
    onDeletePost()
    handlePopupRemovePostClose()
  }

  return (
    <Dialog
      maxWidth="lg"
      open={openPopupRemovePost}
      onClose={handlePopupRemovePostClose}
      PaperProps={{ style: { borderRadius: "20px" } }}
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
          onClick={() => { handleRemovePost() }}>
          Delete
        </Button>
        <Button
          onClick={handlePopupRemovePostClose} sx={{ bgcolor: ultraLight, ":hover": { bgcolor: lightDark } }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PopupRemovePost