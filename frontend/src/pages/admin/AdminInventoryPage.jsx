import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import { addStock, listInventoryLogs } from '../../services/inventory'

export default function AdminInventoryPage() {
  const [logs, setLogs] = useState(null)
  const [productId, setProductId] = useState('')
  const [qty, setQty] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    listInventoryLogs().then(setLogs).catch(() => setLogs([]))
  }, [])

  async function onAdd() {
    if (!productId || !qty) return
    setLoading(true)
    try {
      await addStock({ product: Number(productId), quantity_added: Number(qty), reason })
      const data = await listInventoryLogs()
      setLogs(data)
      setProductId('')
      setQty('')
      setReason('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Inventory
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ display: 'grid', gap: 2 }}>
          <Typography sx={{ fontWeight: 800 }}>Add stock</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Product ID" value={productId} onChange={(e) => setProductId(e.target.value)} />
            <TextField label="Quantity" value={qty} onChange={(e) => setQty(e.target.value)} />
            <TextField
              label="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button variant="contained" onClick={onAdd} disabled={loading}>
              Add
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {(logs ?? []).map((l) => (
          <Card key={l.id}>
            <CardContent>
              <Typography sx={{ fontWeight: 800 }}>{l.product_name}</Typography>
              <Typography color="text.secondary">
                +{l.quantity_added} / -{l.quantity_removed} — {l.reason || '—'}
              </Typography>
            </CardContent>
          </Card>
        ))}

        {logs && logs.length === 0 ? <Typography color="text.secondary">No logs.</Typography> : null}
      </Stack>
    </Box>
  )
}
