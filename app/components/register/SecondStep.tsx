import React from "react";
import { Box, Typography, Button } from '@mui/material';
import { CheckBox } from '@mui/icons-material';
import { useTheme } from "@mui/material";
import FlexBetween from "app/components/common/FlexBetween";
import { OldRegisterUser } from "/app/interfaces";
import { MyPalette } from '/app/themes/types';

interface SecondStepProps {
  formData: OldRegisterUser;
  setFormData: (data: OldRegisterUser) => void;
}

const SecondStep: React.FC<SecondStepProps> = ({ formData, setFormData }) => {
  const { palette } = useTheme<MyPalette>();
  const paper = palette.background.paper;
  const lightDark = palette.background.lightDark;

  const boxStyle = {
    width: '70%',
    margin: '1rem auto',
    textAlign: 'center',
  };

  const chatStyle = {
    borderRadius: '10px 10px 10px 0',
    background: "paper",
    backgroundColor: paper,
    padding: "10px",
    fontSize: "14px",
  };

  const typesDescriptionStyle = {
    display: "flex",
    justifyContent: "left",
    textAlign: "start" as const,
    fontSize: "12px",
    paddingBottom: "1rem"
  };

  function handleSelectUserType(userType: string) {
    setFormData({
      ...formData,
      userType,
    });
  }

  return (
    <Box sx={boxStyle}>
      <Typography sx={chatStyle}>What type of user are you {formData.firstName} ?</Typography>
      <FlexBetween sx={{ alignItems: "start" }}>
        <Box display="flex" justifyContent="flex-end" p="1rem" width="300px">
          <Box display="grid" alignItems="center" p="1rem">
            <FlexBetween pb="1rem" >
              <img
                width="80px"
                height="auto"
                alt="advert"
                src={`../assets/img/avatars/userType1.png`}
                style={{
                  borderRadius: "0.75rem",
                  margin: "0.75rem",
                }}
              />
              <div style={{ display: "flex", justifyContent: "center", fontSize: "16px", fontWeight: "bold", marginRight: "80px" }}>User</div>
            </FlexBetween>
            <div style={typesDescriptionStyle}>
              <CheckBox /> Free Nft access pass
            </div>
            <div style={typesDescriptionStyle}>
              <CheckBox /> Rewards on the platform
            </div>
            <div style={typesDescriptionStyle}>
              <CheckBox /> Possibility of becoming an influencer
            </div>
            <Button
              variant="text"
              onClick={() => handleSelectUserType("user")}
              sx={{
                boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                bgcolor: formData.userType === "user" ? lightDark : "undefined"
              }}
            >
              {formData.userType === "user" ? "Selected" : "Select"}
            </Button>
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" p="1rem" width="300px">
          <Box display="grid" alignItems="center" p="1rem">
            <FlexBetween pb="1rem">
              <img
                width="80px"
                height="auto"
                alt="advert"
                src={`../assets/img/avatars/userType2.png`}
                style={{
                  borderRadius: "0.75rem",
                  margin: "0.75rem",
                }}
              />
              <div style={{ display: "flex", justifyContent: "center", fontSize: "16px", fontWeight: "bold" }}>Influencer</div>
            </FlexBetween>
            <div style={typesDescriptionStyle}>
              <CheckBox /> Exclusive Nft access pass
            </div>
            <div style={typesDescriptionStyle}>
              <CheckBox /> Own staking pool
            </div>
            <div style={typesDescriptionStyle}>
              <CheckBox /> Own marketplace
            </div>
            <div style={typesDescriptionStyle}>
              <CheckBox /> Influencer dashboard
            </div>
            <Button
              variant="text"
              onClick={() => handleSelectUserType("influencer")}
              sx={{
                boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                bgcolor: formData.userType === "influencer" ? lightDark : "undefined"
              }}
            >
              {formData.userType === "influencer" ? "Selected" : "Select"}
            </Button>
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" p="1rem" width="300px">
          <Box display="grid" alignItems="center" p="1rem">
            <FlexBetween pb="1rem">
              <img
                width="80px"
                height="auto"
                alt="advert"
                src={`../assets/img/avatars/userType3.png`}
                style={{
                  borderRadius: "0.75rem",
                  margin: "0.75rem",
                }}
              />
              <div style={{ display: "flex", justifyContent: "center", fontSize: "16px", fontWeight: "bold" }}>Buisness</div>
            </FlexBetween>
            <div style={typesDescriptionStyle}>
              <CheckBox /> Exclusive Nft access pass
            </div>
            <div style={typesDescriptionStyle}>
              <CheckBox /> Own staking pool
            </div>
            <div style={typesDescriptionStyle}>
              <CheckBox /> Own marketplace
            </div>
            <div style={typesDescriptionStyle}>
              <CheckBox /> Buisness dashboard
            </div>
            <div style={typesDescriptionStyle}>
              <CheckBox /> Targeted advertising
            </div>
            <Button
              variant="text"
              onClick={() => handleSelectUserType("buisness")}
              sx={{
                boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                bgcolor: formData.userType === "buisness" ? lightDark : "undefined"
              }}
            >
              {formData.userType === "buisness" ? "Selected" : "Select"}
            </Button>
          </Box>
        </Box>
      </FlexBetween>

      <FlexBetween sx={{ marginBottom: "-50px" }}>
        <Box></Box>
        <Box display="flex" justifyContent="flex-end" p="1rem" width="300px">
          <Box display="grid" alignItems="center" p="1rem">
            <FlexBetween pb="1rem">
              <img
                width="80px"
                height="auto"
                alt="advert"
                src={`../assets/img/avatars/userType4.png`}
                style={{
                  borderRadius: "0.75rem",
                  margin: "0.75rem",
                }}
              />
              <div style={{ display: "flex", justifyContent: "center", fontSize: "16px", fontWeight: "bold" }}>Visitant</div>
            </FlexBetween>
            <div style={{ display: "flex", justifyContent: "center", fontSize: "12px", textAlign: "justify", paddingBottom: "1rem" }}>Just want to take a look.</div>
            <Button
              variant="text"
              onClick={() => handleSelectUserType("visitant")}
              sx={{
                boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                bgcolor: formData.userType === "visitant" ? lightDark : "undefined"
              }}
            >
              {formData.userType === "visitant" ? "Selected" : "Select"}
            </Button>
          </Box>
        </Box>
      </FlexBetween>
    </Box>
  );
}
export default SecondStep;