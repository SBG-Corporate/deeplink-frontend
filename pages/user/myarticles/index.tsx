import { useContext } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Typography, Grid, Link, Box, Button, CardMedia, Switch } from '@mui/material';
import { DataGrid, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { AddOutlined, LastPage } from '@mui/icons-material';
import { MessagesContext } from '/app/context/messages';
import { MainLayout } from '/app/components/layouts';
import { apiCall } from '/app/utils/api/apiUtils';
import { switchColor } from '/app/config/constants';


const HistoryPage = () => {
  const router = useRouter()
  const { messagesNews, messagesNewsWithNotValidated, toggleUpdateMessages, allAlias } = useContext(MessagesContext);
  const themeMode = useSelector((state: any) => state.persisted?.themeMode);
  const user = useSelector((state: any) => state.persisted?.user);
  const token = useSelector((state: any) => state.persisted?.token);
  const { pageType } = router.query

  const handleSwitchChange = async (postId: string) => {
    const { status, data } = await apiCall({ type: "post", url: `/msg/toggleValidateNew/${postId}`, token });
    if (status === 200) {
      if (data.articleData.isValidated) { toast.success("Article validated") }
      else { toast("Article invalidated") }
      toggleUpdateMessages()
    } else {
      toast.error("There was an error when validating the article, please contact wiht the administrator")
    }
  };

  const columns: any[] = [
    {
      field: 'postMainImage',
      headerName: 'Main image',
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <a href={`/article/${row.slug}`} target="_blank" rel="noreferrer">
            <CardMedia
              component='img'
              alt={row.title}
              className='fadeIn'
              image={row.postMainImage}
            />
          </a>
        )
      }
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 160,
      renderCell: (params: GridValueGetterParams) => (
        <Typography
          variant="body2"
          noWrap // Ensures the title text doesn't overflow
          title={params.value} // Shows the full title on hover
        >
          {params.value}
        </Typography>
      )
    },
    pageType === "management" ?
      {
        field: 'isValidated',
        headerName: 'Is active?',
        width: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Switch
            checked={params.row.isValidated}
            onChange={(event) => handleSwitchChange(params.row._id)}
            color="primary"
            sx={switchColor}
          />
        )
      } :
      {
        field: 'isValidated',
        headerName: 'State',
        width: 90,
        renderCell: (params: GridRenderCellParams) => (
          <Typography color={params.row.isValidated ? "#008000" : "#9F0000"}>
            {params.row.isValidated ? "Accepted" : "Pending"}
          </Typography>
        )
      }
    ,
    {
      field: 'post',
      headerName: 'View article',
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <NextLink href={`/article/${params.row.slug}`} passHref legacyBehavior>
            <Link
              underline='always'
              target="_blank"
              rel="noopener noreferrer"
            >
              View article
            </Link>
          </NextLink>
        )
      }
    },
    {
      field: 'editPost',
      headerName: 'Edit article',
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <NextLink href={`/user/myarticles/${params.row.slug}?pageType=management`} passHref legacyBehavior>
            <Link underline='always'>
              Edit article
            </Link>
          </NextLink>
        )
      }
    },
    pageType === "management" ? { field: 'creator', headerName: 'Creator', width: 120 } : null,
    { field: 'views', headerName: 'No. of views', width: 120 },
    { field: 'likes', headerName: 'No. of likes', width: 100 },
    { field: 'comments', headerName: 'No. of comments', width: 120 },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
      renderCell: (params: GridValueGetterParams) => (
        <Typography
          variant="body2"
          noWrap // Ensures the title text doesn't overflow
          title={params.value} // Shows the full title on hover
        >
          {params.value}
        </Typography>
      )
    },
  ].filter(Boolean);


  let rows = messagesNews
    .filter((message) => message.id_user === user._id)
    .map((post, index) => ({
      id: index,
      _id: post._id,
      postMainImage: post.files[0].url,
      slug: post.slug,
      title: post.articleData.title,
      description: post.subject,
      likes: post.likes.length,
      views: post.views.length,
      comments: post.comments.length,
      isValidated: post.articleData.isValidated,
      creator: allAlias[post.id_user]
    }))


  if (pageType === "management") {
    const messagesNewsWithNotValidatedAux = messagesNewsWithNotValidated.map((post, index) => ({
      id: rows.length + index, // Ensure unique IDs
      _id: post._id,
      postMainImage: post.files[0].url,
      slug: post.slug,
      title: post.articleData.title,
      description: post.subject,
      likes: post.likes.length,
      views: post.views.length,
      comments: post.comments.length,
      isValidated: post.articleData.isValidated,
      creator: allAlias[post.id_user]
    }));
    rows = messagesNewsWithNotValidatedAux
  }


  return (
    <MainLayout
      title={'DeepLink user my articles'}
      pageDescription={'DeepLink user my articles page'}
    >
      <Box marginLeft={"100px"} padding={{ xs: "20px", md: "20px 50px" }}>
        <Box
          margin={"50px 0"}
          padding={"20px"}
          display={"flex"}
          flexDirection={"column"}
          width={"100%"}
          maxWidth="1400px"
          height={"100%"}
          boxShadow={" 0 0 10px rgba(0, 0, 0, 0.1)"}
          borderRadius={"30px"}
        >
          <Box display='flex' justifyContent='space-between' sx={{ mb: 2 }}>
            <Box width={"100%"} display={"flex"} justifyContent={"start"}>
              <Typography
                margin={"-85px 0  0px 20px"}
                // marginTop={"-10px"}
                fontFamily={"Montserrat"}
                fontWeight={"600"}
                fontSize={"50px"}
                color={themeMode === "light" ? "#dedede" : "#202223"}
                sx={{ zIndex: "90" }}
              >
                {pageType === "management" ? "Articles management" : "My articles"}
                <LastPage sx={{ fontSize: "34px" }} />
              </Typography>
            </Box>
            {pageType !== "management" &&
              <Button
                startIcon={<AddOutlined />}
                color="primary"
                href="/user/myarticles/new"
                sx={{ marginRight: "10px", minWidth: "150px", boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)" }}
              >
                Create article
              </Button>
            }
          </Box>
          {messagesNews.length === 0 ?
            <Box height={"300px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
              <Typography fontSize={"26px"}>
                You don&apos;t have articles
              </Typography>
            </Box>
            :
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
          }
        </Box>
      </Box>
    </MainLayout>
  )
}





export default HistoryPage