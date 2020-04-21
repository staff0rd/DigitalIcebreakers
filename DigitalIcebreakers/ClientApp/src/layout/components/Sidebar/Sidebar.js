/*eslint-disable*/
import React from "react";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import styles from "../../assets/jss/material-dashboard-react/components/sidebarStyle";
import { toggleDrawer } from '../../../store/shell/actions';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import SidebarFooter from '../../../components/SidebarFooter';
import { useSelector } from '../../../store/useSelector';
import LobbyQrCode from "../../../components/LobbyQrCode";
import Games from "../../../games/Games";

const useStyles = (showQrCode) =>  makeStyles(theme => styles(showQrCode)(theme));

export default function Sidebar(props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const lobby = useSelector(state => state.lobby);
  const isAdmin = lobby.isAdmin;
  const isLobby = location.pathname === '/';
  const classes = useStyles(lobby.id && !isLobby)();
  const gameName = useSelector(state => state.lobby.currentGame);
  const game = Games.find(g => g.name == gameName);
  const GameMenu = game && game.menu;

  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return location.pathname === routeName;
  }
  const { color, logo, logoText, routes } = props;
  var links = (
    <List className={classes.list}>
      {routes.filter(r => r.name)
        .map((prop, key) => {
        var activePro = " ";
        var listItemClasses;
      
        listItemClasses = classNames({
          [" " + classes[color]]: activeRoute(prop.path)
        });
        
        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]: activeRoute(prop.path)
        });
        return (
          <>
          <NavLink
            to={prop.path}
            className={activePro + classes.item}
            activeClassName="active"
            key={key}
            onClick={() => dispatch(toggleDrawer(false))}
          >
            <ListItem button className={classes.itemLink + listItemClasses}>
              {typeof prop.icon === "string" ? (
                <Icon
                  className={classNames(classes.itemIcon, whiteFontClasses, {
                    [classes.itemIconRTL]: props.rtlActive
                  })}
                >
                  {prop.icon}
                </Icon>
              ) : (
                <prop.icon
                  className={classNames(classes.itemIcon, whiteFontClasses, {
                    [classes.itemIconRTL]: props.rtlActive
                  })}
                />
              )}
              <ListItemText
                primary={props.rtlActive ? prop.rtlName : prop.name}
                className={classNames(classes.itemText, whiteFontClasses, {
                  [classes.itemTextRTL]: props.rtlActive
                })}
                disableTypography={true}
              />
            </ListItem>
          </NavLink>
          { isAdmin && prop.path === '/game' && location.pathname === '/game' && GameMenu && (
            <GameMenu />
          )}
        </>
        );
      })}
    </List>
  );
  var brand = (
    <div className={classes.logo}>
      <NavLink
        to="/"
        className={classNames(classes.logoLink, {
          [classes.logoLinkRTL]: props.rtlActive
        })}
      >
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </NavLink>
    </div>
  );

  const qrCode = lobby.id && !isLobby && (
    <LobbyQrCode />
  );

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? "left" : "right"}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive
            })
          }}
          onClose={() => dispatch(toggleDrawer())}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {qrCode}
            {links}
            <SidebarFooter />
          </div>
          <div
            className={classes.background}
          />
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={props.rtlActive ? "right" : "left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive
            })
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {qrCode}
            {links}
            <SidebarFooter />
          </div>
          <div
            className={classes.background}
          />
        </Drawer>
      </Hidden>
    </div>
  );
}
