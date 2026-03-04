import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
      <Card sx={{ width: '100%', maxWidth: 520 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
            Page not found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            The page you’re looking for doesn’t exist.
          </Typography>
          <Button component={RouterLink} to="/" variant="contained">
            Go home
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}
