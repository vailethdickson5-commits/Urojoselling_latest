import { Box, Card, CardContent, Typography } from '@mui/material'

export default function AdminReportsPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Reports
      </Typography>
      <Card>
        <CardContent>
          <Typography color="text.secondary">
            Sales reports and charts can be added here (orders per day, revenue per week).
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
