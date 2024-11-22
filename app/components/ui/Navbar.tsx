import React, { FC, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NextLink from "next/link"
import dynamic from 'next/dynamic';
import { Menu } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, useMediaQuery, Button, CardMedia } from "@mui/material";
import FlexBetween from "app/components/common/FlexBetween";
import { SideMenuLeft } from "./SideMenuLeft";
import { SideMenuRight } from "./SideMenuRight";
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';


const Navbar = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 800px)");
  const user = useSelector((state: any) => state.persisted?.user);
  const pageType = useSelector((state: any) => state.persisted?.pageType) || "";
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const paper = theme.palette.background.paper;

  const [isRightMenuToggled, setIsRightMenuToggled] = useState(false);
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);

  return (
    <FlexBetween
      padding="20px 2rem 15px 120px"
      sx={{
        backgroundColor: paper,
        boxShadow: " 0 0 20px rgba(0, 0, 0, 0.1)",
        position: 'sticky',
        zIndex: 99,
      }}
    >
      <FlexBetween gap="1.75rem">
        {!isNonMobileScreens &&
          <>
            <IconButton onClick={() => setIsMobileMenuToggled(prev => !prev)}>
              <Menu />
            </IconButton>
            <SideMenuLeft openSideMenu={isMobileMenuToggled} setIsSideMenuToggled={() => setIsMobileMenuToggled(false)} />
          </>
        }

        <NextLink href={(user && user.estado !== undefined) ? `/user` : '/'} passHref style={{ color: 'inherit', textDecoration: 'none' }}>
          <Typography
            marginLeft={"20px"}
            fontWeight="bold"
            fontSize={isNonMobileScreens ? "20px" : "16px"}
            color="neutral"
            sx={{
              "&:hover": {
                color: neutralLight,
                cursor: "pointer",
              },
            }}
          >
            DeepLink
          </Typography>
        </NextLink>

        <Typography></Typography>
        <NextLink href={(user && user.estado !== undefined) ? `/user` : '/'} passHref style={{ color: 'inherit', textDecoration: 'none' }}>
          <Typography
            fontWeight={pageType === "home" ? "900" : "600"}
            fontFamily={"Montserrat"}
            color="neutral"
            sx={{
              "&:hover": {
                color: neutralLight,
                cursor: "pointer",
              },
            }}
          >
            Home
          </Typography>
        </NextLink>

      </FlexBetween>
      {user.estado === 0 &&
        <FlexBetween>
          <NextLink href='/register' passHref style={{ color: 'inherit', textDecoration: 'none' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ fontWeight: "900", borderRadius: "15px", padding: "8px 30px" }}
            >
              Register
            </Button>
          </NextLink>
        </FlexBetween>
      }

      {/* DESKTOP NAV */}
      <FlexBetween gap="2rem">
        {/* <IconButton onClick={() => dispatch(setThemeMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton> */}
        {/* {user.estado !== 0 &&
          <>
            <IconButton>
              <Badge badgeContent={2} color="error">
                <Notifications sx={{ fontSize: "25px" }} />
              </Badge>
            </IconButton>
            <IconButton>
              <Badge badgeContent={7} color="error">
                <Message sx={{ fontSize: "25px" }} />
              </Badge>
            </IconButton>
          </>
        } */}

        <Box marginRight={"-22px"} display={"flex"} justifyContent={"center"} alignItems={"center"} >
          <Typography marginRight={"3px"} variant="h3" fontWeight="800">{user.saldo}</Typography>
          <CardMedia
            component="img"
            alt=" Link logo"
            src="/assets/img/linkLogo.png"
            sx={{ marginBottom: "2px", height: 20 }}
          />
        </Box>

        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <Typography paddingRight={"4px "} variant="h3" fontWeight="800">
            12.72
          </Typography>
          <CardMedia
            component="img"
            alt="Bells logo"
            src="/assets/img/bells_logo.png"
            sx={{ marginBottom: "2px", height: 22 }}
          />
          {/* <CurrencyBitcoinIcon style={{ margin: "0 0 2px -4px", fontSize: "24px" }} /> */}
        </Box>

        <IconButton onClick={() => setIsRightMenuToggled(prev => !prev)}>
          <Menu />
        </IconButton>
        <SideMenuRight openSideMenu={isRightMenuToggled} setIsSideMenuToggled={() => setIsRightMenuToggled(false)} />
      </FlexBetween>

      {/* MOBILE NAV */}
      {/* {
        isMobileMenuToggled && (
          <Box
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            zIndex="10"
            maxWidth="500px"
            minWidth="300px"
            sx={{ backgroundColor: background }}
          >
            <Box display="flex" justifyContent="flex-end" p="1rem">
              <IconButton
                onClick={() => setIsRightMenuToggled(!isMobileMenuToggled)}
              >
                <Close />
              </IconButton>
            </Box>

            <FlexBetween
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap="3rem"
            >
              <WalletButton />

              <IconButton
                onClick={() => dispatch(setThemeMode())}
                sx={{ fontSize: "25px" }}
              >
                {theme.palette.mode === "dark" ? (
                  <DarkMode sx={{ fontSize: "25px" }} />
                ) : (
                  <LightMode sx={{ color: dark, fontSize: "25px" }} />
                )}
              </IconButton>

              <Message sx={{ fontSize: "25px" }} />
              <Notifications sx={{ fontSize: "25px" }} />
              <FormControl variant="standard">
                <Select
                  value={user.alias === undefined ? "" : user.alias}
                  sx={{
                    backgroundColor: neutralLight,
                    width: "150px",
                    borderRadius: "0.25rem",
                    p: "0.25rem 1rem",
                    "& .MuiSvgIcon-root": {
                      pr: "0.25rem",
                      width: "3rem",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: neutralLight,
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem value={user.alias === undefined ? "" : user.alias}>
                    <Typography>{user.alias}</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => dispatch(setLogout())}>
                    Log Out
                  </MenuItem>
                </Select>
              </FormControl>
            </FlexBetween>
          </Box>
        )
      } */}
    </FlexBetween >
  );
};

export default Navbar;
