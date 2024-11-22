import React from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Typography, useTheme, Box } from "@mui/material";
import { PhoneIphone, Search, SatelliteAlt, Grass } from '@mui/icons-material';
import ChallengeBoxSponsor from "./ChallengeBoxSponsor";
import PopupCreateThoughtsOnTrezor from "./PopupCreateThoughtsOnTrezor";
import { MyPalette } from '/app/themes/types';
import PopupCreateNovaWallet from "./PopupCreateNovaWallet";

interface Props {
  openPopupCreateThoughtsOnTrezor: boolean
  setopenPopupCreateNovaWallet: (value: boolean) => void;
  setopenPopupCreateThoughtsOnTrezor: (value: boolean) => void;
  openPopupCreateNovaWallet: boolean
}
const SponsoredChallenges: React.FC<Props> = ({ openPopupCreateThoughtsOnTrezor, setopenPopupCreateNovaWallet, setopenPopupCreateThoughtsOnTrezor, openPopupCreateNovaWallet }) => {
  const themeMode = useSelector((state: any) => state.persisted?.themeMode);
  const { palette } = useTheme<MyPalette>();
  const dark = palette.neutral.dark;

  const handlePopupCreateThoughtsOnTrezorClose = async () => {
    setopenPopupCreateThoughtsOnTrezor(false)
  };

  const onClickCreateThoughtsOnTrezor = () => {
    setopenPopupCreateThoughtsOnTrezor(true)
  };

  const onClickCreateNovaWallet = () => {
    setopenPopupCreateNovaWallet(true)
  };

  const handleLeftArrowClickThoughtsOnTrezor = () => {
    setopenPopupCreateThoughtsOnTrezor(false)
    setopenPopupCreateNovaWallet(true)
  };

  const handleRightArrowClickThoughtsOnTrezor = () => {
    setopenPopupCreateThoughtsOnTrezor(false)
    setopenPopupCreateNovaWallet(true)
  };

  const handlePopupCreateNovaWalletClose = async () => {
    setopenPopupCreateNovaWallet(false)
  };

  const handleLeftArrowClickNovaWallet = () => {
    setopenPopupCreateNovaWallet(false)
    setopenPopupCreateThoughtsOnTrezor(true)
  };

  const handleRightArrowClickNovaWallet = () => {
    setopenPopupCreateNovaWallet(false)
    setopenPopupCreateThoughtsOnTrezor(true)
  };

  return (
    <Box
      padding={"25px"}
      display={"flex"}
      justifyContent={"start"}
      alignItems={"start"}
      flexDirection={"column"}
      rowGap={"20px"}
      columnGap={"40px"}
      height={"100%"}
      sx={{
        borderRadius: "50px",
        backgroundColor: themeMode === "light" ? "#f0fffc" : "#000033"
      }}
    >
      <Box paddingTop={"25px"} display={"flex"} justifyContent={"center"}>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored challenges
        </Typography>
      </Box >
      <ChallengeBoxSponsor
        padding={"20px 30px 20px 30px"}
        title={"Share your thoughs on the new Trezor"}
        description={"Watch the review below and let us know what you think of the new Trezor model."}
        buttonText={"Claim 1 BELLS"}
        onClick={onClickCreateThoughtsOnTrezor}
        icon={<PhoneIphone style={{ fontSize: 50 }} />}
      />
      <ChallengeBoxSponsor
        padding={"20px 30px 20px 30px"}
        title={"Create a Nova wallet"}
        description={"Create the new NOVA wallet and connect to DeepLink. Thanks to this wallet you will be able to clacim exlusive bounties."}
        buttonText={"Claim 0.5 BELLS"}
        onClick={onClickCreateNovaWallet}
        icon={<Grass style={{ fontSize: 50 }} />}
      />
      <ChallengeBoxSponsor
        padding={"20px 30px 20px 30px"}
        title={"Analyses Illuvium in depth"}
        description={"Complete the review template and let us know what you think of Illuvium latest update."}
        buttonText={"Claim 0.5 BELLS"}
        onClick={() => toast("Comming soon...")}
        icon={<SatelliteAlt style={{ fontSize: 50 }} />}
      />
      <PopupCreateThoughtsOnTrezor
        openPopup={openPopupCreateThoughtsOnTrezor}
        handlePopupClose={handlePopupCreateThoughtsOnTrezorClose}
        handleLeftArrowClick={handleLeftArrowClickThoughtsOnTrezor}
        handleRightArrowClick={handleRightArrowClickThoughtsOnTrezor}
      />
      <PopupCreateNovaWallet
        openPopup={openPopupCreateNovaWallet}
        handlePopupClose={handlePopupCreateNovaWalletClose}
        handleLeftArrowClick={handleLeftArrowClickNovaWallet}
        handleRightArrowClick={handleRightArrowClickNovaWallet}
      />
    </Box >
  );
};

export default SponsoredChallenges;
