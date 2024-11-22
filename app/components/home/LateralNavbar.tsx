import React from "react";
import { useRouter } from 'next/router';
import { Box, Typography, Divider, useTheme } from "@mui/material";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import ForumIcon from '@mui/icons-material/Forum';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import SavingsIcon from '@mui/icons-material/Savings';
import CommentIcon from '@mui/icons-material/Comment';
import { MyPalette } from '/app/themes/types';
import FlexBetween from "app/components/common/FlexBetween";
import WidgetWrapper from "app/components/common/WidgetWrapper";
interface LateralNavbarProps {
  onlyIcons?: boolean;
}

const LateralNavbar: React.FC<LateralNavbarProps> = ({ onlyIcons = false }) => {
  const { palette } = useTheme<MyPalette>();
  const router = useRouter();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const neutralLight = palette.neutral.light;

  return (
    <WidgetWrapper>
      <FlexBetween
        pb="5rem"
        color={medium}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}
      >
        <FlexBetween >
          <NewspaperIcon />
          {!onlyIcons &&
            <Typography variant={"h4"} pl="0.5rem" >
              DeepFeed
            </Typography>
          }
        </FlexBetween>
      </FlexBetween>

      <FlexBetween
        pb="5rem"
        onClick={() => router.push(`/user/challenges`)}
        color={dark}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}      >
        <FlexBetween>
          <LocalAtmIcon />
          {!onlyIcons &&
            <Typography variant={"h4"} pl="0.5rem">
              Challenges
            </Typography>
          }
        </FlexBetween>
      </FlexBetween>

      <FlexBetween
        pb="5rem"
        color={medium}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}      >
        <FlexBetween>
          <RssFeedIcon />
          {!onlyIcons &&
            <Typography variant={"h4"} pl="0.5rem">
              News
            </Typography>
          }
        </FlexBetween>
      </FlexBetween>

      <FlexBetween
        pb="5rem"
        color={medium}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}      >
        <FlexBetween>
          <ForumIcon />
          {!onlyIcons &&
            <Typography variant={"h4"} pl="0.5rem">
              Forums
            </Typography>
          }
        </FlexBetween>
      </FlexBetween>

      <FlexBetween
        pb="5rem"
        onClick={() => router.push(`/user/messages`)}
        color={dark}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}      >
        <FlexBetween>
          <CommentIcon />
          {!onlyIcons &&
            <Typography variant={"h4"} pl="0.5rem">
              Messages
            </Typography>
          }
        </FlexBetween>
      </FlexBetween>

      <FlexBetween
        pb="5rem"
        onClick={() => router.push(`/user/groups`)}
        color={dark}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}      >
        <FlexBetween>
          <Diversity3Icon />
          {!onlyIcons &&
            <Typography variant={"h4"} pl="0.5rem">
              Groups
            </Typography>
          }
        </FlexBetween>
      </FlexBetween>

      <FlexBetween
        pb="5rem"
        color={medium}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}      >
        <FlexBetween>
          <LocalGroceryStoreIcon />
          {!onlyIcons &&
            <Typography variant={"h4"} pl="0.5rem">
              Marketplace
            </Typography>
          }
        </FlexBetween>
      </FlexBetween>

      <FlexBetween
        pb={onlyIcons ? "3rem" : "5rem"}
        color={medium}
        sx={{
          "&:hover": {
            color: neutralLight,
            cursor: "pointer",
          },
        }}      >
        <FlexBetween>
          <SavingsIcon />
          {!onlyIcons &&
            <Box pl="0.5rem">
              <Typography>Monthly Bounty</Typography>
              <Typography
                variant="h4"
                fontWeight="900"
              >
                17.500 BELLS
              </Typography>
            </Box>
          }
        </FlexBetween>
      </FlexBetween>
    </WidgetWrapper >
  );
};

export default LateralNavbar;
