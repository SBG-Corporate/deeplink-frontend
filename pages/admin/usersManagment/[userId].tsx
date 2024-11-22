import { ChangeEvent, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Backdrop, Box, Button, capitalize, Chip, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { SaveOutlined, DeleteForever, ArrowBack } from '@mui/icons-material';
import { MainLayout } from '/app/components/layouts';
import { validRols } from '/app/config/constants';
import PopupRemovePost from '/app/components/home/PopupRemovePost';
import { UploadImages } from '/app/components/articles/UploadImages';
import { apiCall, apiUploadImage } from '/app/utils/api/apiUtils';
import { BioInfo, SocialLinks, User } from '/app/interfaces';


interface FormData {
  email: string,
  alias?: string,
  nombre: string,
  mainImageId: string,
  mainImageUrl: string,
  socialLinks: SocialLinks,
  bioInfo: BioInfo,
  rol: string[],
}

const PostUserPage = () => {

  const router = useRouter();
  const { userId = '' } = router.query;
  const token = useSelector((state: any) => state.persisted.token);
  const selectedUser: User = useSelector((state: any) => state.persisted.selectedUser);

  const [isSaving, setIsSaving] = useState(false);
  const [openPopupRemovePost, setOpenPopupRemovePost] = useState(false);
  const [originalAlias, setOriginalAlias] = useState("");

  const initalFormData = {
    email: "",
    alias: "",
    nombre: "",
    mainImageId: "",
    mainImageUrl: "",
    socialLinks: { instagramLink: "", twitterLink: "", linkedinLink: "", facebookLink: "" },
    bioInfo: { biography: "", location: "", ocupation: "", website: "" },
    rol: [],
  }
  const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm<FormData>({
    defaultValues: initalFormData
  })
  const aliasValue = watch('alias');
  const nombreValue = watch('nombre');
  const emailValue = watch('email');
  const instagramLinkValue = watch('socialLinks.instagramLink');
  const twitterLinkValue = watch('socialLinks.twitterLink');
  const linkedinLinkValue = watch('socialLinks.linkedinLink');
  const facebookLinkValue = watch('socialLinks.facebookLink');
  const biographyValue = watch('bioInfo.biography');
  const locationValue = watch('bioInfo.location');
  const ocupationValue = watch('bioInfo.ocupation');
  const websiteValue = watch('bioInfo.website');



  const onFilesSelectedMainImage = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) {
      return;
    }

    const file = target.files[0]; // Take only the first file

    try {
      const fileName = `/profileImages/${uuidv4()}`
      const { status, data } = await apiUploadImage(file, token, fileName)

      // Update form images with just the new image
      setValue('mainImageId', data.fileId, { shouldValidate: true });
      setValue('mainImageUrl', data.url, { shouldValidate: true });
    } catch (error) {
      console.log({ error });
    }
  };


  const onDeleteUser = async () => {
    setIsSaving(true);

    const { status, data } = await apiCall({ type: "delete", url: `/user/deleteUserByAdmin/${userId}`, token });
    if (status === 200) {
      toast.success("User deleted");
      setIsSaving(false)
      router.push(`/admin/usersManagment`);
    } else {
      setIsSaving(false)
      toast.error("Error deleting user");
    }
  }

  const onDeleteImage = (image: string) => {
    setValue('mainImageId', "", { shouldValidate: true });
    setValue('mainImageUrl', "", { shouldValidate: true });
  }


  const onDeleteRole = (selectedRol: string) => {
    const updatedRoles = getValues('rol').filter(t => t !== selectedRol);
    setValue('rol', updatedRoles, { shouldValidate: true });
  }



  const onSubmit = async (form: FormData) => {
    console.log('form: ', form);

    if (form.alias === "") { toast.error('It is necessary to define an alias'); return }
    if (form.email === "") { toast.error('It is necessary to define an email'); return }
    if (form.nombre === "") { toast.error('It is necessary to define a name'); return }


    setIsSaving(true);

    if (userId === "new") {
      const body = {
        usuario: form.email,
        alias: form.alias,
        nombre: form.nombre,
        socialLinks: form.socialLinks,
        bioInfo: form.bioInfo,
        fotoPerfil: form.mainImageUrl !== "" ? form.mainImageUrl : undefined,
      }
      const { status, data } = await apiCall({ type: "post", url: `/user/createNewUserByAdmin`, token, body });


      if (status === 201) {
        toast.success("User created")
        router.push(`/admin/usersManagment`);
      } else {
        toast.error("There was an error, please contact the administrator.")
      }
    } else {
      const body = {
        usuario: form.email,
        alias: form.alias,
        nombre: form.nombre,
        socialLinks: form.socialLinks,
        bioInfo: form.bioInfo,
        fotoPerfil: form.mainImageUrl !== "" ? form.mainImageUrl : undefined,
      }
      if (originalAlias === form.alias) {
        delete body.alias
      }
      const { status, data } = await apiCall({ type: "patch", url: `/user/updateUserByAdmin/${userId}`, token, body });
      console.log('data: ', data);

      if (data !== undefined && data.msg === "Alias ya existe") {
        toast.error("Alias already exists, you have to choose a unique one.")
        toast.error(`Alias alternatives: 
            ${data.alternativos[0]},
             ${data.alternativos[1]}, 
             ${data.alternativos[2]}, 
             ${data.alternativos[3]}`)
        setIsSaving(false);
        return
      }

      if (status === 200) {
        toast.success("User updated")
        setIsSaving(false)
        router.push(`/admin/usersManagment`);
      }

      if (status !== 201 && status !== 200) {
        toast.error("Error when updating user data, please contact with the admininstrator")
        setIsSaving(false);
        return
      }

    }

    setIsSaving(false);
  }


  useEffect(() => {

    if (selectedUser === null) return

    setValue('email', selectedUser.email, { shouldValidate: true });
    setValue('nombre', selectedUser.nombre, { shouldValidate: true });
    setValue('alias', selectedUser.alias, { shouldValidate: true });
    setValue('mainImageUrl', selectedUser.profilePicture, { shouldValidate: true });
    setValue('socialLinks', selectedUser.socialLinks, { shouldValidate: true });
    setValue('bioInfo', selectedUser.bioInfo, { shouldValidate: true });
    setValue('rol', selectedUser.rol, { shouldValidate: true });

    setOriginalAlias(selectedUser.alias)
  }, [selectedUser])


  console.log('selectedUser: ', selectedUser);

  return (
    <MainLayout
      title={'DeepLink admin users management edit user'}
      pageDescription={'DeepLink admin users management edit user page'}
    >
      <Box marginLeft={"100px"} padding={{ sm: "15px", md: "20px 50px" }}>

        <Backdrop
          sx={{ color: '#fff', zIndex: 105 }}
          open={isSaving}
        >
          <Box width={"350px"} display="flex" justifyContent={"center"} flexDirection="column" alignItems="center">
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2 }} textAlign={"center"} fontSize={"20px"}>Creating User...</Typography>
          </Box>
        </Backdrop>


        <Box
          margin={"20px 0"}
          padding={"20px"}
          display={"flex"}
          flexDirection={"column"}
          width={"100%"}
          maxWidth="1200px"
          height={"100%"}
          boxShadow={" 0 0 10px rgba(0, 0, 0, 0.1)"}
          borderRadius={"30px"}
        >

          <form
            onKeyPress={(event) => {
              if (event.which === 13 /* Enter key */) {
                event.preventDefault();
              }
            }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Box display='flex' justifyContent='space-between' sx={{ mb: 2 }}>

              <Button
                color="primary"
                startIcon={<ArrowBack />}
                sx={{ mr: '20px' }}
                onClick={() => { router.push(`/admin/usersManagment`); }}
                disabled={isSaving}
              >
                {"Back"}
              </Button>

              <Box>
                {userId !== "new" &&
                  <Button
                    color="error"
                    startIcon={<DeleteForever />}
                    sx={{ mr: '20px' }}
                    onClick={() => { setOpenPopupRemovePost(true) }}
                    disabled={isSaving}
                  >
                    {"Delete user"}
                  </Button>
                }

                <Button
                  color="primary"
                  startIcon={<SaveOutlined />}
                  // sx={{ width: '150px' }}
                  type="submit"
                  disabled={isSaving}
                  sx={{ boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)" }}
                >
                  {userId !== "new" ? "Update user" : "Create new user"}
                </Button>
              </Box>

            </Box>

            <Grid container spacing={2}>
              {/* Data */}
              <Grid item xs={12} sm={6}>

                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!emailValue }}
                  sx={{ mb: 1 }}
                  {...register('email', {
                    required: 'This field is required',
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 100, message: 'Maximum 100 chars' }
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />

                <TextField
                  label="Alias"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!aliasValue }}
                  sx={{ mb: 1 }}
                  {...register('alias', {
                    required: 'This field is required',
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 100, message: 'Maximum 100 chars' }
                  })}
                  error={!!errors.alias}
                  helperText={errors.alias?.message}
                />

                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!nombreValue }}
                  sx={{ mb: 1 }}
                  {...register('nombre', {
                    required: 'This field is required',
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 100, message: 'Maximum 100 chars' }
                  })}
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                />

                <FormControl fullWidth>
                  <InputLabel>Roles</InputLabel>
                  <Select
                    value={getValues('rol') || []}
                    label="Roles"
                    sx={{ mb: 1 }}
                    onChange={({ target }) => {
                      const selectedRol = target.value as string;
                      if (!getValues('rol').includes(selectedRol)) {
                        const updatedRoles = [...getValues('rol'), selectedRol];
                        setValue('rol', updatedRoles, { shouldValidate: true });
                      }
                    }}
                  >
                    {
                      validRols.map((rol) => (
                        <MenuItem key={rol} value={rol}>
                          {capitalize(rol)}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>

                <Box sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  listStyle: 'none',
                  p: 0,
                  marginBottom: "10px",
                }}
                  component="ul">
                  {
                    getValues('rol').map((rol) => {

                      return (
                        <Chip
                          key={rol}
                          label={rol}
                          onDelete={() => onDeleteRole(rol)}
                          color="primary"
                          size='small'
                          sx={{ ml: 1, mt: 1 }}
                        />
                      );
                    })}
                </Box>

                <UploadImages
                  onFilesSelectedMainImage={onFilesSelectedMainImage}
                  onDeleteImage={onDeleteImage}
                  getValues={getValues}
                  text={"Profile picture"}
                />

              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Biography"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!biographyValue }}
                  multiline
                  maxRows={3}
                  sx={{ mb: 1 }}
                  {...register('bioInfo.biography', {
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 160, message: 'Maximum 160 caracteres' },
                    validate: value => value === '' || (value.length >= 2 && value.length <= 160) || 'Minimum 2 chars and Maximum 160 chars'
                  })}
                  error={!!errors.bioInfo?.biography}
                  helperText={errors.bioInfo?.biography?.message}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      setValue('bioInfo.biography', getValues('bioInfo.biography') + '\n');
                    }
                  }}
                />

                <TextField
                  label="Website"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!websiteValue }}
                  sx={{ mb: 1 }}
                  {...register('bioInfo.website', {
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 256, message: 'Maximum 256 chars' },
                    validate: value => value === '' || (value.length >= 2 && value.length <= 256) || 'Minimum 2 chars and Maximum 160 chars'
                  })}
                  error={!!errors.bioInfo?.website}
                  helperText={errors.bioInfo?.website?.message}
                />

                <TextField
                  label="Location"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!locationValue }}
                  sx={{ mb: 1 }}
                  {...register('bioInfo.location', {
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 256, message: 'Maximum 256 chars' },
                    validate: value => value === '' || (value.length >= 2 && value.length <= 256) || 'Minimum 2 chars and Maximum 160 chars'
                  })}
                  error={!!errors.bioInfo?.location}
                  helperText={errors.bioInfo?.location?.message}
                />

                <TextField
                  label="Ocupation"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!ocupationValue }}
                  sx={{ mb: 1 }}
                  {...register('bioInfo.ocupation', {
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 256, message: 'Maximum 256 chars' },
                    validate: value => value === '' || (value.length >= 2 && value.length <= 256) || 'Minimum 2 chars and Maximum 160 chars'
                  })}
                  error={!!errors.bioInfo?.ocupation}
                  helperText={errors.bioInfo?.ocupation?.message}
                />

                <TextField
                  label="Instagram link"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!instagramLinkValue }}
                  sx={{ mb: 1 }}
                  {...register('socialLinks.instagramLink', {
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 256, message: 'Maximum 256 chars' },
                    validate: value => value === '' || (value.length >= 2 && value.length <= 256) || 'Minimum 2 chars and Maximum 160 chars'
                  })}
                  error={!!errors.socialLinks?.instagramLink}
                  helperText={errors.socialLinks?.instagramLink?.message}
                />

                <TextField
                  label="Twitter link"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!twitterLinkValue }}
                  sx={{ mb: 1 }}
                  {...register('socialLinks.twitterLink', {
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 256, message: 'Maximum 256 chars' },
                    validate: value => value === '' || (value.length >= 2 && value.length <= 256) || 'Minimum 2 chars and Maximum 160 chars'
                  })}
                  error={!!errors.socialLinks?.twitterLink}
                  helperText={errors.socialLinks?.twitterLink?.message}
                />

                <TextField
                  label="Linkedin link"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!linkedinLinkValue }}
                  sx={{ mb: 1 }}
                  {...register('socialLinks.linkedinLink', {
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 256, message: 'Maximum 256 chars' },
                    validate: value => value === '' || (value.length >= 2 && value.length <= 256) || 'Minimum 2 chars and Maximum 160 chars'
                  })}
                  error={!!errors.socialLinks?.linkedinLink}
                  helperText={errors.socialLinks?.linkedinLink?.message}
                />

                <TextField
                  label="Facebook link"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!facebookLinkValue }}
                  sx={{ mb: 1 }}
                  {...register('socialLinks.facebookLink', {
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 256, message: 'Maximum 256 chars' },
                    validate: value => value === '' || (value.length >= 2 && value.length <= 256) || 'Minimum 2 chars and Maximum 160 chars'
                  })}
                  error={!!errors.socialLinks?.facebookLink}
                  helperText={errors.socialLinks?.facebookLink?.message}
                />
              </Grid>

            </Grid>
          </form>


          <PopupRemovePost
            openPopupRemovePost={openPopupRemovePost}
            handlePopupRemovePostClose={() => { setOpenPopupRemovePost(false) }}
            onDeletePost={onDeleteUser}
            text={"You are going to delete this blog forever, are you sure?"}
          />

        </Box>
      </Box>
    </MainLayout >
  )
}



export default PostUserPage