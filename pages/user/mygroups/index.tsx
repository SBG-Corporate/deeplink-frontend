import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Typography, Grid, Link, Box, Button, CardMedia, Backdrop, CircularProgress, Switch, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { AddOutlined, Delete, Edit, LastPage } from '@mui/icons-material';
import { MessagesContext } from '/app/context/messages';
import { MainLayout } from '/app/components/layouts';
import { apiCall } from '/app/utils/api/apiUtils';
import PopupRemovePost from '/app/components/home/PopupRemovePost';
import { switchColor } from '/app/config/constants';
import { IGroup } from '/app/interfaces';


const HistoryPage = () => {
  const themeMode = useSelector((state: any) => state.persisted?.themeMode);
  const token = useSelector((state: any) => state.persisted.token);
  const { allAlias } = useContext(MessagesContext);

  const [myGroups, setMyGroups] = useState<IGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState("");
  const [updateChallenge, setUpdateChallenge] = useState(false);

  const columns: GridColDef[] = [
    {
      field: 'logo',
      headerName: 'Group image',
      width: 85,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <CardMedia
            component='img'
            alt={row.title}
            className='fadeIn'
            image={row.logo}
            sx={{ width: "50px", height: "50px", borderRadius: "10px" }}
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

        return (
          <NextLink href={`/user/mygroups/${params.row._id}`} passHref legacyBehavior>
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
      field: 'userCanWrite',
      headerName: 'Users can write?',
      width: 105,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Switch
            checked={params.row.userCanWrite}
            onChange={(event) => handleSwitchChange(params.row._id)}
            color="primary"
            sx={switchColor}
          />
        );
      }
    },
    { field: 'nombre', headerName: 'Name', width: 200 },
    { field: 'creador', headerName: 'creador', width: 120 },
    { field: 'category', headerName: 'category', width: 80 },
    { field: 'messages', headerName: 'Total Messages', width: 100 },
    { field: 'created', headerName: 'Creation date', width: 90, renderCell: (params) => { return (<Typography fontSize={"12px"}>{(new Date(params.row.created)).toISOString().split("T")[0]}</Typography>) } },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 40,
      renderCell: (params: GridRenderCellParams) => {
        const handleDeleteGroup = async () => {
          setDeleteGroupId(params.row._id)
          setOpenDeletePopup(true)
        };
        return (
          <IconButton onClick={handleDeleteGroup}>
            <Delete />
          </IconButton>
        )
      }
    },
  ];

  const rows = myGroups.map((group, index) => ({
    id: index,
    _id: group._id,
    nombre: group.nombre,
    miembros: group.miembros.length,
    logo: group.logo,
    icono: group.icono,
    creador: allAlias[group.creador],
    messages: group.messages.length,
    userCanWrite: group.userCanWrite,
    created: group.created,
    edited: group.edited,
    category: group.category,
  }))

  const handleSwitchChange = async (groupId: string) => {
    const { status, data } = await apiCall({ type: "post", url: `/grupo/${groupId}/toggleUsersCanWrite`, token });
    if (status === 200) {
      setUpdateChallenge(prev => !prev)
    }
  };

  const deleteGroup = async () => {
    const { status, data } = await apiCall({ type: "delete", url: `/grupo/${deleteGroupId}`, token });
    if (status === 200) {
      setUpdateChallenge(prev => !prev)
      toast.success("Challenge deleted")
    } else {
      toast.error("There was an error deleting the challenge, please contact wiht the administrator")
    }
    setOpenDeletePopup(false)
  };

  useEffect(() => {
    const getMyGroups = async () => {
      setLoading(true)
      const { status, data } = await apiCall({ type: "get", url: "/grupo/getMyGroups", token });
      if (status === 200) {
        setMyGroups(data)
      }
      setLoading(false)
    };

    getMyGroups()
  }, [updateChallenge])


  return (
    <MainLayout
      title={'DeepLink user my groups'}
      pageDescription={'DeepLink user my groups page'}
    >
      <Box marginLeft={"100px"} padding={{ xs: "20px", md: "20px 50px" }}>
        <Backdrop
          sx={{ color: '#fff', zIndex: 105 }}
          open={loading}
        >
          <Box width={"350px"} display="flex" justifyContent={"center"} flexDirection="column" alignItems="center">
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2 }} textAlign={"center"} fontSize={"20px"}>Loading challenges...</Typography>
          </Box>
        </Backdrop>
        <Box
          margin={"60px 0"}
          padding={"20px"}
          display={"flex"}
          flexDirection={"column"}
          width={"100%"}
          maxWidth="960px"
          height={"100%"}
          boxShadow={" 0 0 10px rgba(0, 0, 0, 0.1)"}
          borderRadius={"30px"}
        >
          <Box display='flex' justifyContent='space-between' sx={{ mb: 2 }}>
            <Box width={"100%"} display={"flex"} justifyContent={"start"}>
              <Typography
                margin={"-85px 0  0px 0px"}
                // marginTop={"-10px"}
                fontFamily={"Montserrat"}
                fontWeight={"600"}
                fontSize={"50px"}
                color={themeMode === "light" ? "#dedede" : "#202223"}
                sx={{ zIndex: "90" }}
              >
                My own groups<LastPage sx={{ fontSize: "34px" }} />
              </Typography>
            </Box>
            <Button
              startIcon={<AddOutlined />}
              color="primary"
              href="/user/mygroups/new"
              sx={{ marginRight: "10px", minWidth: "180px", boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)" }}
            >
              Create group
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

      <PopupRemovePost
        openPopupRemovePost={openDeletePopup}
        handlePopupRemovePostClose={() => { setOpenDeletePopup(false) }}
        onDeletePost={deleteGroup}
        text={"This challenge is going to be deleted, are you sure?"}
      />
    </MainLayout>
  )
}

export default HistoryPage