// ApplicationDrawer.js
import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ListItemButton from '@mui/material/ListItemButton';

const ApplicationDrawer = ({ isOpen, drawerWidth, applications, onSelectApplication }) => {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="right"
      open={isOpen}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <AppBar
          position="static"
          sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `-${drawerWidth}px` }}
        >
          <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold!important' }}>
              Applications
            </Typography>
          </Toolbar>
        </AppBar>
        <Divider />
        <List>
            {applications.map((applicationName, index) => (
            <ListItem key={applicationName} disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={applicationName} onClick={() => onSelectApplication(applicationName)} />
                </ListItemButton>
            </ListItem>

            ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default ApplicationDrawer;
