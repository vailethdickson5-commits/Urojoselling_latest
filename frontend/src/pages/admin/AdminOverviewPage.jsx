import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'

import { listOrders } from '../../services/orders'

export default function AdminOverviewPage() {
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

  const stats = useMemo(() => {
    const list = orders ?? []
    const totalOrders = list.length
    const pendingOrders = list.filter((o) => o.status === 'Pending').length
    const totalRevenue = list.reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
    return { totalOrders, pendingOrders, totalRevenue }
  }, [orders])

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Overview
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Total Orders</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                {stats.totalOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Pending</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                {stats.pendingOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Revenue</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                TZS {stats.totalRevenue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
