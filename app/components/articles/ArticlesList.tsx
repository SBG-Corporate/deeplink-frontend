import { FC, useState } from 'react';
import { Typography, Grid, Box, Button } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from '@mui/icons-material';
import { IMessageParsed } from '/app/interfaces';
import { CardArticle } from './CardArticle';

interface Props {
  articles: IMessageParsed[]
}

const ArticlesList: FC<Props> = ({ articles }) => {

  const [currentPage, setCurrentPage] = useState(1);

  const articlesPerPage = 6;
  const indexOfLastPost = currentPage * articlesPerPage;
  const indexOfFirstPost = indexOfLastPost - articlesPerPage;
  const currentPosts = articles.slice(indexOfFirstPost, indexOfLastPost);
  const totalPageCount = Math.ceil(articles.length / articlesPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <Box padding={"30px"} maxWidth={"1400px"} boxShadow={"0 0 10px rgba(0, 0, 0, 0.1)"} borderRadius={"30px"}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {currentPosts.map((post: IMessageParsed, index) => {
              return (
                <Grid key={post._id} item xs={12} xl={6}>
                  <CardArticle post={post} />
                </Grid>
              )
            })}
          </Grid>
        </Grid>
        {articles.length > articlesPerPage &&
          <>
            <Grid item xs={0} sm={3} />
            <Grid item xs={12} sm={6}>
              <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
                <Box display="flex" justifyContent="center" my={2}>
                  <Button color='primary' sx={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }} onClick={() => handlePageChange(1)} disabled={currentPage === 1}><KeyboardDoubleArrowLeft /></Button>
                  <Button color='primary' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} sx={{ marginLeft: "5px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}><KeyboardArrowLeft /></Button>
                  <Button color='primary' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPageCount} sx={{ marginLeft: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}><KeyboardArrowRight /></Button>
                  <Button color='primary' onClick={() => handlePageChange(totalPageCount)} disabled={currentPage === totalPageCount} sx={{ marginLeft: "5px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}><KeyboardDoubleArrowRight /></Button>
                </Box>
                <Typography textAlign="center" sx={{ marginLeft: "10px" }}>
                  Page {currentPage} of {totalPageCount}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={0} sm={3} />
          </>
        }
      </Grid>
    </Box>
  )
}

export default ArticlesList