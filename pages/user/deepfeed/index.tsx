import React, { useContext, useEffect, useState } from "react";
import { Box, CardMedia, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import FlexBetween from "/app/components/common/FlexBetween";
import { LastPage } from "@mui/icons-material";
import { useRouter } from "next/router";
import FavoriteIcon from '@mui/icons-material/Favorite';
import MessageIcon from '@mui/icons-material/Message';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ShowThread from "/app/components/deepfeed/ShowThread";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CheckTokenExpiresLayout } from "/app/components/common/CheckTokenExpiresLayout";
import { setPageType } from "/app/store/slices/user/userSlice";
import { MainLayout } from "/app/components/layouts";
import { MessagesContext } from "/app/context/messages";
import { relevantThreadsAux } from "/app/config/provisionalData";


const DeepFeedPage = () => {
  const dispatch = useDispatch();
  const router = useRouter()
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const themeMode = useSelector((state: any) => state.persisted?.themeMode);
  const { messagesPostsTrending, allProfilePictures } = useContext(MessagesContext);

  const [threadId, setThreadId] = useState(0);
  const [threadTopic, setThreadTopic] = useState("forYou");
  const [relevantThreads, setRelevantThreads] = useState(relevantThreadsAux);

  useEffect(() => {
    const filteredRelevantThreads = relevantThreadsAux.filter((thread) => thread.topic === threadTopic)
    setRelevantThreads(filteredRelevantThreads)
    setThreadId(0)
  }, [threadTopic])

  useEffect(() => {
    dispatch(setPageType({ pageType: "deepfeed", }));
  }, []);

  return (
    <MainLayout
      title={'DeepFeed'}
      pageDescription={'DeepLink trending posts'}
    >
      <Box >
        <CheckTokenExpiresLayout />
        <Box margin={"0 0 50px 100px"}>

          <Box display={"flex"}>
            <Typography
              marginLeft={"80px"}
              fontFamily={"Montserrat"}
              fontWeight={"500"}
              fontSize={"50px"}
              color={themeMode === "light" ? "#dedede" : "#202223"}
              sx={{ zIndex: "90" }}
            >
              Deep
            </Typography>

            <Typography
              fontFamily={"Montserrat"}
              fontWeight={"700"}
              fontSize={"50px"}
              color={themeMode === "light" ? "#dedede" : "#202223"}
              sx={{ zIndex: "90" }}
            >
              Feed
              <LastPage sx={{ marginLeft: "0px", fontSize: "40px" }} />
            </Typography>
          </Box>

          <Box display={"flex"} marginLeft={"50px"}>
            <Box
              width={"550px"}
              margin={"0 30px"}
              display={"flex"}
              alignItems={"end"}
              flexDirection={"column"}
              boxShadow={"0 0 10px rgba(0, 0, 0, 0.1)"}
              borderRadius={"20px"}
              sx={{ bgcolor: "#f7feff" }}
            >
              <FlexBetween width={"100%"} sx={{ padding: "20px 0 0 40px", margin: "20px" }}>
                <Box display={"flex"} alignItems={"center"}>
                  <WhatshotIcon style={{ fontSize: "28px" }} />
                  <Typography color={dark} variant="h5" fontWeight="900" fontSize={"20px"} fontFamily={"Montserrat"}>
                    Trending
                  </Typography>
                </Box>
              </FlexBetween >

              {messagesPostsTrending.slice(0, 3).map((topPost, index) => (
                <Box
                  key={index}
                  width={index === 0 ? "380px" : index === 1 ? "370px" : "360px"}
                  margin={"15px 80px"}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  maxWidth="400px"
                  boxShadow={"0 0 10px rgba(0, 0, 0, 0.1)"}
                  borderRadius={"20px"}
                  sx={{ bgcolor: "white", ":hover": { cursor: "pointer" } }}
                  onClick={() => router.push(`/post/${topPost._id}`)}
                >

                  <Typography
                    fontSize={"90px"}
                    fontFamily={"Montserrat Alternates"}
                    fontWeight={900}
                    sx={{
                      position: 'relative',
                      left: -20,
                      top: -40,
                      zIndex: 1,
                      opacity: 0.1
                    }}
                  >
                    {index + 1}
                  </Typography>

                  <Grid container spacing={2} alignItems="center">


                    <Box
                      margin={"-15px 0 0 20px"}
                      display={"flex"}
                      justifyContent={"end"}
                      alignItems={"center"}
                      width={"100%"}
                      sx={{
                        position: 'relative',
                        right: -20,
                        top: 8,
                        zIndex: 1,
                      }}
                    >
                      <Box padding={"3px 5px"} border={"solid 1px black"} borderRadius={"30px"} sx={{ bgcolor: "white" }}>
                        <Typography fontSize={"10px"} fontWeight={900} fontFamily={"Montserrat Alternates"}>
                          <GpsFixedIcon style={{ marginRight: "1px" }} /> {index === 0 ? "x2" : index === 1 ? "x1.75" : "x1.5"}
                        </Typography>
                      </Box>
                    </Box>

                    <Grid item xs={3}>

                      <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
                        <CardMedia
                          component="img"
                          src={allProfilePictures[topPost.id_user]}
                          alt="News image"
                          sx={{ width: "70px", height: "70px", borderRadius: "50px" }}
                        />
                        <Typography fontSize={"10px"} fontWeight={900} fontFamily={"Montserrat Alternates"}>
                          {topPost.alias}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={9}>
                      <Box margin={"0 30px 0 0"} display={"flex"} alignItems={"start"} flexDirection={"column"}>
                        <Typography marginBottom={"3px"} fontSize={"8px"} fontWeight={600} fontFamily={"Montserrat"} sx={{ opacity: 0.6 }}>{topPost.created} ago</Typography>
                        <Typography fontSize={"10px"} fontWeight={500} fontFamily={"Roboto"}>
                          {topPost.msg.length >= 140 ? `${topPost.msg.slice(0, 139)}...` : topPost.msg}
                        </Typography>
                      </Box>

                      <Box marginTop={"10px"} display={"flex"} alignItems={"center"} >
                        <FavoriteIcon style={{ fontSize: "12px" }} />
                        <Typography marginRight={"10px"} fontSize={"10px"} fontWeight={900}>{topPost.likes.length}</Typography>
                        <MessageIcon style={{ fontSize: "12px" }} />
                        <Typography fontSize={"10px"} fontWeight={900}>{topPost.comments.length}</Typography>
                      </Box>
                    </Grid>

                  </Grid>

                </Box>
              ))}
            </Box>

            <Box
              width={"650px"}
              margin={"0 30px 30px 30px"}
              boxShadow={"0 0 10px rgba(0, 0, 0, 0.1)"}
              borderRadius={"20px"}
            >
              <Box display={"flex"} sx={{ paddingTop: "20px", margin: "20px", gridColumn: "span  3" }}>
                <Typography onClick={() => setThreadTopic("forYou")} color={dark} variant="h5" fontWeight={threadTopic === "forYou" ? "900" : "600"} fontFamily={"Montserrat"} fontSize={"20px"} sx={{ "&:hover": { opacity: 0.7, cursor: "pointer", } }}>
                  For you
                </Typography>
                <Typography marginLeft={"30px"} onClick={() => setThreadTopic("market")} color={dark} variant="h5" fontWeight={threadTopic === "market" ? "900" : "600"} fontFamily={"Montserrat"} fontSize={"20px"} sx={{ "&:hover": { opacity: 0.7, cursor: "pointer", } }}>
                  Market
                </Typography>
                <Typography marginLeft={"30px"} onClick={() => setThreadTopic("blockchain")} color={dark} variant="h5" fontWeight={threadTopic === "blockchain" ? "900" : "600"} fontFamily={"Montserrat"} fontSize={"20px"} sx={{ "&:hover": { opacity: 0.7, cursor: "pointer", } }}>
                  Blockchain
                </Typography>
                <Typography marginLeft={"30px"} onClick={() => setThreadTopic("nfts")} color={dark} variant="h5" fontWeight={threadTopic === "nfts" ? "900" : "600"} fontFamily={"Montserrat"} fontSize={"20px"} sx={{ "&:hover": { opacity: 0.7, cursor: "pointer", } }}>
                  NFTs
                </Typography>
                <Typography marginLeft={"30px"} onClick={() => setThreadTopic("defi")} color={dark} variant="h5" fontWeight={threadTopic === "defi" ? "900" : "600"} fontFamily={"Montserrat"} fontSize={"20px"} sx={{ "&:hover": { opacity: 0.7, cursor: "pointer", } }}>
                  DeFi
                </Typography>
              </Box >

              <Box
                display={"flex"}
                alignItems={"center"}
                margin={"30px"}
                borderRadius={"20px"}
              >
                <IconButton sx={{ height: "40px" }} onClick={() => setThreadId(prev => prev === 0 ? relevantThreads.length - 1 : prev - 1)}>
                  <ArrowBackIosNewIcon />
                </IconButton>

                <ShowThread threadData={relevantThreads[threadId]} />

                <IconButton sx={{ height: "40px" }} onClick={() => setThreadId(prev => prev === relevantThreads.length - 1 ? 0 : prev + 1)}>
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>
            </Box >
          </Box>
        </Box >
      </Box >
    </MainLayout>
  );
};

export default DeepFeedPage;
