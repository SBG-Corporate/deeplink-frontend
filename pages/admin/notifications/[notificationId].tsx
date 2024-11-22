import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Backdrop, Box, Button, capitalize, Chip, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { SaveOutlined, DeleteForever, ArrowBack } from '@mui/icons-material';
import { MessagesContext } from '/app/context/messages';
import { MainLayout } from '/app/components/layouts';
import { validReceiver } from '/app/config/constants';
import PopupRemovePost from '/app/components/home/PopupRemovePost';
import { apiCall } from '/app/utils/api/apiUtils';
import { apiDeleteMessage } from '/app/utils/api/apiMessages';

interface FormData {
  _id: string;
  title: string;
  msg: string;
  receivers: string[];
}

const EditNotificationsPage = () => {

  const router = useRouter();
  const { notificationId = '' } = router.query;
  const { isLoadingMessages, messagesNotificationsWithNotEnabled, toggleUpdateMessages } = useContext(MessagesContext);
  const token = useSelector((state: any) => state.persisted.token) || {};

  const [isSaving, setIsSaving] = useState(false);
  const [openPopupRemovePost, setOpenPopupRemovePost] = useState(false);

  const initalFormData = {
    _id: "",
    title: "",
    msg: "",
    receivers: [],
  }
  const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm<FormData>({
    defaultValues: initalFormData
  })
  const titleValue = watch('title');
  const msgValue = watch('msg');


  const onDeletePost = async () => {
    // const formData = watch();
    setIsSaving(true);

    const { status, data } = await apiDeleteMessage(notificationId as string, token)
    if (status === 200) {
      toast.success("Article deleted");
      setIsSaving(false)
      toggleUpdateMessages()
      router.push(`/admin/notifications`);
    } else {
      setIsSaving(false)
      toast.error("Error deleting post");
    }
  }

  const onSubmit = async (form: FormData) => {

    if (form.title.length === 0) { toast.error('It is necessary to define a title'); return }
    if (form.title.length > 180) { toast.error('The title can not contain more than 180 characteres'); return }
    if (form.msg.length === 0) { toast.error('It is necessary to define a message'); return }
    if (form.msg.length > 2000) { toast.error('The message can not contain more than 180 characteres'); return }
    if (form.receivers.length === 0) { toast.error('It is necessary to define at least one receiver'); return }
    setIsSaving(true);

    if (notificationId === "new") {
      const body = {
        subject: form.title,
        tipo: "notificacion",
        msg: form.msg,
        receivers: form.receivers,
      }
      const { status, data } = await apiCall({ type: "post", url: `/msg/?full=true`, token, body });
      console.log('data: ', data);

      if (status === 201) {
        toast.success("Notification created")
        toggleUpdateMessages()
        router.push(`/admin/notifications`);
      } else {
        toast.error("An error occurs when creating the notification, please contact with the administrator")
      }
    } else {

      const body = {
        subject: form.title,
        tipo: "notificacion",
        msg: form.msg,
        receivers: form.receivers,
      }
      const { status, data } = await apiCall({ type: "patch", url: `/msg/${notificationId}?full=true`, token, body });

      if (status === 200) {
        toast.success("Notification updated")
        toggleUpdateMessages()
        setIsSaving(false)
        router.push(`/admin/notifications`);
      } else {
        toast.error("An error occurs when updating the notification, please contact with the administrator")
      }
    }

    setIsSaving(false);
  }

  const onDeleteReceiver = (receiver: string) => {
    const updatedReceivers = getValues('receivers').filter(t => t !== receiver);
    setValue('receivers', updatedReceivers, { shouldValidate: true });
  }



  useEffect(() => {

    if (notificationId === "new") return

    const selectedNotificationAux = messagesNotificationsWithNotEnabled.find((notification) => notification._id === notificationId)

    if (selectedNotificationAux !== undefined) {
      setValue('_id', selectedNotificationAux._id, { shouldValidate: true });
      setValue('title', selectedNotificationAux.subject, { shouldValidate: true });
      setValue('msg', selectedNotificationAux.msg, { shouldValidate: true });
      setValue('receivers', selectedNotificationAux.notificationsData.receivers, { shouldValidate: true });
    }

  }, [isLoadingMessages])


  return (
    <MainLayout
      title={'DeepLink user notifications'}
      pageDescription={'DeepLink user notifications page'}
    >

      <Box marginLeft={"100px"} padding={{ sm: "15px", md: "20px 50px" }}>

        <Backdrop
          sx={{ color: '#fff', zIndex: 105 }}
          open={isSaving}
        >
          <Box width={"350px"} display="flex" justifyContent={"center"} flexDirection="column" alignItems="center">
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2 }} textAlign={"center"} fontSize={"20px"}>Creating Article...</Typography>
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
                onClick={() => { router.push("/admin/notifications") }}
                disabled={isSaving}
              >
                {"Back"}
              </Button>

              <Box>
                {notificationId !== "new" &&
                  <Button
                    color="error"
                    startIcon={<DeleteForever />}
                    sx={{ mr: '20px' }}
                    onClick={() => { setOpenPopupRemovePost(true) }}
                    disabled={isSaving}
                  >
                    {"Delete notification"}
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
                  {notificationId !== "new" ? "Update notification" : "Create new notification"}
                </Button>
              </Box>

            </Box>

            <Grid container spacing={2}>
              {/* Data */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={2}
                  InputLabelProps={{ shrink: !!titleValue }}
                  sx={{ mb: 1 }}
                  {...register('title', {
                    required: 'This field is required',
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 100, message: 'Maximum 100 chars' }
                  })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      setValue('title', getValues('title') + '\n');
                    }
                  }}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />

                <FormControl fullWidth>
                  <InputLabel>Receivers</InputLabel>
                  <Select
                    id="receivers"
                    value={getValues('receivers') || []}
                    label="Receivers"
                    sx={{ mb: 1 }}
                    onChange={({ target }) => {
                      const selectedReceiver = target.value as string;
                      if (!getValues('receivers').includes(selectedReceiver)) {
                        const updatedReceivers = [...getValues('receivers'), selectedReceiver];
                        setValue('receivers', updatedReceivers, { shouldValidate: true });
                      }
                    }}
                  >
                    {
                      validReceiver.map((receivers) => (
                        <MenuItem key={receivers} value={receivers}>
                          {capitalize(receivers)}{receivers[receivers.length - 1] === "s" ? "" : "s"}
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
                  m: 0,
                }}
                  component="ul">
                  {
                    getValues('receivers').map((receiver) => {

                      return (
                        <Chip
                          key={receiver}
                          label={receiver}
                          onDelete={() => onDeleteReceiver(receiver)}
                          color="primary"
                          size='small'
                          sx={{ ml: 1, mt: 1 }}
                        />
                      );
                    })}
                </Box>

              </Grid>


              <Grid item xs={12} sm={6}>
                <TextField
                  label="Message"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: !!msgValue }}
                  multiline
                  minRows={5}
                  sx={{ mb: 1 }}
                  {...register('msg', {
                    required: 'This field is required',
                    minLength: { value: 2, message: 'Minimum 2 chars' },
                    maxLength: { value: 400, message: 'Maximum 400 caracteres' }
                  })}
                  error={!!errors.msg}
                  helperText={errors.msg?.message}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      setValue('msg', getValues('msg') + '\n');
                    }
                  }}
                />
              </Grid>

            </Grid>
          </form>

          <PopupRemovePost
            openPopupRemovePost={openPopupRemovePost}
            handlePopupRemovePostClose={() => { setOpenPopupRemovePost(false) }}
            onDeletePost={onDeletePost}
            text={"You are going to delete this blog forever, are you sure?"}
          />

        </Box>
      </Box>
    </MainLayout >
  )
}


export default EditNotificationsPage;
