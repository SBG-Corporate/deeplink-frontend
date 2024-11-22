import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LastPage } from "@mui/icons-material";
import { Box, Grid, Skeleton, Typography, useTheme } from "@mui/material";
import SponsoredNews from "/app/components/news/SponsoredNews";
import NewsFiltersNavbar from "/app/components/news/NewsFiltersNavbar";
import NewsBox from "/app/components/news/NewsBox";
import { setPageType } from "/app/store/slices/user/userSlice";
import { CheckTokenExpiresLayout } from "/app/components/common/CheckTokenExpiresLayout";
import { MainLayout } from "/app/components/layouts";
import { MessagesContext } from "/app/context/messages";
import { IMessageParsed } from "/app/interfaces";
import RoundedButton from "/app/components/common/RoundedButton";


const MessagesPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const dark = theme.palette.neutral.dark;
  const themeMode = useSelector((state: any) => state.persisted?.themeMode);
  const { messagesNews, isLoadingMessages } = useContext(MessagesContext);

  const [newsFilter, setNewsFilter] = useState("latestNews");
  const [filteredNews, setFilteredNews] = useState<IMessageParsed[]>([]);
  const [showItems, setShowItems] = useState(6);

  useEffect(() => {
    setFilteredNews(messagesNews)
  }, [messagesNews])


  useEffect(() => {
    if (messagesNews.length === 0) return
    if (newsFilter === "latestNews") {
      const newFilterNews = messagesNews.filter(filteredNew => filteredNew.articleData.isValidated);
      setFilteredNews(newFilterNews)
    }
    else {
      const newFilterNews = messagesNews.filter(filteredNew => filteredNew.articleData.isValidated).filter(filteredNew => filteredNew.articleData.category === newsFilter);
      setFilteredNews(newFilterNews)
    }
  }, [newsFilter])

  useEffect(() => {
    dispatch(setPageType({ pageType: "news", }));
  }, []);


  return (
    <MainLayout
      title={'DeepNews'}
      pageDescription={'DeepLink news page'}
    >
      <CheckTokenExpiresLayout />
      <Box
        width={"calc(100vw - 100px)"}
        marginLeft={"50px"}
      >
        <Box display={"flex"}>
          <Typography
            marginLeft={"100px"}
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
            News
            <LastPage sx={{ marginLeft: "0px", fontSize: "40px" }} />
          </Typography>
        </Box>
        <Box
          marginTop={"30px"}
          display={"flex"}
          width={"100%"}
          height={"100%"}
          sx={{
            borderRadius: "0 0 0.75rem 0.75rem",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box
            m="-30px 50px 50px 100px"
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"start"}
            width={"100%"}
            height={"100%"}
            sx={{
              boxShadow: "3",
              borderRadius: "50px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <NewsFiltersNavbar
                  newsFilter={newsFilter}
                  setNewsFilter={setNewsFilter}
                />
                {isLoadingMessages ?
                  <Grid container spacing={2} marginBottom={"30px"}>
                    {[0, 1, 2, 3, 4, 5].map((index) => {
                      return (
                        <Grid key={index} item lg={6} xl={4} >
                          <Box width={"100%"} marginLeft={"20px"}>
                            <Skeleton variant="text" height={30} width="100%" sx={{ marginTop: "35px" }} />
                            <Skeleton variant="text" height={60} width="100%" sx={{ marginTop: "-10px" }} />
                            <Skeleton variant="rectangular" height={180} sx={{ marginTop: "-5px" }} />
                          </Box>
                        </Grid>
                      )
                    })}
                  </Grid>
                  :
                  <Grid container spacing={2}>
                    {filteredNews.map((filteredNew, index) => {
                      if (index <= showItems - 1) {
                        return (
                          <Grid key={index} item lg={6} xl={4} >
                            <NewsBox
                              newData={filteredNew}
                              onClick={() => { }}
                            />
                          </Grid>
                        )
                      }
                    })}
                  </Grid>
                }
                {filteredNews.length > 6 && <Grid item xs={12}>
                  <Box display="flex" justifyContent={"center"} alignItems="center" p="1rem" onClick={() => setShowItems(prev => prev === 6 ? filteredNews.length : 6)}>
                    <RoundedButton onClick={() => { }} text={showItems === 6 ? "See all" : "Hide articles"} color={dark} />
                  </Box>
                </Grid>
                }
              </Grid>
              <Grid item xs={4}>
                <Box marginLeft={"20px"} height={"100%"}>
                  <SponsoredNews />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default MessagesPage;
