import { FC } from "react";
import { Box, useTheme, } from "@mui/material";
import { useSelector } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import toast from "react-hot-toast";
import { useRouter } from "next/router";

type AddGroupButtonProps = {
};

export const AddGroupButton: FC<AddGroupButtonProps> = ({ }) => {
  const router = useRouter()
  const user = useSelector((state: any) => state.persisted.user);
  const theme = useTheme();
  const dark = theme.palette.neutral.dark;

  const handleOnClick = async () => {
    if (user.estado === 0) {
      toast.error("You must be registered to join a group")
    } else {
      router.push("/user/mygroups")
    }
  };

  return (
    <Box
      p={"40px"}
      height={"100%"}
      width={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      onClick={handleOnClick}
      sx={{
        boxShadow: 3,
        borderRadius: "30px",
        cursor: "pointer",
        "&:hover": {
          opacity: 0.5,
        },
      }}>
      <AddIcon sx={{ fontSize: "50px", color: dark }} />
    </Box >
  );
};