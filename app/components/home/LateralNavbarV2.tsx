import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import { Verified } from "@mui/icons-material";
import { Box, Typography, useTheme, CardMedia } from "@mui/material";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import SavingsIcon from '@mui/icons-material/Savings';
import CommentIcon from '@mui/icons-material/Comment';
import ExploreIcon from '@mui/icons-material/Explore';
import { MyPalette } from '/app/themes/types';

const LateralNavbarV2 = () => {
  const { palette } = useTheme<MyPalette>();
  const router = useRouter();
  const { _id, profilePicture, alias, userLevel, isVerified, estado } = useSelector((state: any) => state.persisted?.user) || {};
  const dark = palette.neutral.dark;
  const mediumMain = palette.neutral.mediumMain;
  const neutralLight = palette.neutral.light;
  const paper = palette.background.paper;

  const [actualSection, setActualSection] = useState('');

  useEffect(() => {
    if (typeof window !== "undefined") {
      const protocol = window.location.protocol;
      const host = window.location.host;
      const path = router.asPath;
      const fullURL = `${protocol}//${host}${path}`;
      const actualSection = fullURL.split("/")[fullURL.split("/").length - 1]
      setActualSection(actualSection);
    }
  }, [router.asPath]);

  return (
    <Box
      sx={{
        padding: "10px 0 40px 0",
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '100px',
        backgroundColor: paper,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: "center",
        boxShadow: " 0 0 20px rgba(0, 0, 0, 0.1)",
        zIndex: 100,
      }}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        onClick={() => {
          if (estado === 0) {
            toast.error("You must be registered to access")
          } else {
            router.push(`/profile/${_id}`)
          }
        }}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}
      >
        <CardMedia
          component={"img"}
          style={{ width: "50px", height: "50px", margin: "12px 5px 5px 5px", borderRadius: "70px" }}
          alt="user-profile-image"
          src={profilePicture ? profilePicture : "https://deeplink-uploads.s3.eu-west-3.amazonaws.com/public/userProfile.png"}
        />
        {alias !== "" && <Typography variant="h2" fontSize={"10px"} textAlign={"center"} fontWeight={900}>
          {alias} {isVerified && <Verified sx={{ marginLeft: "1px", fontSize: "8px" }} />}
        </Typography>
        }
        <Typography marginTop={"2px"} variant="body1" fontSize={"8px"} textAlign={"center"} fontWeight={300}>
          Level {userLevel}
        </Typography>
      </Box>
      <Box
        onClick={() => router.push(`/user/deepfeed`)}
        color={actualSection === "deepfeed" ? dark : mediumMain}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}
      >
        <NewspaperIcon />
      </Box>

      <Box
        onClick={() => router.push(`/user/challenges`)}
        color={actualSection === "challenges" ? dark : mediumMain}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}      >
        <LocalAtmIcon />
      </Box>

      <Box
        onClick={() => router.push(`/user/news`)}
        color={actualSection === "news" ? dark : mediumMain}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}      >
        <RssFeedIcon />
      </Box>

      <Box
        onClick={() => router.push(`/user/explore`)}
        color={actualSection === "explore" ? dark : mediumMain}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}      >
        <ExploreIcon />
      </Box>

      <Box
        onClick={() => router.push(`/user/messages`)}
        color={actualSection === "messages" ? dark : mediumMain}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}      >
        <CommentIcon />
      </Box>

      <Box
        onClick={() => router.push(`/user/groups`)}
        color={actualSection === "groups" ? dark : mediumMain}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}      >
        <Diversity3Icon />
      </Box>

      <Box
        onClick={() => toast("Comming soon...")}
        color={actualSection === "marketplace" ? dark : mediumMain}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}      >
        <LocalGroceryStoreIcon />
      </Box>

      <Box
        onClick={() => toast("Comming soon...")}
        color={actualSection === "monthlybounty" ? dark : mediumMain}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}      >
        <SavingsIcon />
      </Box>
    </Box >
  );
};

export default LateralNavbarV2;
