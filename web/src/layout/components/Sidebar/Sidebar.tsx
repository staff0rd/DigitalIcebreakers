/*eslint-disable*/

import classNames from "classnames";
import { NavLink } from "react-router";
import makeStyles from "@mui/styles/makeStyles";
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
import { ListItemButton } from "@mui/material";
import { Fragment } from "react/jsx-runtime";

const useStyles = (showQrCode) =>
  // @ts-expect-error
  makeStyles((theme) => styles(showQrCode)(theme));

export default function Sidebar(props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const lobby = useSelector((state) => state.lobby);
  const isPresenter = lobby.isPresenter;
  const isLobby = location.pathname === "/";
  const classes = useStyles(lobby.id && !isLobby)();
  const gameName = useSelector((state) => state.lobby.currentGame);
  const game = Games.find((g) => g.name == gameName);
  const GameMenu = game && game.menu;

  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return location.pathname === routeName;
  }
  const { color, logo, logoText, routes } = props;
  var links = (
    <List className={classes.list}>
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
              <NavLink
                to={prop.path}
                className={classNames(activePro + classes.item, {
                  active: activeRoute(prop.path),
                })}
                onClick={() => dispatch(toggleDrawer(false))}
              >
                <ListItem>
                  <ListItemButton
                    className={classes.itemLink + listItemClasses}
                    data-testid={prop.testId}
                  >
                    {typeof prop.icon === "string" ? (
                      <Icon
                        className={classNames(
                          classes.itemIcon,
                          whiteFontClasses,
                          {
                            [classes.itemIconRTL]: props.rtlActive,
                          }
                        )}
                      >
                        {prop.icon}
                      </Icon>
                    ) : (
                      <prop.icon
                        className={classNames(
                          classes.itemIcon,
                          whiteFontClasses,
                          {
                            [classes.itemIconRTL]: props.rtlActive,
                          }
                        )}
                      />
                    )}
                    <ListItemText
                      primary={props.rtlActive ? prop.rtlName : prop.name}
                      className={classNames(
                        classes.itemText,
                        whiteFontClasses,
                        {
                          [classes.itemTextRTL]: props.rtlActive,
                        }
                      )}
                      disableTypography={true}
                    />
                  </ListItemButton>
                </ListItem>
              </NavLink>
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
    <div className={classes.logo}>
      <NavLink
        to="/"
        className={classNames(classes.logoLink, {
          [classes.logoLinkRTL]: props.rtlActive,
        })}
      >
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </NavLink>
    </div>
  );

  const qrCode = lobby.id && !isLobby && <LobbyQrCode />;

  return (
    <div>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? "left" : "right"}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
          onClose={() => dispatch(toggleDrawer())}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {qrCode}
            {links}
            <SidebarFooter lobbyId={lobby.id} />
          </div>
          <div className={classes.background} />
        </Drawer>
      </Box>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Drawer
          anchor={props.rtlActive ? "right" : "left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {qrCode}
            {links}
            <SidebarFooter lobbyId={lobby.id} />
          </div>
          <div className={classes.background} />
        </Drawer>
      </Box>
    </div>
  );
}
