import { Alert, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCart } from '../contexts/CartContext'
import { createOrder } from '../services/orders'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, total, clear } = useCart()

  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryLatitude, setDeliveryLatitude] = useState('')
  const [deliveryLongitude, setDeliveryLongitude] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const payload = useMemo(() => {
    return {
      delivery_address: deliveryAddress,
      delivery_latitude: deliveryLatitude === '' ? null : Number(deliveryLatitude),
      delivery_longitude: deliveryLongitude === '' ? null : Number(deliveryLongitude),
      items: items.map((i) => ({ product: i.product.id, quantity: i.quantity })),
    }
  }, [deliveryAddress, deliveryLatitude, deliveryLongitude, items])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!deliveryAddress.trim()) {
      setError('Delivery address is required')
      return
    }
    if (items.length === 0) {
      setError('Your cart is empty')
      return
    }

    setLoading(true)
    try {
      const order = await createOrder(payload)
      clear()
      navigate(`/me/orders/${order.id}`)
    } catch (err) {
      setError('Could not place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Checkout
      </Typography>

      <Card>
        <CardContent>
          {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

          <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Delivery address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              fullWidth
            />
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <TextField
                label="Latitude (optional)"
                value={deliveryLatitude}
                onChange={(e) => setDeliveryLatitude(e.target.value)}
                fullWidth
              />
              <TextField
                label="Longitude (optional)"
                value={deliveryLongitude}
                onChange={(e) => setDeliveryLongitude(e.target.value)}
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography color="text.secondary">Total</Typography>
              <Typography sx={{ fontWeight: 900 }}>TZS {total}</Typography>
            </Box>

            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Placing…' : 'Place order'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
