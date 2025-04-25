/*eslint-disable*/

import classNames from "classnames";
import { Link } from "react-router";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";
import styles from "../../assets/jss/material-dashboard-react/components/sidebarStyle";
import { toggleDrawer } from "../../../store/shell/actions";
import { useDispatch } from "store/useSelector";
import { useLocation } from "react-router";
import SidebarFooter from "../../../components/SidebarFooter";
import { useSelector } from "../../../store/useSelector";
import LobbyQrCode from "../../../components/LobbyQrCode";
import Games from "../../../games/Games";
import { ListItemButton, useTheme } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import { createSxClasses } from "createSxClasses";

export default function Sidebar(props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const lobby = useSelector((state) => state.lobby);
  const isPresenter = lobby.isPresenter;
  const isLobby = location.pathname === "/";
  const theme = useTheme();
  const classes = styles(lobby.id && !isLobby)(theme);
  const gameName = useSelector((state) => state.lobby.currentGame);
  const game = Games.find((g) => g.name == gameName);
  const GameMenu = game && game.menu;

  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return location.pathname === routeName;
  }
  const { color, logo, logoText, routes } = props;
  var links = (
    <List sx={classes.list}>
      {routes
        .filter((r) => r.name)
        .map((prop, key) => {
          var activePro = " ";
          var listItemClasses;

          listItemClasses = classNames({
            [" " + classes[color]]: activeRoute(prop.path),
          });

          const whiteFontClasses = classNames({
            [" " + classes.whiteFont]: activeRoute(prop.path),
          });
          return (
            <Fragment key={key}>
              <ListItem>
                <ListItemButton
                  onClick={() => dispatch(toggleDrawer(false))}
                  sx={classes.item}
                  to={prop.path}
                  component={Link}
                  className={classes.itemLink + listItemClasses}
                  data-testid={prop.testId}
                >
                  {typeof prop.icon === "string" ? (
                    <Icon
                      sx={createSxClasses(styles, {
                        itemIcon: true,
                        whiteFontClasses,
                        itemIconRTL: props.rtlActive,
                      })}
                    >
                      {prop.icon}
                    </Icon>
                  ) : (
                    <prop.icon
                      sx={createSxClasses(styles, {
                        itemIcon: true,
                        whiteFontClasses,
                        itemIconRTL: props.rtlActive,
                      })}
                    />
                  )}
                  <ListItemText
                    primary={props.rtlActive ? prop.rtlName : prop.name}
                    sx={createSxClasses(styles, {
                      itemText: true,
                      whiteFontClasses,
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
          backgroundColor: "rgba(" + hexToRgb(grayColor[6]) + ", 0.3)",
        },
      }}
    >
      <Link to="/" style={classes.logoLink}>
        <Box sx={classes.logoImage}>
          <Box component="img" src={logo} alt="logo" sx={classes.img} />
        </Box>
        {logoText}
      </Link>
    </Box>
  );

  const qrCode = lobby.id && !isLobby && <LobbyQrCode />;

  return (
    <div>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? "left" : "right"}
          open={props.open}
          slotProps={{
            paper: {
              sx: createSxClasses(styles, {
                drawerPaper: true,
                drawerPaperRTL: props.rtlActive,
              }),
            },
          }}
          onClose={() => dispatch(toggleDrawer())}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
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
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Drawer
          anchor={props.rtlActive ? "right" : "left"}
          variant="permanent"
          open
          slotProps={{
            paper: {
              sx: createSxClasses(styles, {
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
    </div>
  );
}
