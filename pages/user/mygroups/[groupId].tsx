import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Backdrop, Box, Button, capitalize, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { SaveOutlined, ArrowBack } from '@mui/icons-material';
import { IGroup } from '/app/interfaces';
import { MainLayout } from '/app/components/layouts';
import { validCategories } from '/app/config/constants';
import { UploadImages } from '/app/components/articles/UploadImages';
import { apiCall, apiUploadImage } from '/app/utils/api/apiUtils';


interface FormData {
  _id?: string;
  nombre?: string;
  descripcion: string;
  mainImageUrl: string;
  category: string;
}

const PostUserPage = () => {
  const router = useRouter();
  const { groupId = '' } = router.query;
  const token = useSelector((state: any) => state.persisted.token) || "";

  const [isSaving, setIsSaving] = useState(false);
  const [allGroups, setAllGroups] = useState<IGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [originalName, setOriginalName] = useState("");

  const initalFormData = {
    _id: "",
    nombre: "",
    descripcion: "",
    mainImageUrl: "",
    category: "",
  }
  const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm<FormData>({
    defaultValues: initalFormData
  })
  const nombreValue = watch('nombre');
  const descripcionValue = watch('descripcion');

  const onFilesSelectedMainImage = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) {
      return;
    }
    const file = target.files[0]; // Take only the first file
    try {
      const fileName = `/groupImages/${uuidv4()}`
      const { status, data } = await apiUploadImage(file, token, fileName)
      setValue('mainImageUrl', data.url, { shouldValidate: true });
    } catch (error) {
      console.log({ error });
    }
  };

  const onDeleteImage = (image: string) => {
    setValue('mainImageUrl', "", { shouldValidate: true });
  }

  const onSubmit = async (form: FormData) => {
    if (form.nombre === "") { toast.error('It is necessary to define a name'); return }
    if (form.descripcion === "") { toast.error('It is necessary to define a description'); return }
    if (form.category === "") { toast.error('It is necessary to define a category'); return }
    if (form.mainImageUrl === "") { toast.error('It is necessary to define a main image'); return }
    setIsSaving(true);

    if (groupId === "new") {
      const body = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        logo: form.mainImageUrl,
        nombreLargo: "---",
        category: form.category,
      }
      const { status, data } = await apiCall({ type: "post", url: `/grupo`, token, body });

      if (status === 201) {
        toast.success("Group created")
        router.push(`/user/mygroups`);
      } else {
        if (data === "Un Grupo con ese nombre ya existe") {
          alert("Group not created. There is already a group with the same name, please modify it as it has to be unique")
        } else {
          alert("The group has not been created beacuse there has been an error. Please contact the administrator.")
        }
      }
    } else {
      const body = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        logo: form.mainImageUrl,
        category: form.category,
      }
      if (originalName === form.nombre) {
        delete body.nombre
      }

      const { status, data } = await apiCall({ type: "patch", url: `/grupo/${groupId}`, token, body });
      console.log('data: ', data);

      if (status === 200) {
        toast.success("Challenge updated")
        setIsSaving(false)
        router.push(`/user/mygroups`);
      } else {
        if (data === "Un Grupo con ese nombre ya existe") {
          alert("Group not updated. There is already a group with the same name, please modify it as it has to be unique")
        } else {
          alert("The group has not been updated beacuse there has been an error. Please contact the administrator.")
        }
      }
    }
    setIsSaving(false);
  }

  useEffect(() => {
    const getAllGroups = async () => {
      setLoading(true)
      const { status, data } = await apiCall({ type: "get", url: "/grupo/getMyGroups", token });
      if (status === 200) {
        setAllGroups(data)
      }
      setLoading(false)
    };

    getAllGroups()
  }, [])


  useEffect(() => {
    if (allGroups.length === 0) return
    const selectedGroupAux = allGroups.find((group) => group._id === groupId)
    if (selectedGroupAux !== undefined) {
      setValue('_id', selectedGroupAux._id, { shouldValidate: true });
      setValue('nombre', selectedGroupAux.nombre, { shouldValidate: true });
      setValue('descripcion', selectedGroupAux.descripcion, { shouldValidate: true });
      setValue('mainImageUrl', selectedGroupAux.logo, { shouldValidate: true });
      setValue('category', selectedGroupAux.category, { shouldValidate: true });
      setOriginalName(selectedGroupAux.nombre)
    }
  }, [allGroups])


  return (
    <MainLayout
      title={'DeepLink user my groups edit'}
      pageDescription={'DeepLink user my groups page edit'}
    >
      <Box marginLeft={"100px"} padding={{ sm: "15px", md: "20px 50px" }}>
        <Backdrop
          sx={{ color: '#fff', zIndex: 105 }}
          open={isSaving || loading}
        >
          <Box width={"350px"} display="flex" justifyContent={"center"} flexDirection="column" alignItems="center">
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2 }} textAlign={"center"} fontSize={"20px"}>{loading ? "Loading data..." : groupId === "new" ? "Creating Challenge..." : "Updating Challenge..."}</Typography>
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
                onClick={() => { router.push("/user/mygroups") }}
                disabled={isSaving}
              >
                {"Back"}
              </Button>

              <Box>
                <Button
                  color="primary"
                  startIcon={<SaveOutlined />}
                  // sx={{ width: '150px' }}
                  type="submit"
                  disabled={isSaving}
                  sx={{ boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)" }}
                >
                  {groupId !== "new" ? "Update group" : "Create new group"}
                </Button>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!nombreValue }}
                  sx={{ mb: 1 }}
                  {...register('nombre', {
                    required: 'This field is required',
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 140, message: 'Maximum 140 chars' }
                  })}
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                />
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  maxRows={20}
                  InputLabelProps={{ shrink: !!descripcionValue }}
                  sx={{ mb: 1 }}
                  {...register('descripcion', {
                    required: 'This field is required',
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 255, message: 'Maximum 255 caracteres' }
                  })}
                  error={!!errors.descripcion}
                  helperText={errors.descripcion?.message}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      setValue('descripcion', getValues('descripcion') + '\n');
                    }
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    value={getValues('category') || ''}
                    label="category"
                    sx={{ mb: 1 }}
                    onChange={({ target }) => {
                      const selectedcategory = validCategories.find((category) => category === target.value);
                      setValue('category', selectedcategory!, { shouldValidate: true })
                    }}
                  >
                    {
                      validCategories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {capitalize(category)}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <UploadImages
                  onFilesSelectedMainImage={onFilesSelectedMainImage}
                  onDeleteImage={onDeleteImage}
                  getValues={getValues} />
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </MainLayout>
  )
}



export default PostUserPage