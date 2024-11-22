import { useContext } from "react";
import { useRouter } from "next/router";
import { Box, CardMedia, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { Favorite, Message } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import { MyPalette } from '/app/themes/types';
import { IMessageParsed } from "/app/interfaces";
import { MessagesContext } from "/app/context/messages";
import { getReadTime } from "/app/utils/generalUtils";

interface Props {
  newData: IMessageParsed;
  onClick: any;
  height?: string;
  padding?: string;
  margin?: string;
  boxShadow?: string;
  showCloseButton?: boolean;
  onClickCloseButton?: any;
}

const NewsBox: React.FC<Props> = ({ newData, onClick, height = "", padding = "40px", margin = "20px", boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)", showCloseButton = false, onClickCloseButton = undefined }) => {
  const { palette } = useTheme<MyPalette>();
  const router = useRouter();
  const paper = palette.background.paper;
  const { allAlias, allProfilePictures } = useContext(MessagesContext);

  const dateToBeauty = (dateRaw: string): string => {
    const date = new Date(dateRaw);
    const dateNow = new Date();
    const diffInMs = dateNow.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }

    if (diffInMinutes < 1440) { // 24 hours * 60 minutes
      return `${diffInHours}h`;
    }

    const day = date.getDate();
    const month = date.toLocaleString('es', { month: 'short' });
    return `${day} ${month}`;
  };

  return (
    <Box
      padding={padding}
      margin={margin}
      width={"100%"}
      borderRadius={"30px"}
      boxShadow={boxShadow}
    >
      {showCloseButton &&
        <Box width={"100%"} margin={"-10px 0 10px 20px"} display={"flex"} justifyContent={"end"}>
          <IconButton onClick={onClickCloseButton}>
            <CloseIcon />
          </IconButton>
        </Box>
      }

      <Grid container spacing={2}>
        <Box
          width={"100%"}
          display="flex"
          flexDirection={"column"}
          onClick={() => router.push(`/article/${newData.slug}`)}
          sx={{
            backgroundColor: paper,
            "&:hover": {
              cursor: "pointer",
              opacity: "0.5"
            },
          }}
        >
          <Box width={"100%"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>

            <Box display={"flex"} alignItems={"center"}>
              <Box margin={"0 5px 5px 0"} >
                <CardMedia
                  component="img"
                  src={allProfilePictures[newData.id_user]}
                  alt="user profile picture"
                  sx={{ height: 25, borderRadius: "30px" }}

                />
              </Box>
              <Typography fontSize={"8px"}>{allAlias[newData.id_user]}&nbsp;&nbsp;&nbsp;</Typography>
              <Typography variant='body1' fontSize={"8px"} fontWeight={300} color={"gray"}>{`${dateToBeauty(new Date(newData.created).toISOString())}`} &nbsp;·&nbsp;{getReadTime(newData.articleData.contentNews)} min of reading</Typography>
            </Box>

            <Box m={0} p={0} display={"flex"} alignItems={"center"}>
              <Favorite sx={{ fontSize: "8px", marginRight: "2px" }} />
              <Typography fontSize={"8px"}>{newData.likes.length}.</Typography>
              &nbsp;&nbsp;
              <Message sx={{ fontSize: "8px", marginRight: "2px" }} />
              <Typography fontSize={"8px"}>{newData.comments.length}</Typography>
            </Box>
          </Box>

          <Box marginBottom={"10px"} padding={"5px"} sx={{ display: "flex", justifyContent: "start", fontSize: "14px", fontWeight: "bold", textAlign: "left" }}>
            {newData.articleData.title}
          </Box>

          <Box width={"100%"} display={"flex"} justifyContent={"center"}>
            <Box>
              <CardMedia
                component="img"
                src={newData.files.length !== 0 ? newData.files[0].url : ""}
                alt="News image"
                sx={{ height: 160, borderRadius: "30px" }}
              />
            </Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}

export default NewsBox;
