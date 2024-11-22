import { useContext } from 'react';
import NextLink from 'next/link';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Typography, Grid, Link, Box, Button, Backdrop, CircularProgress, Switch, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { AddOutlined, Edit, LastPage } from '@mui/icons-material';
import { MessagesContext } from '/app/context/messages';
import { MainLayout } from '/app/components/layouts';
import { apiCall } from '/app/utils/api/apiUtils';
import { switchColor } from '/app/config/constants';


const AdminNotificationsPage = () => {
  const themeMode = useSelector((state: any) => state.persisted?.themeMode);
  const token = useSelector((state: any) => state.persisted.token);
  const { isLoadingMessages, allAlias, messagesNotificationsWithNotEnabled, toggleUpdateMessages } = useContext(MessagesContext);

  const handleSwitchChange = async (postId: string) => {
    const { status, data } = await apiCall({ type: "post", url: `/msg/toggleValidateNotification/${postId}`, token });
    if (status === 200) {
      if (data.notificationsData.isEnabled) { toast.success("Notification validated") }
      else { toast("Notification invalidated") }
      toggleUpdateMessages()
    } else {
      toast.error("There was an error when validating the notification, please contact wiht the administrator")
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Edit',
      sortable: false,
      width: 65,
      renderCell: (params) => {

        return (
          <NextLink href={`/admin/notifications/${params.row._id}`} passHref legacyBehavior>
            <Link underline='always'>
              <IconButton>
                <Edit />
              </IconButton>
            </Link>
          </NextLink>
        );
      },
    },
    {
      field: 'isEnabled',
      headerName: 'Active off/on',
      width: 80,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Switch
            checked={params.row.isEnabled}
            onChange={(event) => handleSwitchChange(params.row._id)}
            color="primary"
            sx={switchColor}
          />
        );
      }
    },
    { field: 'receivers', headerName: 'Receivers', width: 150 },
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'msg', headerName: 'Message', width: 400 },
    { field: 'creador', headerName: 'creador', width: 120 },
  ];

  const rows = messagesNotificationsWithNotEnabled.map((notification, index) => ({
    id: index,
    _id: notification._id,
    title: notification.subject,
    msg: notification.msg,
    creador: allAlias[notification.id_user],
    isEnabled: notification.notificationsData.isEnabled,
    receivers: notification.notificationsData.receivers,
  }))


  return (
    <MainLayout
      title={'DeepLink admin notifications management'}
      pageDescription={'DeepLink admin notifications management page'}
    >

      <Box marginLeft={"100px"} padding={{ xs: "20px", md: "20px 50px" }}>

        <Backdrop
          sx={{ color: '#fff', zIndex: 105 }}
          open={isLoadingMessages}
        >
          <Box width={"350px"} display="flex" justifyContent={"center"} flexDirection="column" alignItems="center">
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2 }} textAlign={"center"} fontSize={"20px"}>Loading notifications...</Typography>
          </Box>
        </Backdrop>

        <Box
          margin={"60px 0"}
          padding={"20px"}
          display={"flex"}
          flexDirection={"column"}
          width={"100%"}
          maxWidth="1200px"
          height={"100%"}
          boxShadow={" 0 0 10px rgba(0, 0, 0, 0.1)"}
          borderRadius={"30px"}
        >

          <Box display='flex' justifyContent='space-between' sx={{ mb: 2 }}>
            <Box width={"100%"} display={"flex"} justifyContent={"start"}>
              <Typography
                margin={"-85px 0  0px 0"}
                // marginTop={"-10px"}
                fontFamily={"Montserrat"}
                fontWeight={"600"}
                fontSize={"50px"}
                color={themeMode === "light" ? "#dedede" : "#202223"}
                sx={{ zIndex: "90" }}
              >
                Notifications management<LastPage sx={{ fontSize: "34px" }} />
              </Typography>
            </Box>
            <Button
              startIcon={<AddOutlined />}
              color="primary"
              href="/admin/notifications/new"
              sx={{ marginRight: "10px", minWidth: "180px", boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)" }}
            >
              Create notification
            </Button>
          </Box>

          <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height: "650px", width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                // pageSize={10}
                rowsPerPageOptions={[10, 20, 50, 100]}
              />

            </Grid>
          </Grid>

        </Box>
      </Box>

    </MainLayout>
  )
}





export default AdminNotificationsPage