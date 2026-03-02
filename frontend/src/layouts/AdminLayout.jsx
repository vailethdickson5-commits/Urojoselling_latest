import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

const drawerWidth = 240

export default function AdminLayout() {
  const { logout } = useAuth()
  const location = useLocation()

  const nav = [
    { label: 'Overview', to: '/admin' },
    { label: 'Products', to: '/admin/products' },
    { label: 'Categories', to: '/admin/categories' },
    { label: 'Orders', to: '/admin/orders' },
    { label: 'Inventory Logs', to: '/admin/inventory' },
    { label: 'Reports', to: '/admin/reports' },
  ]

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" elevation={0} color="transparent">
        <Toolbar sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Admin
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Button component={RouterLink} to="/" color="inherit">
            Home
          </Button>
          <Button onClick={logout} color="inherit">
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            pt: 8,
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box sx={{ px: 2, pb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Manage products, orders, inventory
          </Typography>
        </Box>
        <Divider />
        <List>
          {nav.map((item) => (
            <ListItemButton
              key={item.to}
              component={RouterLink}
              to={item.to}
              selected={location.pathname === item.to}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flex: 1, pt: 10, pb: 4 }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}
