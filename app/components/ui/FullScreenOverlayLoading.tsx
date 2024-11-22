import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

export const FullScreenOverlayLoading = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box textAlign="center">
        <CircularProgress />
        <Typography variant="h6" color="common.white" marginTop={2}>
          Cargando...
        </Typography>
      </Box>
    </Box>
  );
};
