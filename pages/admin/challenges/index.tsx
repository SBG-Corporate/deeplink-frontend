import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useSelector } from 'react-redux';
import { Typography, Grid, Link, Box, Button, Backdrop, CircularProgress, Switch, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { AddOutlined, Delete, Edit, LastPage } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { MessagesContext } from '/app/context/messages';
import { MainLayout } from '/app/components/layouts';
import { IChallenge } from '/app/interfaces/Challenges';
import { apiCall } from '/app/utils/api/apiUtils';
import { getIconFromChallenge } from '/app/utils/challenges';
import PopupRemovePost from '/app/components/home/PopupRemovePost';
import { switchColor } from '/app/config/constants';


const HistoryPage = () => {
  const themeMode = useSelector((state: any) => state.persisted?.themeMode);
  const token = useSelector((state: any) => state.persisted.token);

  const { allAlias } = useContext(MessagesContext);

  const [allChallenges, setAllChallenges] = useState<IChallenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [deleteChallengeId, setDeleteChallengeId] = useState("");
  const [updateChallenge, setUpdateChallenge] = useState(false);

  const columns: GridColDef[] = [
    {
      field: 'order',
      headerName: 'Order',
      width: 65,
      renderCell: (params: GridRenderCellParams) => {

        return (
          <Box width={"100%"} display={"flex"} justifyContent={"center"}>
            <Typography>{params.row.order}</Typography>
          </Box>
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
          <NextLink href={`/admin/challenges/${params.row.slug}`} passHref legacyBehavior>
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
      headerName: 'Is active?',
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
    { field: 'nombre', headerName: 'Title', width: 400 },
    { field: 'objetivoDeChallenge', headerName: 'Objetive', width: 80 },
    { field: 'recompensa', headerName: 'Rewards', width: 80 },
    { field: 'creador', headerName: 'creador', width: 120 },
    {
      field: 'icon',
      headerName: 'Icon',
      width: 40,
      renderCell: (params: GridRenderCellParams) => {
        const icon = getIconFromChallenge(params.row.tipoDeChallenge, 22)
        return (
          <>
            {icon}
          </>
        )
      }
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 40,
      renderCell: (params: GridRenderCellParams) => {
        const handleDeleteChallenge = async () => {
          setDeleteChallengeId(params.row._id)
          setOpenDeletePopup(true)
        };
        return (
          <IconButton onClick={handleDeleteChallenge}>
            <Delete />
          </IconButton>
        )
      }
    },
  ];

  const rows = allChallenges.map((challenge, index) => ({
    id: index,
    _id: challenge._id,
    slug: challenge.slug,
    nombre: challenge.nombre,
    descripcion: challenge.descripcion,
    tipoDeChallenge: challenge.tipoDeChallenge,
    objetivoDeChallenge: challenge.objetivoDeChallenge,
    recompensa: challenge.recompensa,
    creador: allAlias[challenge.creador],
    isEnabled: challenge.isEnabled,
    order: challenge.order,
  }))

  const handleSwitchChange = async (challengeId: string) => {
    const { status, data } = await apiCall({ type: "post", url: `/challenges/toggleEnable/${challengeId}`, token });
    if (status === 200) {
      setUpdateChallenge(prev => !prev)
    }
  };

  const deleteChallenge = async () => {
    const { status, data } = await apiCall({ type: "delete", url: `/challenges/delete/${deleteChallengeId}`, token });
    if (status === 200) {
      setUpdateChallenge(prev => !prev)
      toast.success("Challenge deleted")
    } else {
      toast.error("There was an error deleting the challenge, please contact wiht the administrator")
    }

    setOpenDeletePopup(false)
  };

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
  }, [updateChallenge])

  return (
    <MainLayout
      title={'DeepLink admin challenges management'}
      pageDescription={'DeepLink admin challenges management'}
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
          maxWidth="1200px"
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
                Challenges management<LastPage sx={{ fontSize: "34px" }} />
              </Typography>
            </Box>
            <Button
              startIcon={<AddOutlined />}
              color="primary"
              href="/admin/challenges/new"
              sx={{ marginRight: "10px", minWidth: "180px", boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)" }}
            >
              Create challenge
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
        onDeletePost={deleteChallenge}
        text={"This challenge is going to be deleted, are you sure?"}
      />


    </MainLayout>
  )
}





export default HistoryPage