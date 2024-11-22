import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Backdrop, Box, Button, capitalize, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { SaveOutlined, ArrowBack } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { MessagesContext } from '/app/context/messages';
import { MainLayout } from '/app/components/layouts';
import { validChallengesTypes } from '/app/config/constants';
import { apiCall } from '/app/utils/api/apiUtils';
import { useSelector } from 'react-redux';
import { IChallenge } from '/app/interfaces/Challenges';


interface FormData {
  _id?: string;
  name: string;
  description: string;
  type: string;
  reward: number;
  objective: number;
  slug: string;
  isEnabled: boolean;
  order: number;
}

const PostUserPage = () => {

  const router = useRouter();
  const { slug = '' } = router.query;
  const { toggleUpdateMessages } = useContext(MessagesContext);
  const token = useSelector((state: any) => state.persisted.token) || "";

  const [isSaving, setIsSaving] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [allChallenges, setAllChallenges] = useState<IChallenge[]>([]);
  const [loading, setLoading] = useState(false);

  const initalFormData = {
    _id: "",
    name: "",
    description: "",
    type: "",
    reward: undefined,
    objective: undefined,
    slug: "",
    isEnabled: true,
    order: 0,
  }
  const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm<FormData>({
    defaultValues: initalFormData
  })

  const nameValue = watch('name');
  const descriptionValue = watch('description');
  const slugValue = watch('slug');
  const objectiveValue = watch('objective');
  const rewardValue = watch('reward');

  const onSubmit = async (form: FormData) => {
    console.log('form: ', form);

    if (form.name === "") { toast.error('It is necessary to define a name'); return }
    if (form.description === "") { toast.error('It is necessary to define a description'); return }
    if (form.type === "") { toast.error('It is necessary to define a type'); return }
    if (form.slug === "") { toast.error('It is necessary to define a unique slug'); return }
    if (form.reward === undefined) { toast.error('It is necessary to define a reward'); return }
    if (form.reward === 0) { toast.error('The reward can not be 0'); return }
    if (form.reward < 0) { toast.error('The reward can not be negative'); return }
    if (form.objective === undefined) { toast.error('It is necessary to define an objective'); return }
    if (form.objective === 0) { toast.error('The objective can not be 0'); return }
    if (form.objective < 0) { toast.error('The objective can not be negative'); return }

    setIsSaving(true);

    if (slug === "new") {
      const body = {
        name: form.name,
        description: form.description,
        challengeType: form.type,
        reward: Number(form.reward),
        challengeTarget: Number(form.objective),
        slug: form.slug
      }
      const { status, data } = await apiCall({ type: "post", url: `/challenges/create`, token, body });

      if (status === 201) {
        toast.success("Challenge created")
        toggleUpdateMessages()
        router.push(`/admin/challenges`);
      } else {
        if (data.msg === "The slug is not valid, choose another one") {
          alert("Post not updated. There is already a post with the same slug, please modify it as it has to be unique. The slug is used only in the URL.")
        } else {
          alert("The challenge has not been updated beacuse there has been an error. Please contact the administrator.")
        }
      }
    } else {

      const body = {
        name: form.name,
        description: form.description,
        challengeType: form.type,
        reward: Number(form.reward),
        challengeTarget: Number(form.objective),
        slug: form.slug === originalSlug ? undefined : form.slug,
        order: form.order,
      }
      const { status, data } = await apiCall({ type: "patch", url: `/challenges/update/${challengeId}`, token, body });

      if (status === 200) {
        toast.success("Challenge updated")
        toggleUpdateMessages()
        setIsSaving(false)
        router.push(`/admin/challenges`);
      } else {
        if (data.msg === "The slug is not valid, choose another one") {
          alert("Post not updated. There is already a post with the same slug, please modify it as it has to be unique. The slug is used only in the URL.")
        } else {
          alert("The challenge has not been updated beacuse there has been an error. Please contact the administrator.")
        }
      }
    }

    setIsSaving(false);
  }



  useEffect(() => {
    const subscription = watch((value, { name, type }) => { //* watch permite escuchar cada vez que hay un cambio en el react-hook-form
      if (name === 'name') {
        const newSlug = `${value.name?.trim()}`
          .replaceAll(' ', '_')
          .replaceAll("'", '')
          .replaceAll("á", 'a').replaceAll("é", 'e').replaceAll("í", 'i').replaceAll("ó", 'o').replaceAll("ú", 'u').replaceAll("ñ", 'n').replaceAll("Á", 'a').replaceAll("É", 'e').replaceAll("Í", 'i').replaceAll("Ó", 'o').replaceAll("Ú", 'u').replaceAll("Ñ", 'n').replaceAll("ü", 'u').replaceAll("Ü", 'u')
          .replace(/\//g, '')
          .toLocaleLowerCase() || '';

        setValue('slug', newSlug);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue])

  useEffect(() => {
    const getAllChallenges = async () => {
      setLoading(true)
      const { status, data } = await apiCall({ type: "get", url: "/challenges/getAllChallenges", token });
      if (status === 200) {
        setAllChallenges(data)
      }
      setLoading(false)
    };

    getAllChallenges()
  }, [])

  useEffect(() => {
    if (allChallenges.length === 0) return

    const selectedChallengeAux = allChallenges.find((challenge) => challenge.slug === slug)

    if (selectedChallengeAux !== undefined) {

      setValue('_id', selectedChallengeAux._id, { shouldValidate: true });
      setValue('name', selectedChallengeAux.nombre, { shouldValidate: true });
      setValue('description', selectedChallengeAux.descripcion, { shouldValidate: true });
      setValue('type', selectedChallengeAux.tipoDeChallenge, { shouldValidate: true });
      setValue('reward', selectedChallengeAux.recompensa, { shouldValidate: true });
      setValue('objective', selectedChallengeAux.objetivoDeChallenge, { shouldValidate: true });
      setValue('slug', selectedChallengeAux.slug, { shouldValidate: true });
      setValue('isEnabled', selectedChallengeAux.isEnabled, { shouldValidate: true });
      setValue('order', selectedChallengeAux.order, { shouldValidate: true });
      setOriginalSlug(selectedChallengeAux.slug)
      setChallengeId(selectedChallengeAux._id)

    }

  }, [allChallenges])


  return (
    <MainLayout
      title={'DeepLink challenges'}
      pageDescription={'DeepLink user challenges page'}
    >

      <Box marginLeft={"100px"} padding={{ sm: "15px", md: "20px 50px" }}>

        <Backdrop
          sx={{ color: '#fff', zIndex: 105 }}
          open={isSaving || loading}
        >
          <Box width={"350px"} display="flex" justifyContent={"center"} flexDirection="column" alignItems="center">
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2 }} textAlign={"center"} fontSize={"20px"}>{loading ? "Loading data..." : slug === "new" ? "Creating Challenge..." : "Updating Challenge..."}</Typography>
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
                onClick={() => { router.push("/admin/challenges") }}
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
                  {slug !== "new" ? "Update challenge" : "Create new challenge"}
                </Button>
              </Box>

            </Box>

            <Grid container spacing={2}>
              {slug !== "new" &&
                <>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      label="Order"
                      variant="outlined"
                      type={"number"}
                      fullWidth
                      InputLabelProps={{ shrink: !!objectiveValue }}
                      sx={{ mb: 1 }}
                      {...register('order', {
                        required: 'This field is required',
                      })}
                      error={!!errors.order}
                      helperText={errors.order?.message}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          setValue('order', getValues('order'));
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={10} />
                </>
              }

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!nameValue }}
                  sx={{ mb: 1 }}
                  {...register('name', {
                    required: 'This field is required',
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 100, message: 'Maximum 100 chars' }
                  })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Slug - URL (autogenerated using the title)"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!slugValue }}
                  sx={{ mb: 1 }}
                  {...register('slug', {
                    required: 'This field is required',
                    validate: (val) => val.trim().includes(' ') ? 'Cannot have spaces' : undefined
                  })}
                  error={!!errors.slug}
                  helperText={errors.slug?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={getValues('type') || ''}
                    label="Type"
                    sx={{ mb: 1 }}
                    onChange={({ target }) => {
                      const selectedType = validChallengesTypes.find((type) => type === target.value);
                      setValue('type', selectedType!, { shouldValidate: true })
                    }}
                  >
                    {
                      validChallengesTypes.map((category) => (
                        <MenuItem key={category} value={category}>
                          {capitalize(category)}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  maxRows={20}
                  InputLabelProps={{ shrink: !!descriptionValue }}
                  sx={{ mb: 1 }}
                  {...register('description', {
                    required: 'This field is required',
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 400, message: 'Maximum 400 caracteres' }
                  })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      setValue('description', getValues('description') + '\n');
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  label="Objective"
                  variant="outlined"
                  type={"number"}
                  fullWidth
                  InputLabelProps={{ shrink: !!objectiveValue }}
                  sx={{ mb: 1 }}
                  {...register('objective', {
                    required: 'This field is required',
                  })}
                  error={!!errors.objective}
                  helperText={errors.objective?.message}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      setValue('objective', getValues('objective'));
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  label="Rewards in $LINKS"
                  variant="outlined"
                  type={"number"}
                  fullWidth
                  InputLabelProps={{ shrink: !!rewardValue }}
                  sx={{ mb: 1 }}
                  {...register('reward', {
                    required: 'This field is required',
                  })}
                  error={!!errors.reward}
                  helperText={errors.reward?.message}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      setValue('reward', getValues('reward'));
                    }
                  }}
                />
              </Grid>



            </Grid>
          </form>

        </Box>
      </Box>
    </MainLayout>
  )
}



export default PostUserPage