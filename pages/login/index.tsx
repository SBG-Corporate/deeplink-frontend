import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Form from "./Form";


const LoginPage: React.FC = () => {
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;

  return (
    <Box>
      <Box
        width="100%"
        p="1rem 6%"
        textAlign="center"
        sx={{ backgroundColor: theme.palette.background.paper }}
      >
        <Typography
          fontWeight="bold"
          fontSize="32px"
          color="primary"
          sx={{
            "&:hover": {
              color: neutralLight,
              cursor: "pointer",
            }
          }}
        >
          DeepLink
        </Typography>
      </Box>

      <Box
        width={"93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
