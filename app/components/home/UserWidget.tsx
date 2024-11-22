import React from "react";
import toast from "react-hot-toast";
import { useRouter } from 'next/router';
import { LocationOnOutlined, WorkOutlineOutlined, Verified } from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, IconButton } from "@mui/material";
import LanguageIcon from '@mui/icons-material/Language';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import UserImage from "app/components/common/UserImage";
import FlexBetween from "app/components/common/FlexBetween";
import WidgetWrapper from "app/components/common/WidgetWrapper";
import { MyPalette } from '/app/themes/types';
import { User } from "/app/interfaces";

interface Props {
  alias: string;
  friendsIds: string[];
  userId: string;
  profilePicture: string;
  isVerified: boolean;
  selectedUser: User;
}

const UserWidget: React.FC<Props> = ({ userId, profilePicture, alias, friendsIds, isVerified, selectedUser }) => {
  const router = useRouter();
  const { palette } = useTheme<MyPalette>();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  return (
    <WidgetWrapper
      sx={{
        marginTop: "20px",
        marginBottom: "20px"
      }}
    >
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => router.push(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <Box width={"75px"}>
            <UserImage image={profilePicture} size={"75px"} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {selectedUser && selectedUser.estado === 0 ? "Alias not defined" : alias}
              {isVerified && <Verified sx={{ marginLeft: "3px", fontSize: "16px" }} />}
            </Typography>
            {friendsIds !== undefined && friendsIds.length !== 0 && <Typography color={medium}>{friendsIds.length} friends</Typography>}
          </Box>
        </FlexBetween>
      </FlexBetween>

      <Box paddingBottom="15px">
        <Typography color={medium}>
          {selectedUser && selectedUser.bioInfo.biography}
        </Typography>
      </Box>

      <Divider />
      {(selectedUser.bioInfo.website !== "" || selectedUser.bioInfo.location !== "" || selectedUser.bioInfo.ocupation !== "") &&
        <>
          <Box p="1rem 0">
            <Box display={selectedUser.bioInfo.website !== "" ? "flex" : "none"} alignItems="center" gap="1rem" mb="0.5rem">
              <LanguageIcon fontSize="large" sx={{ color: main }} />
              <Typography color={medium} sx={{ ":hover": { cursor: "pointer", textDecoration: "underline" } }}>
                {selectedUser && selectedUser.bioInfo.website}
              </Typography>
            </Box>

            <Box display={selectedUser.bioInfo.location !== "" ? "flex" : "none"} alignItems="center" gap="1rem" mb="0.5rem">
              <LocationOnOutlined fontSize="large" sx={{ color: main }} />
              <Typography color={medium}>
                {selectedUser && selectedUser.bioInfo.location}
              </Typography>
            </Box>

            <Box display={selectedUser.bioInfo.ocupation !== "" ? "flex" : "none"} alignItems="center" gap="1rem">
              <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
              <Typography color={medium}>
                {selectedUser && selectedUser.bioInfo.ocupation}
              </Typography>
            </Box>
          </Box>
          <Divider />
        </>
      }

      <Box margin="15px 0" width={"100%"} display="flex" justifyContent={"space-between"} alignItems="center">
        < IconButton onClick={() => selectedUser.socialLinks.instagramLink !== "" ? router.push(selectedUser.socialLinks.instagramLink) : toast("Not defined")}>
          <InstagramIcon />
        </IconButton>

        < IconButton onClick={() => selectedUser.socialLinks.twitterLink !== "" ? router.push(selectedUser.socialLinks.twitterLink) : toast("Not defined")}>
          <XIcon />
        </IconButton>

        < IconButton onClick={() => selectedUser.socialLinks.linkedinLink !== "" ? router.push(selectedUser.socialLinks.linkedinLink) : toast("Not defined")}>
          <LinkedInIcon />
        </IconButton>

        < IconButton onClick={() => selectedUser.socialLinks.facebookLink !== "" ? router.push(selectedUser.socialLinks.facebookLink) : toast("Not defined")}>
          <FacebookIcon />
        </IconButton>
      </Box>
      <Divider />

      {/* THIRD ROW */}
      {/* <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who&apos;s viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            7855
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            6554
          </Typography>
        </FlexBetween>
      </Box>

      <Divider /> */}
      {/* <Box p={"5px"}></Box> */}

      {/* FOURTH ROW */}
      {/* <Box sx={{ paddingBottom: "1rem" }}>
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Link social profiles
        </Typography>

        <FlexBetween gap="1rem" mb="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/img/social/twitter.png" alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main, "&:hover": { cursor: "pointer", color: neutralLight } }} />
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/img/social/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main, "&:hover": { cursor: "pointer", color: neutralLight } }} />
        </FlexBetween>
      </Box> */}
    </WidgetWrapper>
  );
};

export default UserWidget;
