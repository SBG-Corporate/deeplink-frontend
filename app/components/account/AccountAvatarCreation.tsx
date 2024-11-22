import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, Button, Grid, CardMedia, Box } from '@mui/material';
import UploadUserProfileImageByCryptopunk from './UploadUserProfileImageByCryptopunk';
import { User } from '/app/interfaces';

export const AccountAvatarCreation = () => {
  const user: User = useSelector((state: any) => state.persisted.user);
  const isLogged: boolean = useSelector((state: any) => state.persisted.isLogged);

  const [cryptopunkUrl, setCryptopunkUrl] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const regeneratePixelArt = () => {
    const randomNumber = Math.floor(Math.random() * 10000) + 1;
    setCryptopunkUrl(`https://images.wrappedpunks.com/data/crypto-punks/${randomNumber}.svg`)
  };

  useEffect(() => {
    regeneratePixelArt()
  }, [])

  useEffect(() => {
    setProfileImage(user?.profilePicture!)
  }, [user])


  return (
    <Card sx={{ margin: "0 20px", padding: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", borderRadius: "30px" }}>
      <CardContent>
        <Typography variant='h1' sx={{ marginBottom: "10px" }}>Create your avatar</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"} flexDirection={"column"}>
              <CardMedia
                component='img'
                className='cryptopunks'
                image={cryptopunkUrl}
                alt='Imagen del perfil del ususario'
                sx={{ padding: "10px", borderRadius: '150px', maxHeight: "150px", maxWidth: "150px" }}
              />
              <Button onClick={regeneratePixelArt} sx={{ marginTop: "10px", boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                Generate another avatar
              </Button>
            </Box >
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
              {isLogged &&
                <UploadUserProfileImageByCryptopunk
                  avatarImageUrl={cryptopunkUrl}
                  profileImage={profileImage}
                  setProfileImage={setProfileImage}
                />
              }
            </Box >
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

