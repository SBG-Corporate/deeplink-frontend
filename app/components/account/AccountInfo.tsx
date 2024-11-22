import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { Box, Button, Card, CardContent, Chip, Grid, TextField, Typography } from "@mui/material"
import { ErrorOutline } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '/app/interfaces';
import UploadUserProfileImage from './UploadUserProfileImage';
import { apiPatch } from '/app/utils/api/apiUsuarios';
import { setRegister, setUser } from '/app/store/slices/user/userSlice';
import { apiUploadImage } from '/app/utils/api/apiUtils';
import { parseUser } from '/app/utils/api/parseApiData';

type FormData = {
  alias: string;
  name: string;
  instagramLink: string;
  twitterLink: string;
  linkedinLink: string;
  facebookLink: string;
  website: string;
  location: string;
  ocupation: string;
  biography: string;
};

export const AccountInfo = () => {
  const dispatch = useDispatch();
  const user: User = useSelector((state: any) => state.persisted.user);
  const token = useSelector((state: any) => state.persisted.token);

  const [showError, setShowError] = useState(false);
  const [sendingToApi, setSendingToApi] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [profileImage, setProfileImage] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSaveAccountInfoForm = async ({ alias, name, instagramLink, twitterLink, linkedinLink, facebookLink, website, location, ocupation, biography }: FormData) => {
    if (alias === "") { toast.error("You must have an alias"); return }
    if (name === "") { toast.error("You must have an name"); return }
    if (
      alias === user.alias &&
      name === user.nombre &&
      instagramLink === user.socialLinks.instagramLink &&
      twitterLink === user.socialLinks.twitterLink &&
      linkedinLink === user.socialLinks.linkedinLink &&
      facebookLink === user.socialLinks.facebookLink &&
      website === user.bioInfo.website &&
      location === user.bioInfo.location &&
      ocupation === user.bioInfo.ocupation &&
      biography === user.bioInfo.biography
    ) { toast.error("Account information has not changed"); return }

    let body = {}
    if (alias !== user.alias) { body = { alias } }
    if (name !== user.nombre) { body = { ...body, nombre: name } }

    const socialLinks = { instagramLink, twitterLink, linkedinLink, facebookLink }
    const bioInfo = { website, location, ocupation, biography }
    body = { ...body, bioInfo, socialLinks }

    setSendingToApi(true)
    const response = await apiPatch({ ...body, token })
    if (response.data !== undefined && response.data.msg === "Alias ya existe") {
      toast.error("Alias already exists, you have to choose a unique one.")
      toast.error(`Alias alternatives: 
          ${response.data.alternativos[0]},
           ${response.data.alternativos[1]}, 
           ${response.data.alternativos[2]}, 
           ${response.data.alternativos[3]}`)
      return
    }

    if (response.status !== 201 && response.status !== 200) {
      toast.error("Error when updating profile picture, please contact with the admininstrator")
      return
    }
    const parsedUser = parseUser(response.data)
    dispatch(setUser({ user: parsedUser }));
    toast.success("User information updated")
    setSendingToApi(false)
  }

  const onFilesSelectedMainImage = async (blob: Blob) => {

    const fileName = `/profilePictures/${uuidv4()}`
    const file = new File([blob], fileName, { type: blob.type, lastModified: Date.now() });
    const { status, data } = await apiUploadImage(file, token, fileName)

    if (status === 200 || status === 201) {
      const response = await apiPatch({ fotoPerfil: data.url, token })
      if (response.status !== 201 && response.status !== 200) {
        toast.error("Error when updating profile picture, please contact with the admininstrator")
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
      toast.success("Profile picture updated")
    }
    if (status === 413) { toast.error("The image size is too large"); return }
    if (status !== 200 && status !== 201 && status !== 413) { toast.error("Error when uploading the image, please contact with the admin"); return }
  };

  const onDeleteImage = (image: string) => {
    setProfileImage("")
  }

  useEffect(() => {
    setProfileImage(user?.profilePicture!)
  }, [user])


  return (
    <Card sx={{ margin: "0 20px", padding: "20px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", borderRadius: "30px" }}>
      <CardContent>
        <Grid container spacing={2}>

          <Grid item xs={12} sm={9}>
            <form onSubmit={handleSubmit(onSaveAccountInfoForm)} noValidate>
              <Box sx={{ minWidth: 350, padding: '10px 20px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant='h1' component="h1">Account information</Typography>
                    <Chip
                      label={errorMessage}
                      color="error"
                      icon={<ErrorOutline />}
                      className="fadeIn"
                      sx={{ display: showError ? 'flex' : 'none', marginTop: "20px" }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Alias"
                      variant="filled"
                      defaultValue={user?.alias}
                      fullWidth
                      {...register('alias', {
                        required: 'This field is required',
                        minLength: { value: 2, message: 'Minimum 2 chars' },
                        maxLength: { value: 20, message: 'Máximum 20 chars' },
                        validate: {
                          noSpaces: value => !/\s/.test(value) || 'Spaces are not allowed'
                        }
                      })}
                      error={!!errors.alias}
                      helperText={errors.alias?.message}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Name"
                      variant="filled"
                      defaultValue={user?.nombre}
                      fullWidth
                      {...register('name', {
                        required: 'This field is required',
                        minLength: { value: 2, message: 'Minimum 2 chars' },
                        maxLength: { value: 30, message: 'Máximum 30 chars' },
                      })}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Instagram link"
                      variant="filled"
                      defaultValue={user?.socialLinks.instagramLink}
                      fullWidth
                      {...register('instagramLink', {
                        minLength: { value: 2, message: 'Minimum 2 chars' },
                        maxLength: { value: 256, message: 'Máximum 256 chars' },
                      })}
                      error={!!errors.instagramLink}
                      helperText={errors.instagramLink?.message}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Twitter Link"
                      variant="filled"
                      defaultValue={user?.socialLinks.twitterLink}
                      fullWidth
                      {...register('twitterLink', {
                        minLength: { value: 2, message: 'Minimum 2 chars' },
                        maxLength: { value: 256, message: 'Máximum 256 chars' },
                      })}
                      error={!!errors.twitterLink}
                      helperText={errors.twitterLink?.message}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Linkedin link"
                      variant="filled"
                      defaultValue={user?.socialLinks.linkedinLink}
                      fullWidth
                      {...register('linkedinLink', {
                        minLength: { value: 2, message: 'Minimum 2 chars' },
                        maxLength: { value: 256, message: 'Máximum 256 chars' },
                      })}
                      error={!!errors.linkedinLink}
                      helperText={errors.linkedinLink?.message}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Facebook Link"
                      variant="filled"
                      defaultValue={user?.socialLinks.facebookLink}
                      fullWidth
                      {...register('facebookLink', {
                        minLength: { value: 2, message: 'Minimum 2 chars' },
                        maxLength: { value: 256, message: 'Máximum 256 chars' },
                      })}
                      error={!!errors.facebookLink}
                      helperText={errors.facebookLink?.message}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Website link"
                      variant="filled"
                      defaultValue={user?.bioInfo.website}
                      fullWidth
                      {...register('website', {
                        minLength: { value: 2, message: 'Minimum 2 chars' },
                        maxLength: { value: 256, message: 'Máximum 256 chars' },
                      })}
                      error={!!errors.website}
                      helperText={errors.website?.message}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Location"
                      variant="filled"
                      defaultValue={user?.bioInfo.location}
                      fullWidth
                      {...register('location', {
                        minLength: { value: 2, message: 'Minimum 2 chars' },
                        maxLength: { value: 256, message: 'Máximum 256 chars' },
                      })}
                      error={!!errors.location}
                      helperText={errors.location?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Ocupation"
                      variant="filled"
                      defaultValue={user?.bioInfo.ocupation}
                      fullWidth
                      {...register('ocupation', {
                        minLength: { value: 2, message: 'Minimum 2 chars' },
                        maxLength: { value: 256, message: 'Máximum 256 chars' },
                      })}
                      error={!!errors.ocupation}
                      helperText={errors.ocupation?.message}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Biography"
                      variant="filled"
                      defaultValue={user?.bioInfo.biography}
                      fullWidth
                      multiline
                      maxRows={20}
                      {...register('biography', {
                        minLength: { value: 2, message: 'Minimum 2 chars' },
                        maxLength: { value: 160, message: 'Máximum 160 chars' },
                      })}
                      error={!!errors.biography}
                      helperText={errors.biography?.message}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      size='large'
                      color="primary"
                      sx={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }}
                    >
                      Save changes
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </form>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
              <UploadUserProfileImage
                onFilesSelectedMainImage={onFilesSelectedMainImage}
                onDeleteImage={onDeleteImage}
                profileImage={profileImage}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}