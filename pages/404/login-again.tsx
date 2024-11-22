import NextLink from "next/link"
import { Box, Typography } from '@mui/material';
import { MainLayout } from "app/components/layouts";

const LogginAgain = () => {
  return (
    <MainLayout title='Invalid token' pageDescription='Invalid token'>
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='calc(100vh - 200px)'
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Typography variant='h1' component='h1' fontSize={80} fontWeight={200}>404 |</Typography>
        <Typography marginLeft={2}>Please loggin again</Typography>
      </Box>

      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        fontSize={"20px"}
      >
        <NextLink href={`/`} passHref>Go to login</NextLink>
      </Box>
    </MainLayout>
  )
}

export default LogginAgain;