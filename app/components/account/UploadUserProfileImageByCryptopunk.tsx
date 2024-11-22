import { FC } from 'react';
import { Box, Button, CardActions, CardMedia, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { apiPatch } from '/app/utils/api/apiUsuarios';
import { setRegister } from '/app/store/slices/user/userSlice';
import toast from 'react-hot-toast';

interface Props {
  avatarImageUrl: any;
  profileImage: string;
  setProfileImage: (value: string) => void;
}

export const UploadUserProfileImageByCryptopunk: FC<Props> = ({ avatarImageUrl, profileImage, setProfileImage }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.persisted.token);

  const onSetAvatarImage = async () => {
    try {
      const response = await apiPatch({ fotoPerfil: avatarImageUrl, token })
      if (response.status !== 201 && response.status !== 200) {
        toast.error("Error when updating user info, please contact with the admininstrator")
      }
      dispatch(
        setRegister({
          alias: response.data.alias,
          nombre: response.data.nombre,
          estado: response.data.estado,
          profilePicture: response.data.fotoPerfil,
          saldo: response.data.saldo,
        })
      );
    } catch (error) {
      console.error('Error cropping or uploading image:', error);
    }
  };


  return (
    <Box display='flex' justifyContent={"center"} alignItems={"center"} flexDirection='column' sx={{ padding: '15px', borderRadius: '30px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', ':hover': { border: 'solid #bbbbbb 0.1px' } }}>
      <Typography variant='h2'>Profile picture</Typography>
      <CardMedia
        component='img'
        className='fadeIn'
        image={profileImage}
        alt='Imagen del perfil del ususario'
        sx={{ padding: "10px", borderRadius: '150px', maxHeight: "150px", maxWidth: "150px" }}
      />
      <CardActions>
        <Button
          fullWidth
          color="primary"
          onClick={onSetAvatarImage}
          sx={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
        >
          Use avatar as profile picture
        </Button>
      </CardActions>
    </Box>
  );
};

export default UploadUserProfileImageByCryptopunk;
