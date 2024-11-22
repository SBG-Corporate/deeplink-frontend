import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { motion } from "framer-motion";
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { IconButton, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PopupCreateNewChat } from "app/components/messages";
import { MyPalette } from '/app/themes/types';

interface Props {
  pageType?: "message" | "group";
}

export const AddChatButton: FC<Props> = ({ pageType = "message" }) => {
  const router = useRouter();
  const user = useSelector((state: any) => state.persisted.user);
  const theme = useTheme<MyPalette>();
  const sendMessagesBox = theme.palette.messages.sendMessagesBox;

  const [openPopup, setOpenPopup] = React.useState(false);

  return (
    <>
      <IconButton
        component={motion.button}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        size='large'
        disableRipple
        sx={{
          borderRadius: '18px',
          backgroundColor: sendMessagesBox,
          color: "#23a559",
          '&:hover': { backgroundColor: '#dddddd', color: "#313338", borderRadius: '18px' },
          '&:active': { backgroundColor: '#248046', color: "#313338", borderRadius: '18px' },
        }}
        onClick={() => {
          if (user.estado === 0) {
            toast.error(`You must be registered in to create a new ${pageType === "message" ? "caht" : "group"}`)
          } else {
            if (pageType === "message") {
              setOpenPopup(true);
            }
            if (pageType === "group") {
              router.push("/user/mygroups")
            }
          }
        }}
      >
        <AddIcon style={{ fontSize: '32px' }} />
      </IconButton>
      {openPopup && <PopupCreateNewChat
        openPopup={openPopup}
        handlePopupClose={() => { setOpenPopup(false); }}
      />
      }
    </>
  );
}
