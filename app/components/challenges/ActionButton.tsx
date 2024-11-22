import React, { FC } from "react";
import PropTypes from 'prop-types'
import { Box, Typography, Button } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

interface Props {
  text: string,
  isLoading: any,
  isNonMobileScreens: any,
  backgroundColor: string,
  hooverBackgroundColor: any,
  textColor: string,
  onClick: any,
}

export const ActionButton: FC<Props> = ({ text, isLoading, isNonMobileScreens, backgroundColor, hooverBackgroundColor, textColor, onClick }) => {
  return (
    <Box >
      {isLoading === true ? (
        <LoadingButton
          loading
          loadingPosition="center"
          startIcon={<SaveIcon />}
          variant="outlined"
          size={isNonMobileScreens ? "large" : "small"}
          sx={{ backgroundColor: backgroundColor, color: textColor, borderRadius: "2rem", boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)" }}
        >
        </LoadingButton>
      ) : (
        <>
          <Button
            variant="contained"
            onClick={onClick}
            disabled={isLoading}
            size={isNonMobileScreens ? "large" : "small"}
            sx={{
              backgroundColor: backgroundColor,
              color: textColor,
              borderRadius: "2rem",
              boxShadow: " 0 0 10px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: hooverBackgroundColor,
                cursor: "pointer",
              },
            }}
          >
            <Typography margin={"5px"} fontWeight={"600"} fontSize={isNonMobileScreens ? "12px" : "8px"}>{text}</Typography>
          </Button>
        </>
      )}
    </Box>
  )
}

ActionButton.propTypes = {
  text: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isNonMobileScreens: PropTypes.bool.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  hooverBackgroundColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

