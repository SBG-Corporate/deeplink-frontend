import { FC } from 'react'
import NextLink from 'next/link';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'

interface PopupEmailSentProps {
  openPopup: boolean;
  popupMessage: string;
  link: string;
  handlePopupClose: () => void;
}

const PopupEmailSent: FC<PopupEmailSentProps> = ({ openPopup, popupMessage, link, handlePopupClose }) => {
  return (
    <Dialog open={openPopup} onClose={handlePopupClose}>
      <DialogContent>
        <DialogContentText>
          {popupMessage}
        </DialogContentText>
      </DialogContent>

      {process.env.NEXT_PUBLIC_VERCEL_ENV === "develop" &&
        <DialogContent>
          <DialogContentText>
            <NextLink href={link} passHref >
              Email link (it is shown only in dev mode)
            </NextLink>
          </DialogContentText>
        </DialogContent>
      }

      <DialogActions>
        <Button
          sx={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
          onClick={handlePopupClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PopupEmailSent