import { FC } from "react";
import toast from "react-hot-toast";
import { Menu, MenuItem } from "@mui/material";
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

interface Props {
  anchorEl: any;
  onClose: any;
  postUrl: any;
}

export const ShareMenu: FC<Props> = ({ anchorEl, onClose, postUrl }) => {
  if (!Boolean(anchorEl)) return null;

  const handleShare = (platform: string) => {
    const postUrlFull = `${window.location.origin}${postUrl}`;
    let shareUrl = "";
    switch (platform) {
      case "Twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${postUrlFull}`;
        break;
      case "Instagram":
        navigator.clipboard.writeText(postUrlFull);
        toast("URL copied to clipboard. You can now paste it in your Instagram post.");
        break;
      case "LinkedIn":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${postUrlFull}`;
        break;
      case "Facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${postUrlFull}`;
        break;
      default:
        break;
    }
    if (platform !== "Instagram" && platform !== "TikTok") {
      window.open(shareUrl, "_blank");
    }
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      sx={{ display: "flex", flexDirection: "row" }}
    >
      <MenuItem onClick={() => handleShare("Twitter")}><XIcon style={{ fontSize: "26px" }} /></MenuItem>
      <MenuItem onClick={() => handleShare("Instagram")}><InstagramIcon style={{ fontSize: "26px" }} /></MenuItem>
      <MenuItem onClick={() => handleShare("Facebook")}><FacebookIcon style={{ fontSize: "26px" }} /></MenuItem>
      <MenuItem onClick={() => handleShare("LinkedIn")}><LinkedInIcon style={{ fontSize: "26px" }} /></MenuItem>
    </Menu>
  );
};
