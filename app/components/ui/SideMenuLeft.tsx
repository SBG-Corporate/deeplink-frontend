import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import {
  AccountCircleOutlined,
  AdminPanelSettings,
  CategoryOutlined,
  Close,
  ConfirmationNumberOutlined,
  ContactMailOutlined,
  DashboardOutlined,
  InfoOutlined,
  LoginOutlined
} from "@mui/icons-material"

type Props = {
  openSideMenu: boolean;
  setIsSideMenuToggled: (value: boolean) => void;
};
export const SideMenuLeft: React.FC<Props> = ({ openSideMenu, setIsSideMenuToggled }) => {
  return (
    <Drawer
      open={openSideMenu}
      onClose={setIsSideMenuToggled}
      anchor='left'
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

          <ListItem button>
            <ListItemIcon>
              <AccountCircleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Perfil'} />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <DashboardOutlined />
            </ListItemIcon>
            <ListItemText primary={'Dashboard'} />
          </ListItem>


          <ListItem button>
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
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <LoginOutlined />
            </ListItemIcon>
            <ListItemText primary={'Log out'} />
          </ListItem>

          {/* Admin */}
          <Divider />
          <ListSubheader>Admin Panel</ListSubheader>

          <ListItem button>
            <ListItemIcon>
              <CategoryOutlined />
            </ListItemIcon>
            <ListItemText primary={'Challenges'} />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ConfirmationNumberOutlined />
            </ListItemIcon>
            <ListItemText primary={'Sponsors'} />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <AdminPanelSettings />
            </ListItemIcon>
            <ListItemText primary={'Users'} />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}