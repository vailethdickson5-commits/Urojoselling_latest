import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'

import {
  createProduct,
  deleteProduct,
  listCategories,
  listProducts,
  updateProduct,
} from '../../services/products'

export default function AdminProductsPage() {
  const [products, setProducts] = useState(null)
  const [categories, setCategories] = useState([])
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stockQuantity, setStockQuantity] = useState('')
  const [category, setCategory] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)
  const [image, setImage] = useState(null)

  async function refresh() {
    try {
      const [p, c] = await Promise.all([listProducts(), listCategories()])
      setProducts(p)
      setCategories(c)
    } catch {
      setProducts([])
      setCategories([])
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const title = useMemo(() => (editing ? 'Edit product' : 'New product'), [editing])

  function resetForm() {
    setName('')
    setDescription('')
    setPrice('')
    setStockQuantity('')
    setCategory('')
    setIsAvailable(true)
    setImage(null)
  }

  function onCreateClick() {
    setEditing(null)
    resetForm()
    setOpen(true)
  }

  function onEditClick(p) {
    setEditing(p)
    setName(p.name || '')
    setDescription(p.description || '')
    setPrice(p.price ?? '')
    setStockQuantity(p.stock_quantity ?? '')
    setCategory(p.category ?? '')
    setIsAvailable(Boolean(p.is_available))
    setImage(null)
    setOpen(true)
  }

  async function onSave() {
    if (!name.trim() || !price || !category) return
    setSaving(true)
    try {
      const payload = {
        name,
        description,
        price,
        stock_quantity: stockQuantity === '' ? 0 : Number(stockQuantity),
        category: Number(category),
        is_available: isAvailable,
        image,
      }

      if (editing) {
        const updated = await updateProduct(editing.id, payload)
        setProducts((prev) => prev.map((x) => (x.id === editing.id ? updated : x)))
      } else {
        const created = await createProduct(payload)
        setProducts((prev) => [created, ...(prev ?? [])])
      }
      setOpen(false)
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(p) {
    const ok = window.confirm(`Delete product "${p.name}"?`)
    if (!ok) return
    setSaving(true)
    try {
      await deleteProduct(p.id)
      setProducts((prev) => prev.filter((x) => x.id !== p.id))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Products
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Button variant="outlined" onClick={refresh} disabled={saving}>
          Refresh
        </Button>
        <Button variant="contained" onClick={onCreateClick}>
          New
        </Button>
      </Box>

      <Stack spacing={2}>
        {(products ?? []).map((p) => (
          <Card key={p.id}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 900 }}>{p.name}</Typography>
                <Typography color="text.secondary">TZS {p.price}</Typography>
              </Box>
              <Chip label={p.is_available ? `Stock ${p.stock_quantity}` : 'Unavailable'} variant="outlined" />
              <Button onClick={() => onEditClick(p)} variant="text">
                Edit
              </Button>
              <Button onClick={() => onDelete(p)} color="error" variant="text" disabled={saving}>
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}

        {products && products.length === 0 ? (
          <Typography color="text.secondary">No products yet.</Typography>
        ) : null}
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            <TextField label="Price" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth />
            <TextField
              label="Stock quantity"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              fullWidth
            />
          </Box>
          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">Available</Typography>
            <Switch checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
          </Box>

          <Button variant="outlined" component="label">
            {image ? `Image: ${image.name}` : 'Upload image (optional)'}
            <input hidden type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
          </Button>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            variant="contained"
            disabled={saving || !name.trim() || !price || !category}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
