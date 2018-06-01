import {
    Collapse,
    Icon,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Theme,
    WithStyles,
    withStyles
} from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";

import * as actions from "../../root/action";
import { ICategory, IItem, isItem } from "../../root/list";

interface IMenusProps extends WithStyles<clsNames>, RouteComponentProps<any> {
    menus: ICategory;
    setMenu: (data: { path: string; openOrClose: boolean }) => any;
}
const styles = (theme: Theme) => ({
    item: {
        paddingTop: 10,
        paddingBottom: 10
        // marginRight: 24,
        // "&:hover": {
        //     backgroundColor: "#20a8d8"
        // },
        // "&:focus": {
        //     backgroundColor: theme.palette.primary.dark,
        //     "& $primary, & $icon": {
        //         color: theme.palette.common.white
        //     }
        // }
    },
    primary_sel: {
        fontSize: 14,
        color: "#2196f3",
        // fontWeight: "bold" as "bold"
        fontWeight: theme.typography.fontWeightMedium
        // color: theme.palette.common.white
    },
    primary: {
        fontSize: 14
        // color: "rgba(255, 255, 255, 0.647058823529412)"
    },
    primary_cate: {
        fontSize: 14,
        fontWeight: "bold" as "bold"
        // color: "rgba(255, 255, 255, 0.647058823529412)"
    },
    icon: {
        fontSize: 14,
        color: theme.palette.grey["400"]
        // color: "rgba(255, 255, 255, 0.647058823529412)"
    },
    menuList: {
        // paddingLeft: 12
    }
});
type clsNames = keyof ReturnType<typeof styles>;
const mapStateToProps = (state: any) => ({
    menus: state.root.menus
});
const mapDispatchToProps = {
    setMenu: actions.doSetMenu
};
const labelMatch = /^[0-9]{2}\./;
function clearText(val: string) {
    if (labelMatch.test(val)) {
        return val.substr(3);
    }
    return val;
}
const Menus: React.SFC<IMenusProps> = props => {
    const { classes, menus, setMenu } = props;
    const toItem = (item: IItem) => {
        const MyLink = (p: any) => <Link to={item.url} {...p} />;
        const sel = decodeURI(location.pathname) === decodeURI(item.url);
        // const selColor = theme ? theme.palette.primary.dark : "";
        return (
            <ListItem
                key={item.key}
                button={true}
                // selected={sel}
                component={MyLink}
                // style={{ backgroundColor: sel ? selColor : "" }}
                classes={{ root: classes.item }}>
                <ListItemText
                    primary={clearText(item.label)}
                    classes={{ primary: sel ? classes.primary_sel : classes.primary }}
                />
            </ListItem>
        );
    };
    const toList = (node: ICategory, flat = false): JSX.Element | null => {
        if (!node) {
            return null;
        }
        const itemlist = node.items.map(val => {
            if (isItem(val)) {
                return toItem(val);
            } else {
                return toList(val, true);
            }
        });
        const click = () => {
            setMenu({ path: node.path, openOrClose: !node.open });
        };
        let list;
        if (flat) {
            list = (
                <List key={node.key} disablePadding={true}>
                    <ListSubheader>{clearText(node.label)}</ListSubheader>
                    {itemlist}
                </List>
            );
        } else {
            list = (
                <List key={node.key} disablePadding={true}>
                    <ListItem button={true} onClick={click} key={node.key} classes={{ root: classes.item }}>
                        <ListItemText primary={clearText(node.label)} classes={{ primary: classes.primary_cate }} />
                        {node.open ? (
                            <Icon className={classes.icon}>expand_less</Icon>
                        ) : (
                            <Icon className={classes.icon}>expand_more></Icon>
                        )}
                    </ListItem>
                    <Collapse in={node.open} timeout="auto" unmountOnExit={true} className={classes.menuList}>
                        <List component="div" disablePadding={true}>
                            {itemlist}
                        </List>
                    </Collapse>
                </List>
            );
        }
        return list;
    };
    return (
        <>
            {menus.items.map(val => {
                if (isItem(val)) {
                    return toItem(val);
                } else {
                    return toList(val);
                }
            })}
        </>
    );
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Menus)));
