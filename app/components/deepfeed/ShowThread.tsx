import React, { FC } from "react";
import { Box, CardMedia, Typography, useTheme } from "@mui/material";
import MessageIcon from '@mui/icons-material/Message';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { MyPalette } from "/app/themes/types";

interface Props {
  threadData: any
}

const ShowThread: FC<Props> = ({ threadData }) => {
  const { palette } = useTheme<MyPalette>();
  const dark = palette.neutral.dark;

  if (threadData === undefined || threadData.lenght === 0) {
    return (
      <Box width={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Typography>No Threads available</Typography>
      </Box>
    )
  }

  return (
    <Box
      width={"450px"}
      margin={"60px 30px 0 40px"}
      padding={"20px 40px"}
      boxShadow={"0 0 10px rgba(0, 0, 0, 0.1)"}
      borderRadius={"20px"}
    >
      <Box display={"flex"} alignItems={"start"}>
        <Box marginLeft={"-42px"} width={"250px"}>
          <CardMedia
            component="img"
            src={threadData.image}
            alt="User image"
            sx={{ marginTop: "-50px", marginLeft: "20px", width: "100px", height: "100px", borderRadius: "50px" }}
          />
        </Box>
        <Box width={"700px"} marginLeft={"30px"} display={"flex"} alignItems={"start"} justifyContent="start" flexDirection={"column"}>
          <Typography color={dark} variant="h5" fontWeight="900" fontFamily={"Montserrat"} fontSize={"20px"}>
            {threadData.userName}
          </Typography>
          <Typography marginBottom={"3px"} fontSize={"8px"} fontWeight={600} fontFamily={"Montserrat"} sx={{ opacity: 0.6 }}>{threadData.createdAt} ago</Typography>
          <Typography fontSize={"12px"} fontWeight={500} fontFamily={"Roboto"}>
            {threadData.title.length >= 130 ? `${threadData.title.slice(0, 129)}...` : threadData.title}
          </Typography>
          <Box marginTop={"10px"} display={"flex"} alignItems={"center"} >
            <FavoriteIcon style={{ fontSize: "12px" }} />
            <Typography marginRight={"10px"} fontSize={"10px"} fontWeight={900}>{threadData.likes}</Typography>
            <MessageIcon style={{ fontSize: "12px" }} />
            <Typography fontSize={"10px"} fontWeight={900}>{threadData.comments}</Typography>
          </Box>
        </Box>
      </Box>

      {threadData.threads.map((thread: any, index: number) => {
        return (
          <Box key={index} marginTop={"30px"} display={"flex"} alignItems={"start"}>
            <Box width={"150px"}>
              <CardMedia
                component="img"
                src={threadData.image}
                alt="News image"
                sx={{ width: "60px", height: "60px", borderRadius: "50px" }}
              />
            </Box>

            <Box marginLeft={"30px"} display={"flex"} alignItems={"start"} justifyContent="start" flexDirection={"column"}>
              <Typography color={dark} variant="h5" fontWeight="900" fontFamily={"Montserrat"} fontSize={"12px"}>
                {threadData.userName}
              </Typography>
              <Typography marginBottom={"3px"} fontSize={"8px"} fontWeight={600} fontFamily={"Montserrat"} sx={{ opacity: 0.6 }}>{thread.createdAt} ago</Typography>
              <Typography fontSize={"12px"} fontWeight={500} fontFamily={"Roboto"}>
                {thread.text.length >= 130 ? `${thread.text.slice(0, 129)}...` : thread.text}
              </Typography>

              <Box marginTop={"10px"} display={"flex"} alignItems={"center"} >
                <FavoriteIcon style={{ fontSize: "12px" }} />
                <Typography marginRight={"10px"} fontSize={"10px"} fontWeight={900}>{thread.likes}</Typography>
                <MessageIcon style={{ fontSize: "12px" }} />
                <Typography fontSize={"10px"} fontWeight={900}>{thread.comments}</Typography>
              </Box>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default ShowThread