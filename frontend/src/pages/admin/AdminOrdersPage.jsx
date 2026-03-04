import { Box, Button, Card, CardContent, Chip, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import { listOrders, updateOrderStatus } from '../../services/orders'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(null)
  const [saving, setSaving] = useState(null)

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

  async function changeStatus(orderId, status) {
    setSaving(orderId)
    try {
      const updated = await updateOrderStatus(orderId, { status })
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)))
    } finally {
      setSaving(null)
    }
  }

  async function changePayment(orderId, payment_status) {
    setSaving(orderId)
    try {
      const updated = await updateOrderStatus(orderId, { payment_status })
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)))
    } finally {
      setSaving(null)
    }
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Orders
      </Typography>

      <Stack spacing={2}>
        {(orders ?? []).map((o) => (
          <Card key={o.id}>
            <CardContent sx={{ display: 'grid', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontWeight: 900, flex: 1 }}>Order #{o.id}</Typography>
                <Chip label={`TZS ${o.total_amount}`} variant="outlined" />
                <Chip label={o.payment_status} />
              </Box>

              <Typography color="text.secondary">{o.delivery_address}</Typography>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  size="small"
                  select
                  label="Status"
                  value={o.status}
                  onChange={(e) => changeStatus(o.id, e.target.value)}
                  disabled={saving === o.id}
                  sx={{ minWidth: 220 }}
                >
                  {['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  size="small"
                  select
                  label="Payment"
                  value={o.payment_status}
                  onChange={(e) => changePayment(o.id, e.target.value)}
                  disabled={saving === o.id}
                  sx={{ minWidth: 160 }}
                >
                  {['Pending', 'Paid'].map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
                <Button variant="outlined" onClick={() => listOrders().then(setOrders)}>
                  Refresh
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}

        {orders && orders.length === 0 ? (
          <Typography color="text.secondary">No orders.</Typography>
        ) : null}
      </Stack>
    </Box>
  )
}
