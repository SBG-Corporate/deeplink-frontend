import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { Badge, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, ListSubheader, useTheme } from "@mui/material"
import {
  AccountCircleOutlined,
  AdminPanelSettings,
  CategoryOutlined,
  Close,
  DashboardOutlined,
  LoginOutlined,
  DarkMode,
  LightMode,
  Message,
  Notifications,
  BookmarkBorderOutlined,
} from "@mui/icons-material"
import EditNotificationsIcon from '@mui/icons-material/EditNotifications';
import GroupsIcon from '@mui/icons-material/Groups';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PostAddIcon from '@mui/icons-material/PostAdd';
import BarChartIcon from '@mui/icons-material/BarChart';
import GradingIcon from '@mui/icons-material/Grading';
import { setLogout, setThemeMode } from "/app/store/slices/user/userSlice";
import { setLogOutMessages } from "/app/store/slices/messages/messagesSlice";
import { MessagesContext } from "/app/context/messages";

type Props = {
  openSideMenu: boolean;
  setIsSideMenuToggled: (value: boolean) => void;
};

export const SideMenuRight: React.FC<Props> = ({ openSideMenu, setIsSideMenuToggled }) => {
  const theme = useTheme();
  const dark = theme.palette.neutral.dark;
  const router = useRouter()
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.persisted?.user);
  const { notViewsInMessagesDirect, messagesNotificationWithSeen } = useContext(MessagesContext);

  const handleLogout = () => {
    router.push("/").then(() => {
      dispatch(setLogout());
      dispatch(setLogOutMessages());
    });
  };

  return (
    <Drawer
      open={openSideMenu}
      onClose={setIsSideMenuToggled}
      anchor='right'
      sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
    >
      <Box sx={{ width: 250 }}>
        <List>
          <Box display="flex" justifyContent="flex-end" p="0 1rem">
            <IconButton
              onClick={() => setIsSideMenuToggled(!openSideMenu)}
            >
              <Close />
            </IconButton>
          </Box>

          <ListItem>
            <Box display="flex" justifyContent="center" width="100%">
              {/* <WalletButton /> */}
              <Button variant="outlined" onClick={() => toast("Comming soon...")}>
                Connect wallet
              </Button>
            </Box>
          </ListItem>

          <ListItem button onClick={user && user.estado === 0 ?
            () => toast.error("You must be registered to access to this area") :
            () => router.push(`/user/account`)}>
            <ListItemIcon>
              <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText primary={'My account'} />
          </ListItem>

          <ListItem
            button
            onClick={() => {
              if (user.estado === 0) {
                toast.error("You must be registered to access")
              } else {
                router.push(`/profile/${user._id}`)
              }
            }}
          >
            <ListItemIcon>
              <AccountCircleOutlined />
            </ListItemIcon>
            <ListItemText primary={'My profile'} />
          </ListItem>

          <ListItem button onClick={user && user.estado === 0 ?
            () => toast.error("You must be registered to access to this area") :
            () => { router.push("/user/myarticles"); setIsSideMenuToggled(false); }}>
            <ListItemIcon>
              <PostAddIcon />
            </ListItemIcon>
            <ListItemText primary={'My articles'} />
          </ListItem>

          <ListItem button onClick={user && user.estado === 0 ?
            () => toast.error("You must be registered to access to this area") :
            () => { router.push("/user/mygroups"); setIsSideMenuToggled(false); }}>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary={'My own groups'} />
          </ListItem>

          <ListItem
            button onClick={user && user.estado === 0 ?
              () => toast.error("You must be registered to access to this area") :
              () => router.push(`/user/favoritearticles`)}
          >
            <ListItemIcon>
              <BookmarkBorderOutlined />
            </ListItemIcon>
            <ListItemText primary={'Favorite articles'} />
          </ListItem>

          <ListItem button onClick={() => router.push("/user/messages")}>
            <ListItemIcon>
              <Badge badgeContent={notViewsInMessagesDirect.length} color="error">
                <Message />
              </Badge>
            </ListItemIcon>
            <ListItemText primary={'Messages'} />
          </ListItem>

          <ListItem
            button onClick={user && user.estado === 0 ?
              () => toast.error("You must be registered to access to this area") :
              () => router.push(`/user/notifications`)}
          >
            <ListItemIcon>
              {user.estado === 0 ?
                <Notifications />
                :
                <Badge badgeContent={messagesNotificationWithSeen.filter(notification => !notification.isSeen).length} color="error">
                  <Notifications />
                </Badge>
              }

            </ListItemIcon>
            <ListItemText primary={'Notifications'} />
          </ListItem>

          {/* <ListItem button onClick={() => dispatch(setThemeMode())}>
            <ListItemIcon>
              {theme.palette.mode === "dark" ? (
                <DarkMode />
              ) : (
                <LightMode sx={{ color: dark }} />
              )}
            </ListItemIcon>
            <ListItemText primary={theme.palette.mode === "dark" ? 'Light mode' : "Dark mode"} />
          </ListItem> */}

          <ListItem button onClick={() => router.push("/user")}>
            <ListItemIcon>
              <DashboardOutlined />
            </ListItemIcon>
            <ListItemText primary={'Home'} />
          </ListItem>

          {/* <ListItem button>
            <ListItemIcon>
              <InfoOutlined />
            </ListItemIcon>
            <ListItemText primary={'About us'} />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <ContactMailOutlined />
            </ListItemIcon>
            <ListItemText primary={'Contact'} />
          </ListItem> */}

          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LoginOutlined />
            </ListItemIcon>
            <ListItemText primary={'Log out'} />
          </ListItem>

          {user !== null && user.rol.includes("admin") &&
            <>
              <Divider />
              <ListSubheader>Admin Panel</ListSubheader>

              <ListItem button onClick={() => router.push("/admin/challenges")}>
                <ListItemIcon>
                  <CategoryOutlined />
                </ListItemIcon>
                <ListItemText primary={'Challenges management'} />
              </ListItem>

              <ListItem button onClick={() => { router.push("/user/myarticles?pageType=management"); setIsSideMenuToggled(false); }}>
                <ListItemIcon>
                  <GradingIcon />
                </ListItemIcon>
                <ListItemText primary={'Articles management'} />
              </ListItem>

              <ListItem button onClick={() => router.push("/admin/notifications")}>
                <ListItemIcon>
                  <EditNotificationsIcon />
                </ListItemIcon>
                <ListItemText primary={'Notifications management'} />
              </ListItem>

              {/* <ListItem button onClick={() => toast("Comming soon...")}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={'Sponsors'} />
              </ListItem> */}

              <ListItem button onClick={() => router.push("/admin/dashboard")}>
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary={'Dashboard'} />
              </ListItem>

              <ListItem button onClick={() => router.push("/admin/usersManagment")}>
                <ListItemIcon>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary={'Users'} />
              </ListItem>
            </>
          }

        </List>
      </Box>
    </Drawer >
  )
}