import { ChangeEvent, FC } from "react";
import { Box, Typography, TextField } from '@mui/material';
import { useTheme } from "@mui/material";
import Center from 'app/components/common/Center';
import { OldRegisterUser } from "/app/interfaces";
import { MyPalette } from '/app/themes/types';

interface FirstStepProps {
  formData: OldRegisterUser;
  setFormData: (data: OldRegisterUser) => void;
}

const FirstStep: FC<FirstStepProps> = ({ formData, setFormData }) => {
  const { palette } = useTheme<MyPalette>();
  const paper = palette.background.paper;

  const boxStyle = {
    width: '70%',
    margin: '1rem auto',
    textAlign: 'center',
    padding: '1rem 0',
  };
  const chatStyle = {
    borderRadius: '10px 10px 10px 0',
    background: "paper",
    backgroundColor: paper,
    padding: "10px",
    fontSize: "14px",
  };

  const handleTextInputChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      firstName: event.target.value,
    });
  };

  const handleTextInputChangeEmail = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      lastName: event.target.value,
    });
  };

  const handleTextInputChangePassword = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      password: event.target.value,
    });
  };

  return (
    <Box
      sx={boxStyle}
    >
      <Box sx={{ marginBottom: "40px" }}></Box>
      <Typography sx={chatStyle}>Bienvenidx! Soy tu asistente personal en DeepLink. Cual sera tu alias?</Typography>
      <Box sx={{ margin: '1rem 0' }}></Box>
      <TextField
        id="name-field"
        label="Alias"
        variant="outlined"
        value={formData.firstName}
        onChange={handleTextInputChangeName}
      />
      <Box sx={{ margin: '1rem 0' }}></Box>
      <Typography sx={chatStyle}>Cual es tu nombre?</Typography>
      <Box sx={{ margin: '1rem 0' }}></Box>
      <Center gap="3rem">
        <TextField
          id="name-field"
          label="Name"
          variant="outlined"
          value={formData.lastName}
          onChange={handleTextInputChangeEmail}
        />
        {/* <TextField
          id="name-field"
          label="Password"
          variant="outlined"
          value={formData.password}
          onChange={handleTextInputChangePassword}
        /> */}
      </Center>
    </Box >
  );
}
export default FirstStep;