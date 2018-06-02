import { Theme } from "@material-ui/core";
const drawerWidth = 260;
export type clsNames =
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
    | "drawerPaper"
    | "content-top";
export const styles = (theme: Theme) => ({
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
        display: "flex",
        flexDirection: "column" as "column",
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        // padding: theme.spacing.unit * 3,
        padding: 0,
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
        // backgroundColor: "rgba(0, 40, 77, 1)",
        // color: "white",
        ...theme.mixins.toolbar
    },
    drawerPaper: {
        // backgroundColor: "rgb(0, 21, 41)",
        position: "relative" as "relative",
        width: drawerWidth
    },
    "content-top": {
        ...theme.mixins.toolbar
    }
});
