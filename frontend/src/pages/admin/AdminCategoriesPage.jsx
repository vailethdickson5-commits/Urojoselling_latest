import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'

import { createCategory, deleteCategory, listCategories, updateCategory } from '../../services/products'

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  async function refresh() {
    try {
      const data = await listCategories()
      setCats(data)
    } catch {
      setCats([])
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const title = useMemo(() => (editing ? 'Edit category' : 'New category'), [editing])

  function onCreateClick() {
    setEditing(null)
    setName('')
    setDescription('')
    setOpen(true)
  }

  function onEditClick(cat) {
    setEditing(cat)
    setName(cat.name || '')
    setDescription(cat.description || '')
    setOpen(true)
  }

  async function onSave() {
    if (!name.trim()) return
    setSaving(true)
    try {
      if (editing) {
        const updated = await updateCategory(editing.id, { name, description })
        setCats((prev) => prev.map((c) => (c.id === editing.id ? updated : c)))
      } else {
        const created = await createCategory({ name, description })
        setCats((prev) => [created, ...(prev ?? [])])
      }
      setOpen(false)
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(cat) {
    const ok = window.confirm(`Delete category "${cat.name}"?`)
    if (!ok) return
    setSaving(true)
    try {
      await deleteCategory(cat.id)
      setCats((prev) => prev.filter((c) => c.id !== cat.id))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Categories
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
        {(cats ?? []).map((c) => (
          <Card key={c.id}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 900 }}>{c.name}</Typography>
                <Typography color="text.secondary">{c.description || '—'}</Typography>
              </Box>
              <Button onClick={() => onEditClick(c)} variant="text">
                Edit
              </Button>
              <Button onClick={() => onDelete(c)} color="error" variant="text" disabled={saving}>
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}

        {cats && cats.length === 0 ? <Typography color="text.secondary">No categories.</Typography> : null}
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
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={onSave} variant="contained" disabled={saving || !name.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
