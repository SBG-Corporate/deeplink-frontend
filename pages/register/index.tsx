import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import MultiStepForm from 'app/components/register/MultiStepForm';
import NextLink from 'next/link';
import { MyPalette } from '/app/themes/types';

const RegisterPage = () => {
  const { palette } = useTheme<MyPalette>();
  const paper = palette.background.paper;
  const light = palette.neutral.light;

  return (
    <Box>

      <Box
        width="100%"
        p="1rem 6%"
        textAlign="center"
        sx={{ backgroundColor: paper }}
      >
        <NextLink href="/" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
          <Typography
            fontWeight="bold"
            fontSize="32px"
            color="primary"
            sx={{
              "&:hover": {
                color: light,
                cursor: "pointer",
              },
            }}
          >
            DeepLink
          </Typography>
        </NextLink>
      </Box>

      <MultiStepForm />

      <img
        height="auto"
        alt="advert"
        src={`../assets/img/avatars/bot.jpg`}
        style={{
          borderRadius: "0.75rem",
          margin: "0.75rem 0",
          position: "absolute",
          bottom: "10%",
          left: "10%",
        }}
      />

    </Box>
  );
};

export default RegisterPage;
