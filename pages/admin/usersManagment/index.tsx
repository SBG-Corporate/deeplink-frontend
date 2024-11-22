import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Grid, Chip, Link, Box, Button, CardMedia, Backdrop, CircularProgress, Switch, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { AddOutlined, Delete, Edit, LastPage, Verified } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { MessagesContext } from '/app/context/messages';
import { MainLayout } from '/app/components/layouts';
import { apiCall } from '/app/utils/api/apiUtils';
import { switchColor } from '/app/config/constants';
import { ApiUser, User } from '/app/interfaces';
import { parseUser } from '/app/utils/api/parseApiData';
import { setSelectedUser } from '/app/store/slices/user/userSlice';


const UsersManagmentPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const themeMode = useSelector((state: any) => state.persisted?.themeMode);
  const token = useSelector((state: any) => state.persisted.token);
  const { isLoadingMessages } = useContext(MessagesContext);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [updateAllUsers, setUpdateAllUsers] = useState(false);

  const handleSwitchChange = async (userId: string) => {
    const { status, data } = await apiCall({ type: "post", url: `/user/toggleUserVerification/${userId}`, token });
    if (status === 200) {
      if (data.isVerified) { toast.success("User verified") }
      else { toast("User unverified") }
      setUpdateAllUsers(prev => !prev)
    } else {
      toast.error("There was an error when verifying the user, please contact wiht the administrator")
    }
  };

  useEffect(() => {
    const getAllUsers = async () => {
      const { status, data } = await apiCall({ type: "get", url: "/user/getAllUsers", token });
      if (status === 200) {
        const parsedUsers = data.map((user: ApiUser) => parseUser(user))
        setAllUsers(parsedUsers)
        return;
      }
    };

    getAllUsers()
  }, [updateAllUsers])


  const columns: GridColDef[] = [
    {
      field: 'profilePicture',
      headerName: 'User image',
      width: 80,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <CardMedia
            component='img'
            alt={row.title}
            className='fadeIn'
            image={row.profilePicture}
            sx={{ width: "50px", height: "50px", borderRadius: "50px" }}
          />
        )
      }
    },
    {
      field: 'actions',
      headerName: 'Edit',
      sortable: false,
      width: 65,
      renderCell: (params) => {

        const onClickEdit = () => {
          const selectedUser = allUsers.find((user) => user._id === params.row._id);
          console.log('selectedUser: ', selectedUser);
          dispatch(setSelectedUser({ selectedUser }));
          router.push(`/admin/usersManagment/${params.row._id}`);
        };

        return (
          <IconButton onClick={onClickEdit}>
            <Edit />
          </IconButton>
        );
      },
    },
    {
      field: 'post',
      headerName: 'View',
      width: 65,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <NextLink href={`/profile/${params.row._id}`} passHref legacyBehavior>
            <Link
              underline='always'
              target="_blank"
              rel="noopener noreferrer"
            >
              <VisibilityIcon />
            </Link>
          </NextLink>
        )
      }
    },
    { field: 'alias', headerName: 'Alias', width: 150 },
    { field: 'nombre', headerName: 'Name', width: 150 },
    { field: 'saldo', headerName: '$LINKS', width: 70 },
    { field: 'userLevel', headerName: 'User level', width: 70 },
    { field: 'friendsIds', headerName: '#Followers', width: 75, renderCell: (params) => { return (<Typography fontSize={"12px"}>{params.row.friendsIds.length}</Typography>) } },
    {
      field: 'isVerified',
      renderHeader: () => (
        <Box display={"flex"} alignItems={"center"}>
          <Typography variant="body2" marginTop={"2px"}>
            Verified?
          </Typography>
          <Verified sx={{ marginLeft: "2px", fontSize: "12px" }} />
        </Box>
      ),
      width: 80,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Switch
            checked={params.row.isVerified}
            onChange={(event) => handleSwitchChange(params.row._id)}
            color="primary"
            sx={switchColor}
          />
        );
      }
    },
    { field: 'estado', headerName: 'State', width: 85, renderCell: (params) => { return (<Typography fontSize={"12px"}>{params.row.estado === 0 ? "Not registered" : "Registered"}</Typography>) } },
    { field: 'email', headerName: 'Email', width: 120 },
    { field: 'views', headerName: '#views', width: 60, renderCell: (params) => { return (<Typography fontSize={"12px"}>{params.row.views.length}</Typography>) } },
    { field: 'challengesCompleted', headerName: '#Chall. completed', width: 110, renderCell: (params) => { return (<Typography>{params.row.challengesCompleted.length}</Typography>) } },
    { field: 'created', headerName: 'Entry date', width: 90, renderCell: (params) => { return (<Typography fontSize={"12px"}>{(new Date(params.row.created)).toISOString().split("T")[0]}</Typography>) } },
  ];

  console.log('allUsers: ', allUsers);
  const rows = allUsers.map((user, index) => ({
    id: index,
    _id: user._id,
    profilePicture: user.profilePicture,
    alias: user.alias,
    nombre: user.nombre,
    friendsIds: user.friendsIds,
    created: user.created,
    saldo: user.saldo,
    challengesCompleted: user.challengesCompleted,
    userLevel: user.userLevel,
    views: user.views,
    socialLinks: user.socialLinks,
    bioInfo: user.bioInfo,
    estado: user.estado,
    email: user.email,
    isVerified: user.isVerified,
  }))


  return (
    <MainLayout
      title={'DeepLink admin users management'}
      pageDescription={'DeepLink admin users management page'}
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
          maxWidth="1330px"
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
                Users management<LastPage sx={{ fontSize: "34px" }} />
              </Typography>
            </Box>



            <Button
              startIcon={<AddOutlined />}
              color="primary"
              // href="/admin/usersManagment/new"
              sx={{ marginRight: "10px", minWidth: "180px", boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)" }}
              onClick={() => {
                dispatch(setSelectedUser({ selectedUser: null }));
                router.push("/admin/usersManagment/new")
              }}
            >
              Create user
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





export default UsersManagmentPage