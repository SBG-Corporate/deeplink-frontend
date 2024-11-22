import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import NextLink from 'next/link';
import { Box, CardMedia, Grid, Typography, IconButton, Tooltip, Divider, Link } from '@mui/material';
import { ArrowCircleLeftOutlined, ArrowCircleRightOutlined, BookmarkAdd, BookmarkAddOutlined, LocalFireDepartment, LocalFireDepartmentOutlined, ModeCommentOutlined, ShareOutlined } from '@mui/icons-material';
import BarChartIcon from '@mui/icons-material/BarChart';
import { MainLayout } from '/app/components/layouts';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '/app/interfaces';
import { MessagesContext } from '/app/context/messages';
import { IMessageParsed } from '/app/interfaces';
import { messageInit } from '/app/config/constants';
import { setFriends, setUserFavoriteArticles } from '/app/store/slices/user/userSlice';
import { apiAddLike, apiIncreaseViews, apiRemoveLike } from '/app/utils/api/apiMessages';
import { ShareMenu } from '/app/components/articles/ShareMenu';
import { dateToBeauty, getReadTime } from '/app/utils/generalUtils';
import { PostComment } from '/app/components/articles/PostComment';
import { CommentsList } from '/app/components/articles/CommentsList';
import { apiAddFriend, apiDeleteFriend } from '/app/utils/api/apiUsuarios';
import { apiCall } from '/app/utils/api/apiUtils';

