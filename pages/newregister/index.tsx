import React, { useState } from "react";
import toast from "react-hot-toast";
import { Box, Typography, useTheme, Grid, TextField, Button, Backdrop, CircularProgress } from "@mui/material";
import { apiLogin } from "/app/utils/api/apiUsuarios";
import PopupEmailSent from "/app/components/register/PopupEmailSent";
import { MyPalette } from '/app/themes/types';


const LoginPage: React.FC = () => {
  const { palette } = useTheme<MyPalette>();
  const dark = palette.neutral.dark;

  const [openPopup, setOpenPopup] = useState(false);
  const [popupMessage, setpopupMessage] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleClickPopupOpen = () => {
    setOpenPopup(true);
  };
  const handlePopupClose = () => {
    setOpenPopup(false);
  };

  const TextFieldStyle = {
    width: "100%",
    color: dark,
    // borderRadius: "15px",
    // backgroundColor: inputBackgroundColor,
    '& input': {
      color: dark,
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "15px",
      fontFamily: 'Montserrat Alternates, sans-serif',
    },
    '& label': {
      fontFamily: 'Montserrat Alternates, sans-serif',
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "transparent",
        borderWidth: 0
      },
      "&:hover fieldset": {
        borderColor: "transparent"
      },
      "&.Mui-focused fieldset": {
        borderColor: "transparent"
      }
    }
  }

  const login = async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Invalid email address.");
      return "";
    }

    setLoading(true)

    let response;
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "develop") {
      response = await apiLogin(email, "en", true)
    } else {
      response = await apiLogin(email, "en", false)
    }
    if (response.status === 429) {
      toast.error("You have to wait 1 minute to request another login email.");
      setLoading(false)
      return ""
    }

    else if (response.status === 200 || response.status === 201) {
      handleClickPopupOpen()
      setpopupMessage("You can access the website from the link sent to your email address.")
      toast.success("email sent")
      if (process.env.NEXT_PUBLIC_VERCEL_ENV === "develop") {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const match = response.data.data.match(urlRegex);
        setLink(match[0])
      }
      setLoading(false)
      return

    } else {
      toast.error("Error whith the server response, please try again or contact with the administrator.");
      console.log("error in response, status error: ", response);
      setLoading(false)
      return ""
    }
  };


  return (
    <Box
      height={"100vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{ backgroundColor: palette.background.paper }}
    >

      <Grid container spacing={2} maxWidth={"1200px"} padding={"30px"}>

        <Backdrop
          sx={{ color: '#fff', zIndex: 105 }}
          open={loading}
        >
          <Box width={"350px"} display="flex" justifyContent={"center"} flexDirection="column" alignItems="center">
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2 }} textAlign={"center"} fontSize={"20px"}>Sending email...</Typography>
          </Box>
        </Backdrop>

        <Grid item xs={1} />

        <Grid item xs={10}>
          <Box
            padding={{ xs: "20px 0", sm: "0" }}
            boxShadow={"0 0 10px rgba(0, 0, 0, 0.1)"}
            borderRadius={"30px"}
          >
            <Grid container>

              <Grid item xs={12} sm={6}>
                <Box
                  padding={"20px 0"}
                  height={"100%"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  borderRadius={"30px"}
                  boxShadow={"0 0 10px rgba(0, 0, 0, 0.1)"}
                  sx={{ backgroundColor: "#eafcff" }}
                >
                  <Grid container>
                    <Grid item xs={1} />
                    <Grid item xs={10}>

                      <Box
                        display={"flex"}
                        justifyContent={"center"}
                        borderRadius={"30px"}
                        boxShadow={"0 0 10px rgba(0, 0, 0, 0.1)"}
                        sx={{ backgroundColor: "#ffffff" }}
                      >
                        <Typography
                          fontFamily={"Bai Jamjuree"}
                          fontWeight={"500"}
                          fontSize={"200px"}
                          color={dark}
                        >
                          ?
                        </Typography>
                      </Box>

                    </Grid>
                    <Grid item xs={1} />
                  </Grid>


                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  padding={"20px"}
                  marginBottom={"100px"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexDirection={"column"}
                  position={"relative"}
                >
                  <Typography
                    margin={"20px"}
                    fontFamily={"Montserrat Alternates"}
                    fontWeight={"900"}
                    fontSize={"26px"}
                    color={dark}
                  >
                    Welcome to DeepLink
                  </Typography>

                  <Box display={"flex"} flexDirection={"column"} gap={"10px"}>
                    <form onSubmit={(e) => { e.preventDefault(); login(email); }}>
                      <TextField
                        label="Email"
                        value={email}
                        name="email"
                        sx={{ ...TextFieldStyle }}
                        size="small"
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      <Button
                        type="submit"
                        sx={{
                          margin: "10px 0",
                          padding: "3px 30px",
                          height: "32px",
                          maxWidth: "100px",
                          borderRadius: "20px",
                          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                          textTransform: 'none',
                          backgroundColor: "#eafcff"
                        }}
                      >
                        <Typography
                          fontFamily={"Montserrat Alternates"}
                          fontWeight={"900"}
                          fontSize={"10px"}
                        >
                          Continue
                        </Typography>
                      </Button>
                    </form>
                  </Box>

                  <Box
                    position={"absolute"}
                    bottom={-70}
                    right={110}
                    padding={"20px"}
                    // marginTop={"50px"}
                    marginRight={"-100px"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    borderRadius={"10px"}
                    boxShadow={"0 0 10px rgba(0, 0, 0, 0.1)"}
                  >
                    <Typography
                      fontWeight={"800"}
                      fontFamily={"Montserrat Alternates"}
                    >
                      Enter
                    </Typography>
                    <Typography
                      marginLeft={"5px"}
                    >
                      using your email
                    </Typography>
                  </Box>

                  <Box
                    position={"absolute"}
                    bottom={-200}
                    right={-110}
                    padding={"20px"}
                  >
                    <img width={"150px"} src="https://deeplink-uploads.s3.eu-west-3.amazonaws.com/65c7c36bec5ff33dfd58241c/65d3326aa47388ded37e3245" alt="viertual assistant" />
                  </Box>

                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={1} />
      </Grid>

      <PopupEmailSent
        openPopup={openPopup}
        popupMessage={popupMessage}
        link={link}
        handlePopupClose={handlePopupClose}
      />

    </Box >
  );
};

export default LoginPage;
