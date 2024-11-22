import React, { useState } from 'react';
import { Box, Button, Card, CardActions, CardMedia, Typography } from '@mui/material';
import UploadProfilePicture from './UploadProfilePicture';

interface Props {
  onFilesSelectedMainImage: (file: Blob) => void;
  onDeleteImage: (img: string) => void;
  profileImage: string;
}

export const UploadUserProfileImage: React.FC<Props> = ({ onFilesSelectedMainImage, onDeleteImage, profileImage }) => {
  const [openUploadProfilePicture, setOpenUploadProfilePicture] = useState(false);

  const handleUploadProfilePictureClose = () => {
    setOpenUploadProfilePicture(false)
  }

  return (
    <Box display='flex' flexDirection='column' marginBottom='30px' sx={{ padding: '15px', borderRadius: '30px', boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", ':hover': { border: 'solid #bbbbbb 1px' } }}>
      <Card sx={{ border: "none", boxShadow: "none" }}>
        <Typography variant='h4' marginBottom={"10px"} textAlign={"center"}>Profile picture</Typography>
        <CardMedia
          component='img'
          className='fadeIn'
          image={profileImage}
          alt='Profile picture'
          sx={{ padding: "10px", borderRadius: '150px', maxHeight: "150px", maxWidth: "150px" }}
        />
        <CardActions>
          <Button
            fullWidth
            color="primary"
            onClick={() => setOpenUploadProfilePicture(true)}
            sx={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }}
          >
            Change
          </Button>
        </CardActions>
      </Card>
      <UploadProfilePicture
        openUploadProfilePicture={openUploadProfilePicture}
        handleUploadProfilePictureClose={handleUploadProfilePictureClose}
        onFilesSelectedMainImage={onFilesSelectedMainImage}
        onDeleteImage={onDeleteImage}
        profileImage={profileImage}
      />
    </Box>
  );
};

export default UploadUserProfileImage;
