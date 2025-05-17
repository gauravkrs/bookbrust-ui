import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const navLinks = [
    { title: 'Explore', path: '/explore', protected: false },
    { title: 'Bookshelf', path: '/bookshelf', protected: true },
    { title: 'Timeline', path: '/timeline', protected: true },
  ];

  const renderNavLinks = () =>
    navLinks.map((link) =>
      !link.protected || user ? (
        <Button
          key={link.title}
          color="inherit"
          component={NavLink}
          to={link.path}
          sx={{
            '&.active': {
              fontWeight: 'bold',
              borderBottom: '2px solid white',
            },
            textTransform: 'none',
          }}
        >
          {link.title}
        </Button>
      ) : null
    );

  const drawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
      <List>
        {navLinks.map((link) => {
          if (link.protected && !user) return null;
          return (
            <ListItem key={link.title} disablePadding>
              <ListItemButton component={NavLink} to={link.path}>
                <ListItemText primary={link.title} />
              </ListItemButton>
            </ListItem>
          );
        })}
        {!user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/login">
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/signup">
                <ListItemText primary="Signup" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: 'inline-flex', sm: 'none' }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{
              flexGrow: 1,
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            BookBurst
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            {renderNavLinks()}

            {!user ? (
              <>
                <Button color="inherit" component={NavLink} to="/login" sx={{ textTransform: 'none' }}>
                  Login
                </Button>
                <Button color="inherit" component={NavLink} to="/signup" sx={{ textTransform: 'none' }}>
                  Signup
                </Button>
              </>
            ) : (
              <>
                <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
                  <Avatar
                    alt={'User'}
                    src={user?.avatarUrl || undefined}
                    sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
                  >
                    {user.name
                      ? user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                      : user.username?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem
                    onClick={() => {
                      navigate(`/user/${user.username}`);
                      handleMenuClose();
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerList}
      </Drawer>
    </>
  );
};

export default Header;
