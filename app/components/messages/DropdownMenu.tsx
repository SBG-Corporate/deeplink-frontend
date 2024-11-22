import React, { useEffect, useState } from 'react';
import { Typography, MenuItem, FormControl, Select, InputBase } from '@mui/material';
import { Friend } from '/app/interfaces';

type DropdownMenuProps = {
  setReceiverId: (receiverId: string) => void;
  friendIdsWithoutChat: Friend[];
};

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ setReceiverId, friendIdsWithoutChat }) => {
  const [friendSelected, setFriendSelected] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOptionClick = (friendId: string) => {
    setReceiverId(friendId)
    setAnchorEl(null);
  };

  useEffect(() => {
    setReceiverId("")
  }, [])

  return (
    <div>
      <FormControl variant="standard" disabled={friendIdsWithoutChat.length === 0} >
        <Select
          value={friendSelected === null ? "default" : friendSelected}
          sx={{
            boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)",
            width: "150px",
            borderRadius: "0.25rem",
            p: "0.25rem 1rem",
            "& .MuiSvgIcon-root": {
              pr: "0.25rem",
              width: "3rem",
            },
            // "& .MuiSelect-select:focus": {
            //   backgroundColor: neutralLight,
            // },
          }}
          input={<InputBase />}
        >
          <MenuItem value="default">
            <Typography>Select receiver</Typography>
          </MenuItem>
          {friendIdsWithoutChat.length !== 0 &&
            friendIdsWithoutChat.map((friend: Friend, index: number) => (
              <MenuItem
                key={index}
                onClick={() => {
                  setFriendSelected(friend.alias)
                  handleOptionClick(friend._id)
                }}
                value={friend.alias}
              >
                <Typography>{friend.alias}</Typography>
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </div>
  );
};

