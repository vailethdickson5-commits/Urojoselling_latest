import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Link as RouterLink } from 'react-router-dom'

import { useCart } from '../contexts/CartContext'

export default function CartPage() {
  const { items, total, removeFromCart, setQuantity } = useCart()

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Cart
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Button component={RouterLink} to="/products" variant="text">
          Continue shopping
        </Button>
      </Box>

      <Card>
        <CardContent>
          {items.length === 0 ? (
            <Typography color="text.secondary">Your cart is empty.</Typography>
          ) : (
            <Stack spacing={2}>
              {items.map((i) => (
                <Box key={i.product.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 700 }}>{i.product.name}</Typography>
                      <Typography color="text.secondary">TZS {i.product.price}</Typography>
                    </Box>
                    <TextField
                      size="small"
                      type="number"
                      value={i.quantity}
                      onChange={(e) => setQuantity(i.product.id, Number(e.target.value))}
                      sx={{ width: 110 }}
                      inputProps={{ min: 1 }}
                    />
                    <Typography sx={{ width: 120, textAlign: 'right', fontWeight: 700 }}>
                      TZS {Number(i.product.price) * i.quantity}
                    </Typography>
                    <IconButton onClick={() => removeFromCart(i.product.id)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, alignItems: 'center' }}>
                <Typography color="text.secondary">Total</Typography>
                <Typography sx={{ fontWeight: 900 }}>TZS {total}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button component={RouterLink} to="/checkout" variant="contained">
                  Checkout
                </Button>
              </Box>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
