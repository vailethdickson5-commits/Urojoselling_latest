import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { Link as RouterLink, Outlet } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

export default function PublicLayout() {
  const { isAuthenticated, role, logout } = useAuth()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} color="transparent">
        <Toolbar sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography
            component={RouterLink}
            to="/"
            variant="h6"
            sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 700 }}
          >
            Urojo
          </Typography>

          <Box sx={{ flex: 1 }} />

          <Button component={RouterLink} to="/products" color="inherit">
            Products
          </Button>

          {isAuthenticated ? (
            <>
              {role === 'admin' ? (
                <Button component={RouterLink} to="/admin" color="inherit">
                  Admin
                </Button>
              ) : (
                <Button component={RouterLink} to="/me/orders" color="inherit">
                  My Orders
                </Button>
              )}
              <Button onClick={logout} color="inherit">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button component={RouterLink} to="/login" color="inherit">
                Login
              </Button>
              <Button component={RouterLink} to="/register" variant="contained">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }} maxWidth="lg">
        <Outlet />
      </Container>
    </Box>
  )
}
