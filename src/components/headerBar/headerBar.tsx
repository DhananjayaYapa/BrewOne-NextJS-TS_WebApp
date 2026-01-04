"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation"; // App Router compatible
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  CssBaseline,
  ListItem,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import Cookies from 'js-cookie';
import logo from "../../assets/brewone-logo.svg";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { headers, ROUTES, UserRolesInterface } from "@/constant";
import Image from "next/image";
import { signOut } from "aws-amplify/auth";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getFeaturesByUserRole } from "@/redux/action/authAction";
import { setCurrentUserFeatureList } from "@/redux/slice/authSlice";

interface HeaderBarProps {
  children: React.ReactNode;
}

export default function HeaderBar({ children }: HeaderBarProps) {

  const pathname = usePathname();
 
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const [openSubMenu, setOpenSubMenu] = useState<Record<string, boolean>>({});


  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleToggleSubMenu = (title: string) => {
    setOpenSubMenu((prev) => ({ ...prev, [title]: !prev[title] }));
  };
  const [userRole, setUserRole] = useState<UserRolesInterface | undefined>(undefined);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [featureList, setFeatureListUserRole] = useState<string[] | undefined>(undefined);

  const featureList1 = useSelector(
    (state: RootState) => state.auth.userRoleFeatureListReponse?.data
  )

  const featureListonly = useSelector(
    (state: RootState) => state.auth.featureListReponse?.data
  )
  useEffect(() => {
    if (featureList1 && featureList1?.length > 0) {
      // console.log(came here1)
    const roleFromCookie = Cookies.get('userRole') as UserRolesInterface | undefined;
      Cookies.set('featureList', featureList1?.find(role => role.userRole === roleFromCookie)
      ?.featureList?.map(feature => feature.featureKey).toString() || '')
      
      const arr = featureList1?.find(role => role.userRole === roleFromCookie)
      ?.featureList?.map(feature => feature.featureKey).toString()?.split(',').map(s => s.replace(/'/g, ''));
      setFeatureListUserRole(arr)
      dispatch(setCurrentUserFeatureList(arr || null))
    }
  }, [featureList1]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getFeaturesByUserRole())
    
    const roleFromCookie = Cookies.get('userRole') as UserRolesInterface | undefined;
    Cookies.set('featureList', featureList1?.find(role => role.userRole === roleFromCookie)
    ?.featureList?.map(feature => feature.featureKey).toString() || '')
    
    // dispatch(getFeaturesByUserRole())
    const userNameCookie = Cookies.get('userName') as string;
    const userRoleFeatures = Cookies.get('featureList') as string;
    if(userRoleFeatures){
    const arr = userRoleFeatures?.split(',').map(s => s.replace(/'/g, ''));
    setFeatureListUserRole(arr)
    dispatch(setCurrentUserFeatureList(arr || null))
    }
    setUserRole(roleFromCookie);
    setUserName(userNameCookie);
    if (!roleFromCookie) {
      handleSignOut()
    }

  }, []);
  // const userRole = Cookies.get('userRole') as UserRolesInterface;
  // console.log('TESTING', userRole);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  }; const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  // const isPageAccessible = (page: any, userRole: UserRolesInterface | undefined) => {
  //   // console.log(page, userRole,'this')
  //   return (userRole ? page.allowedRoles.includes(userRole) : false);
  // };
  async function handleSignOut() {
    // setAnchorElUser(null);
    try {
      await signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: open ? "250px" : "60px",
          height: "100vh",
          backgroundColor: open ? "#fff" : "#005893",
          boxShadow: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "width 0.3s",
          overflowX: "hidden",
          left: 0,
        }}
      >
        <Toolbar sx={{ flexDirection: "row", alignSelf: "start !important", padding: "10px !important", mt: 2 }}>
          <IconButton color={open ? "primary" : "info"} onClick={toggleDrawer}>
            <MenuIcon />
            <Image src={logo} alt={"logo"} style={{ marginLeft: "20px", textAlign: "center" }} />
          </IconButton>
        </Toolbar>
        <List sx={{ width: "100%", display: open ? "content" : "none", flexGrow: 1 }}>
          {headers?.map((item) =>
            item?.featureKey?.some(p => featureList?.includes(p))
              && item?.subItems?.some(p => p.featureKey.some(key => featureList?.includes(key))) ? (
              <div key={item.title}>
                {item && item.featureKey?.some(key => featureList?.includes(key) || '') && (
                  <ListItemButton onClick={() => handleToggleSubMenu(item.title)}>
                    <ListItemText primary={item.title} color="primary" />
                    {openSubMenu[item.title] ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
                  </ListItemButton>
                )}
                <Collapse in={openSubMenu[item.title]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 4 }}>
                    {item.subItems
                      ?.filter(subItem =>
                        subItem.featureKey?.some(key => featureList?.includes(key))
                      )
                      .map(subItem => (
                        <ListItemButton key={subItem.title} onClick={() => router.push(`/${subItem.path}`)}>
                          <ListItemText primary={subItem.title} />
                        </ListItemButton>
                      ))}


                  </List>
                </Collapse>
              </div>
            ) : (
              item.featureKey?.some(key => featureList?.includes(key || '')) &&
              <ListItemButton key={item.title} onClick={() => {
                router.push(`/${item.path}`)}}>
                <ListItemText primary={item.title} />
              </ListItemButton>
            )
          )}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={handleOpenUserMenu} disableFocusRipple
          sx={{ p: 1, alignSelf: 'flex-start', marginBottom: '0px !important', borderRadius: 1 }}>
          <Avatar alt="Remy Sharp" />
          <Box padding={1} textAlign={'left'}>
            <Typography variant="body1" fontSize={12} noWrap
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "200px",
              }}
            >
              {userName}
            </Typography>
            <Typography variant="body1" fontSize={13} noWrap
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "200px",
              }}>
              {userRole}
            </Typography>
          </Box>
        </IconButton>
        <Menu
          sx={{ m: 'auto' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >

          <MenuItem onClick={() => { handleSignOut() }}>
            <Typography textAlign="center">Log out</Typography>
          </MenuItem>
        </Menu>
      </AppBar>
      <Box component="main" sx={{
        flexGrow: 1, p: 3, ml: open ? "250px" : "60px", transition: "margin 0.3s",
        overflowY: 'auto',        // Vertical scroll
        padding: 2,
      }}>
        {children}
      </Box>
    </Box>
  );
}