const ArticlePage = () => {

  const router = useRouter();
  const { slug } = router.query
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.persisted?.token) || null;
  const user: User = useSelector((state: any) => state.persisted.user);
  const friendsIds = useSelector((state: any) => state.persisted.user?.friendsIds) || [];
  const { messagesNews, allAlias, allProfilePictures, toggleUpdateMessages } = useContext(MessagesContext);

  const [anchorElShare, setAnchorElShare] = useState<null | HTMLElement>(null);
  const [followButtonText, setFollowButtonText] = useState("Follow");
  const [followingPreviousPostSlug, setFollowingPreviousPostSlug] = useState({ following: "", previous: "" });
  const [actualArticle, setActualArticle] = useState<IMessageParsed>(messageInit);
  const [articlesLoaded, setArticlesLoaded] = useState(false);

  useEffect(() => {
    const actualArticleAux = messagesNews.find((article) => article.slug === slug)
    if (actualArticleAux === undefined) return

    setActualArticle(actualArticleAux)
    setArticlesLoaded(true)
  }, [messagesNews])


  const savePost = async () => {
    if (user.estado === 0) {
      toast.error("You must be registered in to save this article")
      return
    }

    const { status, data } = await apiCall({ type: "post", url: `/user/toggleMsgToFavorites/${actualArticle._id}`, token });
    if (status === 200) {
      dispatch(setUserFavoriteArticles({ favoriteArticles: data.favoriteArticles }));
      if (data.favoriteArticles.includes(actualArticle._id)) {
        toast.success(`Article saved in my articles section`)
      } else {
        toast(`Article removed from favorites`)
      }

      return;
    }
    else {
      toast.error("Server error, please contact with the admin")
    }
  }

  const patchLikePost = async () => {
    if (!user || user.estado === 0) {
      toast.error("You must be registered in to give a like");
      return;
    }

    const userLikeIndex = actualArticle.likes.findIndex(like => like.id_user === user._id);

    let status, data: any;
    if (userLikeIndex !== -1) {
      ({ status, data } = await apiRemoveLike(actualArticle._id, token));
    } else {
      ({ status, data } = await apiAddLike(actualArticle._id, token))
    }

    setActualArticle(data)
    toggleUpdateMessages()
  };

  const onFollowUser = async () => {

    if (!user || user.estado === 0) {
      toast.error("You must be registered in to follow a user");
      return;
    }

    let status, data;

    if (friendsIds.includes(actualArticle.id_user)) {
      ({ status, data } = await apiDeleteFriend({ friendId: actualArticle.id_user, token }));
    } else {
      ({ status, data } = await apiAddFriend({ friendId: actualArticle.id_user, token }));
    }

    dispatch(setFriends({ friendsIds: data.amigos }));
  }

  useEffect(() => {
    const increaseViews = async () => {
      const { status, data } = await apiIncreaseViews(actualArticle._id, token, "msg")
    };

    if (!articlesLoaded) return

    if (!actualArticle.views.includes(user._id)) {
      increaseViews()
    }
  }, [actualArticle]);

  useEffect(() => {
    if (!user) return

    const isFollowing = user.friendsIds.includes(actualArticle.id_user);
    if (isFollowing) {
      setFollowButtonText("Unfollow")
    } else {
      setFollowButtonText("Follow")
    }
  }, [actualArticle, user])

  useEffect(() => {
    if (messagesNews.length === 0) return

    let followingPostSlug = ""
    let previousPostSlug = ""
    messagesNews.map((post, index) => {
      if (post.slug === slug) {
        if (index === 0) {
          followingPostSlug = messagesNews[index + 1].slug
          return
        }
        if (index === messagesNews.length - 1) {
          previousPostSlug = messagesNews[index - 1].slug
          return
        }

        followingPostSlug = messagesNews[index + 1].slug
        previousPostSlug = messagesNews[index - 1].slug
      }
    })
    setFollowingPreviousPostSlug({ following: followingPostSlug, previous: previousPostSlug })
  }, [messagesNews, slug])


  return (
    <MainLayout
      title={'DeepLink article'}
      pageDescription={'DeepLink article page'}
    >

      <Box padding={{ xs: "20px", sm: "50px" }} boxShadow={"0 10px 15px -5px #d1f2ff"} sx={{ zIndex: 1, position: 'relative', backgroundColor: "white" }}>
        <Grid container spacing={2}>
          <Grid item xs={0} sm={2} />
          <Grid item xs={0} sm={4}>
            <Box padding={"20px"} height={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"start"}>
              <Typography variant='h2' fontSize={"34px"}>{actualArticle.articleData.title}</Typography>
              <Box display={"flex"} flexDirection={"column"} width={"100%"}>
                <Box marginTop={"10px"} display={"flex"} flexDirection={"row"} alignItems={"center"}>
                  <NextLink href={`/profile/${allAlias[actualArticle.id_user]}`} passHref legacyBehavior>
                    <CardMedia
                      image={allProfilePictures[actualArticle.id_user]}
                      component='img'
                      alt='User profile picture'
                      sx={{ padding: "10px", borderRadius: '50px', height: "60px", width: "60px", cursor: "pointer" }}
                    />
                  </NextLink>
                  <Box display={"flex"} flexDirection={"column"} marginTop={"7px"}>
                    <Box display={"flex"} flexDirection={"row"}>
                      <NextLink href={`/profile/${actualArticle.id_user}`} passHref legacyBehavior>
                        <Typography variant="body1" marginBottom={"3px"} fontSize={"16px"} fontWeight={"bold"} sx={{ cursor: "pointer" }}>{allAlias[actualArticle.id_user]}</Typography>
                      </NextLink>
                      {user._id !== actualArticle.id_user &&
                        <Typography
                          variant="body1"
                          marginBottom={"3px"}
                          fontSize={"16px"}
                          color={followButtonText === "Follow" ? "#0000BF" : "#9F0000"}
                          onClick={onFollowUser}
                          sx={{ cursor: "pointer" }}>
                          &nbsp;·&nbsp;{followButtonText}
                        </Typography>
                      }
                    </Box>
                    <Typography variant='body1' fontSize={"16px"} fontWeight={300} color={"gray"}>{`${getReadTime(actualArticle.articleData.contentNews)} min of reading · ${dateToBeauty(new Date(actualArticle.created).toISOString())}`}</Typography>
                  </Box>
                </Box>

                <Divider sx={{ marginTop: "10px" }} />
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Box margin={"5px 0 0 15px"} display={"flex"} flexDirection={"row"} alignItems={"center"} >
                    {/* <LocalFireDepartmentOutlined sx={{ fontSize: "20px", color: "gray" }} /> */}
                    <Tooltip title="Article likes">
                      <IconButton onClick={patchLikePost} sx={{ padding: "0" }}>
                        {actualArticle.likes.some(like => like.id_user === user?._id) ? (
                          <LocalFireDepartment sx={{ fontSize: "20px", color: "red" }} />
                        ) : (
                          <LocalFireDepartmentOutlined sx={{ fontSize: "20px", color: "gray" }} />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body1" margin={"3px 10px 0 3px"} fontSize={"16px"} color={"gray"}>{actualArticle.likes.length}</Typography>
                    <Tooltip title="Article comments">
                      <ModeCommentOutlined sx={{ fontSize: "20px", color: "gray" }} />
                    </Tooltip>
                    <Typography variant="body1" margin={"3px 10px 0 3px"} fontSize={"16px"} color={"gray"}>{actualArticle.comments.length}</Typography>

                    <Tooltip title="Article views">
                      <BarChartIcon sx={{ fontSize: "20px", color: "gray" }} />
                    </Tooltip>
                    <Typography variant="body1" margin={"3px 0 0 3px"} fontSize={"16px"} color={"gray"}>{actualArticle.views.length}</Typography>
                  </Box>

                  <Box margin={"5px 0 0 15px"} display={"flex"} flexDirection={"row"} alignItems={"center"} >
                    <Tooltip title="Guardar artículo">
                      <IconButton onClick={savePost} sx={{ padding: "0" }}>
                        {user?.favoriteArticles.some(postId => postId === actualArticle._id) ? (
                          <BookmarkAdd sx={{ marginRight: "15px", fontSize: "20px", color: "#3a64d8" }} />
                        ) : (
                          <BookmarkAddOutlined sx={{ marginRight: "15px", fontSize: "20px", color: "gray" }} />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Share article">
                      <IconButton onClick={(event) => setAnchorElShare(event.currentTarget)}>
                        <ShareOutlined sx={{ marginRight: "15px", fontSize: "20px", color: "gray" }} />
                      </IconButton>
                    </Tooltip>
                    <ShareMenu
                      anchorEl={anchorElShare}
                      onClose={() => setAnchorElShare(null)}
                      postUrl={`/article/${actualArticle.slug}`}
                    />

                  </Box>

                </Box>
                <Divider sx={{ marginTop: "5px" }} />

              </Box>

            </Box>
          </Grid>
          <Grid item xs={0} sm={4}>
            <CardMedia
              image={actualArticle.files.length !== 0 ? actualArticle.files[0].url : ""}
              component='img'
              alt='Article main image'
              sx={{ padding: "10px", borderRadius: '30px', maxHeight: "400px" }}
            />
          </Grid>
          <Grid item xs={0} sm={2} />
        </Grid>
      </Box>

      <Grid container spacing={2} marginTop={"-20px"}>
        <Grid item xs={0} sm={0} md={2} />
        <Grid item xs={12} sm={12} md={6}>
          <Box
            padding={{ xs: "20px", sm: "70px" }}
            // boxShadow={"0 0 60px 0 #d1f2ff, 0 0 60px 0 #d1f2ff"}
            sx={{ boxShadow: "0 0 60px 0 #d1f2ff" }}
          >
            {actualArticle.articleData.contentNews.map((element, index) => {
              if (element.type === "text") {
                return (
                  <Box key={index} marginTop={"30px"}>
                    <Typography variant='body1' fontSize={"18px"}>{element.value}</Typography>
                  </Box>
                )
              } else {
                return (
                  <Box key={index} marginTop={"40px"}>
                    <CardMedia
                      image={element.value}
                      component='img'
                      alt='Imagen del post'
                      sx={{ padding: "10px", borderRadius: '50px' }}
                    />
                  </Box>
                )
              }
            })}

            <Box marginTop={"20px"} display={"flex"} justifyContent={"space-between"}>
              <Box >
                <Link href={`/article/${followingPreviousPostSlug.previous}`} >
                  <Box display={followingPreviousPostSlug.previous !== "" ? "flex" : "none"} sx={{ cursor: "pointer" }}>
                    <ArrowCircleLeftOutlined fontSize="large" />
                  </Box>
                </Link>
              </Box>

              <Box >
                <Link href={`/article/${followingPreviousPostSlug.following}`} >
                  <Box display={followingPreviousPostSlug.following !== "" ? "flex" : "none"} sx={{ cursor: "pointer" }}>
                    <ArrowCircleRightOutlined fontSize="large" />
                  </Box>
                </Link>
              </Box>

            </Box>

          </Box>
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
            <Typography margin="40px" variant="h3"> Comments</Typography>
            <PostComment selectedPost={actualArticle} setSelectedPost={setActualArticle} />
            <CommentsList post={actualArticle} />
          </Box>
        </Grid>

      </Grid>

    </MainLayout>
  )
}


export default ArticlePage;
