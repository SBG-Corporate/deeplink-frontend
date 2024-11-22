import { FC } from 'react';
import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'


interface Props {
  openPopupRemovePost: boolean;
  handlePopupRemovePostClose: () => void;
  onDeletePost: () => void;
  text: string;
}
const PopupRemovePost: FC<Props> = ({ openPopupRemovePost, handlePopupRemovePostClose, onDeletePost, text }) => {
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
              backgroundColor: "#7c0a00",
              color: "white"
            },
          }}
          variant={"contained"}
          onClick={() => { handleRemovePost() }}>
          Eliminar
        </Button>
        <Button
          variant={"contained"} onClick={handlePopupRemovePostClose}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PopupRemovePost