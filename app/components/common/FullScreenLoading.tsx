import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

export const FullScreenLoading = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      height='calc(100vh - 200px)'
    >
      <Typography sx={{ mb: 1 }} variant="h2" fontWeight={400} fontSize={20}>Loading...</Typography>
      <CircularProgress thickness={4} />
    </Box>
  )
}