import { Box, Card, CardContent, Chip, Skeleton, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getOrder } from '../services/orders'

export default function TrackOrderPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getOrder(id)
      .then((data) => {
        if (mounted) setOrder(data)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [id])

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Track Order
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography sx={{ fontWeight: 800 }}>
              {loading ? <Skeleton width="30%" /> : `Order #${order?.id}`}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={loading ? '…' : order?.status} />
              <Chip variant="outlined" label={loading ? '…' : `Payment: ${order?.payment_status}`} />
            </Box>
            <Typography color="text.secondary">
              {loading ? <Skeleton /> : order?.delivery_address}
            </Typography>

            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Items</Typography>
              {(order?.items ?? []).map((it) => (
                <Box key={it.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                  <Typography color="text.secondary">
                    {it.product_name} x {it.quantity}
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>TZS {it.subtotal}</Typography>
                </Box>
              ))}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
