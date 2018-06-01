import { Collapse, Icon, ListItemText, MenuItem, MenuList, Theme, WithStyles, withStyles } from "@material-ui/core";
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
    menuItem: {
        marginRight: 24,
        "&:hover": {
            backgroundColor: "#20a8d8"
        },
        "&:focus": {
            backgroundColor: theme.palette.primary.dark,
            "& $primary, & $icon": {
                color: theme.palette.common.white
            }
        }
    },
    primary_sel: {
        color: theme.palette.common.white
    },
    primary: {
        color: "rgba(255, 255, 255, 0.647058823529412)"
    },
    icon: {
        color: "rgba(255, 255, 255, 0.647058823529412)"
    },
    menuList: {
        paddingLeft: 12
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
    const { classes, menus, setMenu, location, theme } = props;
    const toItem = (item: IItem) => {
        const MyLink = (p: any) => <Link to={item.url} {...p} />;
        const sel = decodeURI(location.pathname) === decodeURI(item.url);
        const selColor = theme ? theme.palette.primary.dark : "";
        return (
            <MenuItem
                key={item.key}
                button={true}
                selected={sel}
                component={MyLink}
                style={{ backgroundColor: sel ? selColor : "" }}
                classes={{ root: classes.menuItem }}>
                <ListItemText
                    primary={clearText(item.label)}
                    classes={{ primary: sel ? classes.primary_sel : classes.primary }}
                />
            </MenuItem>
        );
    };
    const toList = (node: ICategory): JSX.Element | null => {
        if (!node) {
            return null;
        }
        const itemlist = node.items.map(val => {
            if (isItem(val)) {
                return toItem(val);
            } else {
                return toList(val);
            }
        });
        const click = () => {
            setMenu({ path: node.path, openOrClose: !node.open });
        };
        return (
            <MenuList key={node.key} disablePadding={true}>
                <MenuItem button={true} onClick={click} key={node.key} classes={{ root: classes.menuItem }}>
                    <ListItemText primary={clearText(node.label)} classes={{ primary: classes.primary }} />
                    {node.open ? (
                        <Icon className={classes.icon}>expand_less</Icon>
                    ) : (
                        <Icon className={classes.icon}>expand_more></Icon>
                    )}
                </MenuItem>
                <Collapse in={node.open} timeout="auto" unmountOnExit={true} className={classes.menuList}>
                    <MenuList component="div" disablePadding={true}>
                        {itemlist}
                    </MenuList>
                </Collapse>
            </MenuList>
        );
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
