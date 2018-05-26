// tslint:disable:no-console
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  Toolbar,
  Typography,
  WithStyles,
  withStyles
} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import InboxIcon from "@material-ui/icons/Inbox";
import MenuIcon from "@material-ui/icons/Menu";
import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import * as actions from "./action";
import { IHomeState } from "./reducer";

const drawerWidth = 240;
type clsNames =
  | "appFrame"
  | "appBar"
  | "appBarShift"
  | "menuButton"
  | "hide"
  | "content"
  | "content-left"
  | "contentShift"
  | "contentShift-left"
  | "drawerHeader"
  | "drawerPaper";
const styles = (theme: Theme) => ({
  appFrame: {
    height: "100%",

    zIndex: 1,
    overflow: "hidden",
    display: "flex",
    width: "100%"
  },
  appBar: {
    position: "absolute" as "absolute",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  "content-left": {
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "contentShift-left": {
    marginLeft: 0
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  drawerPaper: {
    position: "relative" as "relative",
    width: drawerWidth
  }
});
interface IHomeEvents {
  openMenu: () => any;
  hideMenu: () => any;
}
interface IHomeProps
  extends IHomeEvents,
    IHomeState,
    RouteComponentProps<any>,
    WithStyles<clsNames> {}

class Home extends React.Component<IHomeProps> {
  public state = {
    menuOpen: false
  };
  public render() {
    const { classes, theme } = this.props;
    const { menuOpen } = this.state;
    // const { elements, modules } = app;

    return (
      <div className={classes.appFrame}>
        <AppBar
          className={classNames(classes.appBar, {
            [classes.appBarShift]: menuOpen
          })}
        >
          <Toolbar disableGutters={!menuOpen}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                menuOpen && classes.hide
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap={true}>
              Persistent drawer
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="persistent"
          anchor="left"
          open={menuOpen}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme && theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button={true}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button={true}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </ListItem>
          </List>
        </Drawer>
        )
        <main
          className={classNames(classes.content, classes[`content-left`], {
            [classes.contentShift]: menuOpen,
            [classes["contentShift-left"]]: menuOpen
          })}
        >
          <div className={classes.drawerHeader} />
          {/* {elements && elements.map<JSX.Element>((val): any => {
                        const Mod = modules[val.Controller];
                        if (Mod) {
                            const Comp = (props: any) => <Mod element={val} {...props} />;
                            return <Route key={val.Name} path={"/front/" + val.Name} component={Comp} />;
                        }
                    })} */}
        </main>
      </div>
    );
  }
  private handleDrawerOpen = () => {
    this.setState({ menuOpen: true });
  };
  private handleDrawerClose = () => {
    this.setState({ menuOpen: false });
  };
}
const mapStateToProps = (state: any) => state.home;
const mapDispatchToProps = {
  openMenu: actions.doOpenMenu,
  hideMenu: actions.doHideMenu
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles, { withTheme: true })(Home)
  )
);
