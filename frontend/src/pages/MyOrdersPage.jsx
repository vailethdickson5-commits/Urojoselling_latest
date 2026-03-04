import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { listOrders } from '../services/orders'

export default function MyOrdersPage() {
  const [orders, setOrders] = useState(null)

  useEffect(() => {
    let mounted = true
    listOrders()
      .then((data) => {
        if (mounted) setOrders(data)
      })
      .catch(() => {
        if (mounted) setOrders([])
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        My Orders
      </Typography>

      <Stack spacing={2}>
        {(orders ?? []).map((o) => (
          <Card key={o.id}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 800 }}>Order #{o.id}</Typography>
                <Typography color="text.secondary">TZS {o.total_amount}</Typography>
              </Box>
              <Chip label={o.status} variant="outlined" />
              <Button component={RouterLink} to={`/me/orders/${o.id}`} variant="contained">
                Track
              </Button>
            </CardContent>
          </Card>
        ))}

        {orders && orders.length === 0 ? (
          <Typography color="text.secondary">No orders yet.</Typography>
        ) : null}
      </Stack>
    </Box>
  )
}
