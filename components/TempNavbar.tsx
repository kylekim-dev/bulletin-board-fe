import React, { useState, useEffect, useCallback } from "react";
import { NextLinkComposed } from "@/src/Link";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { setUser, resetUser } from "@/slices/userSlice";

import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  ListSubheader,
  ListItemButton,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import dayjs from "dayjs";
import { IMenu, User } from "@/src/types";

const initialMenu: IMenu[] = [
  {
    name: "Dashboard",
    path: "/",
    open: true,
    icon: "InboxIcon",
    subMenuList: null,
  },
  {
    name: "Pricing Test",
    path: "/pricing/finder",
    open: true,
    icon: "InboxIcon",
    subMenuList: null,
  },
  {
    name: "System Manage",
    path: "",
    open: true,
    icon: "SendIcon",
    subMenuList: [
      {
        name: "Master Code",
        path: "/mastercode",
        icon: "InboxIcon",
        open: false,
      },
      {
        name: "Condition Items",
        path: "/conditionitem",
        icon: "InboxIcon",
        open: false,
      },
    ],
  },
  {
    name: "Product Management",
    path: "",
    open: true,
    icon: "DraftsIcon",
    subMenuList: [
      {
        name: "Loan Program",
        path: "/product/loanprograms",
        icon: "InboxIcon",
        open: false,
      },
      {
        name: "Option Field",
        path: "/product/optionfields",
        icon: "InboxIcon",
        open: false,
      },
    ],
  },
  {
    name: "UI Playground",
    path: "",
    open: true,
    icon: "DraftsIcon",
    subMenuList: [
      {
        name: "Components",
        path: "/playground",
        icon: "InboxIcon",
        open: false,
      },
      {
        name: "Form",
        path: "/playground/formtextfieldtest",
        icon: "InboxIcon",
        open: false,
      },
    ],
  },
];

export default function TempNavbar() {
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [open, setOpen] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<IMenu[]>(initialMenu);

  const { version } = require("@/package.json");

  useEffect(() => {
    fetchProfile();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "InboxIcon":
        return <InboxIcon fontSize="small" />;
      case "DraftsIcon":
        return <DraftsIcon fontSize="small" />;
      case "SendIcon":
        return <SendIcon fontSize="small" />;
      default:
        return <InboxIcon fontSize="small" />;
    }
  };

  const toggleDrawer = useCallback(
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(open);
    },
    []
  );

  const collapseMenu = useCallback(
    (index: number) => (event: React.MouseEvent) => {
      event.preventDefault();
      const newMenuItems = [...menuItems];
      newMenuItems[index].open = !newMenuItems[index].open;
      setMenuItems(newMenuItems);
    },
    [menuItems]
  );

  const fetchProfile = () => {
    dispatch(setUser({ userJosn: localStorage.getItem("user") as string }));
  };

  const menuList = menuItems.map((item, index) => {
    return (
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        key={`${item.path}-${index}`}
        dense
      >
        {item.subMenuList != null ? (
          <>
            <ListItemButton dense onClick={collapseMenu(index)}>
              <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
              <ListItemText primary={item.name} />
              {item.open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={item.open} timeout="auto" unmountOnExit>
              {item.subMenuList.map((subItem, index) => {
                return (
                  <List component="div" disablePadding dense key={`${subItem.path}-${index}`}>
                    <ListItemButton
                      component={NextLinkComposed}
                      to={{ pathname: subItem.path }}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon>{getIcon(subItem.icon)}</ListItemIcon>
                      <ListItemText primary={subItem.name} />
                    </ListItemButton>
                  </List>
                );
              })}
            </Collapse>
          </>
        ) : (
          <ListItemButton
            component={NextLinkComposed}
            to={{ pathname: item.path }}
            dense
          >
            <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        )}
      </List>
    );
  });

  if (
    userState.user == null ||
    userState.user.token == null ||
    userState.user.token == ""
  ) {
    return <></>;
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ ml: 'auto' }}>
              Hello, {userState.user.fullName}
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
          <Button
            sx={{ mx: 'auto', textTransform: "none" }}
            component={NextLinkComposed}
            to={{ pathname: "/" }}
            color="inherit"
            size="large"
          >
            Logo
          </Button>
          <Divider />
          {menuList}
          <Divider sx={{ mt: "auto" }} />
          <Box>
            <Typography>
              {`User: ${userState.user.userName} / ${userState.user.securityProfileName}`}
            </Typography>

            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                sx={{ textTransform: "none" }}
                component={NextLinkComposed}
                to={{ pathname: "/auth/logout" }}
                color="inherit"
                startIcon={<LogoutIcon />}
              >
                Log Out
              </Button>
              <Box sx={{ my: 'auto', mr: 1 }}>Version: {version}</Box>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </>
  );
}
