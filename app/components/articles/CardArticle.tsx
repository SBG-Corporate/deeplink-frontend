import { FC } from "react";
import NextLink from 'next/link';
import { Box, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material";
import { IMessageParsed } from "/app/interfaces";

interface Props {
  post: IMessageParsed;
}

export const CardArticle: FC<Props> = ({ post }) => {
  return (
    <NextLink href={`/article/${post.slug}`} passHref legacyBehavior>
      <Grid container spacing={2} key={post.slug} sx={{ ":hover": { opacity: "0.6", cursor: "pointer" } }}>
        <Grid item xs={12} sm={4}>
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
            <Link>
              <CardActionArea>
                <CardMedia
                  image={post.files[0].url}
                  component='img'
                  alt='Imagen principal del post'
                  sx={{ padding: "10px", borderRadius: '30px', maxHeight: "180px" }}
                />
              </CardActionArea>
            </Link>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Box padding={"10px"}>
            <Link sx={{ textDecoration: 'none' }}>
              <Typography variant="h2" fontWeight={600} fontSize={"20px"} sx={{ lineHeight: '1', marginBottom: "7px" }} >{post.articleData.title}</Typography>
            </Link>
            <Typography variant="body1" fontSize={"13px"}>
              {post.subject}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </NextLink>
  );
};
