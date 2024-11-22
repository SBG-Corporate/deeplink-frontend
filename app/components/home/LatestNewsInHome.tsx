import React, { useContext, useEffect, useState } from "react";
import { Box, Card, CardContent, Skeleton, useMediaQuery } from "@mui/material";
import NewsBox from "../news/NewsBox";
import { MessagesContext } from "/app/context/messages";
import { IMessageParsed } from "/app/interfaces";

const LatestNewsInHome = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:580px)");
  const { isLoadingMessages, messagesNews } = useContext(MessagesContext);
  const [hoverIndex, setHoverIndex] = useState(0);
  const [showedNews, setShowedNews] = useState<IMessageParsed[]>([]);

  const handleMouseEnter = (index: number) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(0);
  };

  const onClickCloseButton = async (index: number) => {
    setShowedNews((prevNews) => prevNews.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (messagesNews.length === 0) return
    setShowedNews(messagesNews)
  }, [messagesNews])

  return (
    <Box sx={{ position: 'relative', width: "80%", height: "300px" }}>
      {(isNonMobileScreens ? [0, 1, 2] : [0, 1]).map((index) => {
        if (index >= showedNews.length) {
          return null;
        }
        return (
          <Card
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            sx={{
              padding: "0px",
              margin: "0px",
              // border: "solid 1px red",
              height: "350px",
              borderRadius: "30px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              width: "90%",
              position: "absolute",
              top: index * 40,
              left: index * 70,
              transition: 'all 0.3s ease-in-out',
              opacity: hoverIndex === index ? 1 : 0.6,
              zIndex: hoverIndex === index ? 4 : 3 - index,
              '&:hover': {
                zIndex: 4,
                opacity: 1,
              },
            }}
          >
            <CardContent>
              {isLoadingMessages || showedNews.length === 0 ? (
                <>
                  <Box sx={{ margin: "10px 10px 0 0", display: 'flex', justifyContent: 'flex-end' }}>
                    <Skeleton variant="circular" width={20} height={20} />
                  </Box>
                  <Skeleton variant="text" height={30} width="100%" />
                  <Skeleton variant="text" height={60} width="100%" sx={{ marginTop: "-15px" }} />
                  <Skeleton variant="rectangular" height={180} sx={{ marginTop: "-5px" }} />
                </>
              ) : (
                showedNews !== undefined && showedNews.length !== 0 && (
                  <Box width={"100%"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                    <NewsBox
                      newData={showedNews[index]}
                      onClick={() => { }}
                      height={"40px"}
                      padding={"20px"}
                      margin={"0px"}
                      boxShadow=""
                      showCloseButton={true}
                      onClickCloseButton={() => onClickCloseButton(index)}
                    />
                  </Box>
                )
              )}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};


export default LatestNewsInHome;
