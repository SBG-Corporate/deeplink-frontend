import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next'
import { Typography, Grid, Chip, Link, Box, Button, CardMedia } from '@mui/material';
import { AddOutlined, KeyboardArrowLeft, KeyboardArrowRight, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, LastPage } from '@mui/icons-material';
import ArticlesList from '/app/components/articles/ArticlesList';
import { MainLayout } from '/app/components/layouts';
import Navbar from '/app/components/ui/Navbar';
import LateralNavbarV2 from '/app/components/home/LateralNavbarV2';
import { useContext, useEffect, useState } from 'react';
import { MessagesContext } from '/app/context/messages';
import { IMessageParsed } from '/app/interfaces';
import { User } from '/app/interfaces';
import { useSelector } from 'react-redux';


const HistoryPage = () => {
  const user: User = useSelector((state: any) => state.persisted.user);
  const themeMode = useSelector((state: any) => state.persisted.themeMode);
  const { isLoadingMessages, messagesNews } = useContext(MessagesContext);

  const [favoriteArticles, setFavoriteArticles] = useState<IMessageParsed[]>([]);

  useEffect(() => {
    if (isLoadingMessages) return
    const favoriteArticlesAux = messagesNews.filter((article) => user.favoriteArticles.includes(article._id))
    setFavoriteArticles(favoriteArticlesAux)
  }, [isLoadingMessages])


  return (
    <MainLayout
      title={'DeepLink user favorite articles'}
      pageDescription={'DeepLink user favorite articles page'}
    >
      <Box marginLeft={"100px"} padding={{ sm: "15px", md: "20px 50px" }}>
        <Typography
          margin={"-10px 0  0px 20px"}
          fontFamily={"Montserrat"}
          fontWeight={"600"}
          fontSize={"50px"}
          color={themeMode === "light" ? "#dedede" : "#202223"}
          sx={{ zIndex: "90" }}
        >
          {"My favorite articles"}
          <LastPage sx={{ fontSize: "34px" }} />
        </Typography>
        <ArticlesList articles={favoriteArticles} />
      </Box>
    </MainLayout>
  )
}

export default HistoryPage