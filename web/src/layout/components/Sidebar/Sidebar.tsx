/*eslint-disable*/

import { Link as RouterLink } from "react-router";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";
import styles from "../../assets/jss/material-dashboard-react/components/sidebarStyle";
import { useAtomValue, useSetAtom } from "jotai";
import { toggleDrawerAtom } from "../../../store/atoms/shellAtoms";
import { lobbyAtom } from "../../../store/atoms/lobbyAtoms";
import { useLocation } from "react-router";
import SidebarFooter from "../../../components/SidebarFooter";
import LobbyQrCode from "../../../components/LobbyQrCode";
import Games from "../../../games/Games";
import { Link, ListItemButton, useTheme } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import { createSxClasses } from "createSxClasses";
import Color from "color";
import { defaultFont, colors } from "../../assets/jss/palette";

export default function Sidebar(props) {
  const toggleDrawer = useSetAtom(toggleDrawerAtom);
  const location = useLocation();
  const lobby = useAtomValue(lobbyAtom);
  const isPresenter = lobby.isPresenter;
  const isLobby = location.pathname === "/";
  const theme = useTheme();
  const showQrCode = Boolean(lobby.id && !isLobby);
  const classes = styles(showQrCode)(theme);
  const game = Games.find((g) => g.name == lobby.currentGame);
  const GameMenu = game && game.menu;

  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return location.pathname === routeName;
  }
  const { color, logo, logoText, routes } = props;
  var links = (
    <List
      sx={{
        marginTop: showQrCode ? 0 : "20px",
        paddingLeft: "0",
        paddingTop: "0",
        paddingBottom: "50px",
        marginBottom: "0",
        listStyle: "none",
        position: "unset",
      }}
    >
      {routes
        .filter((r) => r.name)
        .map((prop, key) => {
          return (
            <Fragment key={key}>
              <ListItem
                sx={{
                  padding: 0,
                  position: "relative",
                  display: "block",
                  textDecoration: "none",
                  "&:hover,&:focus,&:visited,&": {
                    color: colors.whiteColor,
                  },
                }}
                disableGutters
              >
                <ListItemButton
                  component={RouterLink}
                  onClick={() => toggleDrawer(false)}
                  to={prop.path}
                  sx={createSxClasses(classes, {
                    itemLink: true,
                    [color]: activeRoute(prop.path),
                  })}
                  data-testid={prop.testId}
                >
                  {typeof prop.icon === "string" ? (
                    <Icon
                      sx={createSxClasses(classes, {
                        itemIcon: true,
                        whiteFont: activeRoute(prop.path),
                        itemIconRTL: props.rtlActive,
                      })}
                    >
                      {prop.icon}
                    </Icon>
                  ) : (
                    <prop.icon
                      sx={createSxClasses(classes, {
                        itemIcon: true,
                        whiteFont: activeRoute(prop.path),
                        itemIconRTL: props.rtlActive,
                      })}
                    />
                  )}
                  <ListItemText
                    primary={props.rtlActive ? prop.rtlName : prop.name}
                    sx={createSxClasses(classes, {
                      itemText: true,
                      whiteFont: activeRoute(prop.path),
                      itemTextRTL: props.rtlActive,
                    })}
                    disableTypography={true}
                  />
                </ListItemButton>
              </ListItem>

              {isPresenter &&
                prop.path === "/game" &&
                location.pathname === "/game" &&
                GameMenu && <GameMenu />}
            </Fragment>
          );
        })}
    </List>
  );
  var brand = (
    <Box
      sx={{
        position: "relative",
        padding: "15px 15px",
        zIndex: "4",
        "&:after": {
          content: '""',
          position: "absolute",
          bottom: "0",
          height: "1px",
          right: "15px",
          width: "calc(100% - 30px)",
          backgroundColor: Color(colors.grayColor[6]).alpha(0.3).hexa(),
        },
      }}
    >
      <Link
        component={RouterLink}
        to="/"
        sx={{
          ...defaultFont,
          textTransform: "uppercase",
          padding: "5px 0",
          display: "block",
          fontSize: "16px",
          textAlign: "left",
          fontWeight: "400",
          lineHeight: "30px",
          textDecoration: "none",
          backgroundColor: "transparent",
          "&,&:hover,&:focus": {
            color: colors.whiteColor,
          },
        }}
      >
        <Box sx={classes.logoImage}>
          <Box component="img" src={logo} alt="logo" sx={classes.img} />
        </Box>
        {logoText}
      </Link>
    </Box>
  );

  const qrCode = lobby.id && !isLobby && <LobbyQrCode />;

  return (
    <Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Drawer
          variant="temporary"
          anchor="right"
          open={props.open}
          onClose={() => toggleDrawer()}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <Box sx={classes.sidebarWrapper}>
            {qrCode}
            {links}
            <SidebarFooter />
          </Box>
          <Box sx={classes.background} />
        </Drawer>
      </Box>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Drawer
          anchor="left"
          variant="permanent"
          open
          slotProps={{
            paper: {
              sx: createSxClasses(classes, {
                drawerPaper: true,
                drawerPaperRTL: props.rtlActive,
              }),
            },
          }}
        >
          {brand}
          <Box sx={classes.sidebarWrapper}>
            {qrCode}
            {links}
            <SidebarFooter lobbyId={lobby.id} />
          </Box>
          <Box sx={classes.background} />
        </Drawer>
      </Box>
    </Box>
  );
}
