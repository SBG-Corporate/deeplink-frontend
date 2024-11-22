import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "app/components/common/FlexBetween";
import UserImage from "app/components/common/UserImage";
import WidgetWrapper from "app/components/common/WidgetWrapper";
import VerifiedIcon from '@mui/icons-material/Verified';
import { MyPalette } from '/app/themes/types';

interface SocialInfoNavbarProps {
  profilePicture: string;
  name: string;
}

const SocialInfoNavbar: React.FC<SocialInfoNavbarProps> = ({ profilePicture, name }) => {
  const { palette } = useTheme<MyPalette>();
  const medium = palette.neutral.medium;
  const primaryMain = palette.primary.main;

  return (
    <WidgetWrapper height={"100%"} display={"flex"} alignContent={"center"} >
      <FlexBetween gap="10rem" >
        <FlexBetween gap="1.5rem" >
          <UserImage image={profilePicture} />
          <Box>
            <Typography variant="h3" color={medium}>Wellcome,</Typography>
            <Typography
              variant="h2"
              fontWeight="500"
            >
              {name}  <VerifiedIcon sx={{ color: primaryMain }} />
            </Typography>
          </Box>
        </FlexBetween>

        <FlexBetween gap="1.5rem" >
          <Box>
            <Typography color={medium}>Likes</Typography>
            <Typography
              variant="h4"
              fontWeight="500"
            >
              +500
            </Typography>
          </Box>
        </FlexBetween>

        <FlexBetween gap="1.5rem" >
          <Box>
            <Typography color={medium}>Comments</Typography>
            <Typography
              variant="h4"
              fontWeight="500"
            >
              +125
            </Typography>
          </Box>
        </FlexBetween>

        <FlexBetween gap="1.5rem" >
          <Box>
            <Typography color={medium}>Views</Typography>
            <Typography
              variant="h4"
              fontWeight="500"
            >
              +125
            </Typography>
          </Box>
        </FlexBetween>
        <FlexBetween ></FlexBetween>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default SocialInfoNavbar;
