import React from 'react';
import { Badge, Button, Tooltip } from '@mui/material';
import { motion } from "framer-motion";
import UserImage from 'app/components/common/UserImage';

type GroupButtonProps = {
  imageUrl: string;
  onClick: () => void;
  isSelected: boolean;
  notViewedMessages?: number;
  tooltipText?: string;
};

export const GroupButton: React.FC<GroupButtonProps> = ({ imageUrl, onClick, isSelected, notViewedMessages = 0, tooltipText = "" }) => {
  return (
    <Tooltip title={tooltipText}>
      <Button
        onClick={onClick}
        component={motion.button}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        disableRipple
        sx={{
          padding: "0",
          border: isSelected ? "solid 3px #aaaaaa" : undefined,
          borderRadius: "50%",
          '&:hover': { backgroundColor: 'transparent' },
          '&:active': { backgroundColor: 'transparent' },
        }}
      >
        <Badge badgeContent={notViewedMessages} color="error">
          <UserImage image={imageUrl} size="55px" />
        </Badge>
      </Button>
    </Tooltip>
  );
}