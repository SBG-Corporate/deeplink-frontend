import React, { FC } from "react";
import { Box } from "@mui/material";

interface Props {
  image: string;
  size?: string;
  editable?: boolean;
}

const UserImage: FC<Props> = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size} position="relative">
      <img
        style={{ objectFit: "cover", borderRadius: "50%", width: "100%", height: "100%", display: "block" }}
        width={size}
        height={size}
        alt="user"
        src={image}
      />
    </Box>
  );
};

export default UserImage;
