import {
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  Grid,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { useCart } from '../contexts/CartContext'
import { listCategories, listProducts } from '../services/products'

export default function ProductsPage() {
  const { addToCart } = useCart()
  const [items, setItems] = useState(null)
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  function imageUrl(p) {
    const url = p?.image
    if (!url) return null
    if (typeof url !== 'string') return null
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    if (url.startsWith('/')) return url
    return `/${url}`
  }

  function nameInitials(name) {
    const parts = String(name || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
    const a = parts[0]?.[0] || ''
    const b = parts[1]?.[0] || ''
    return (a + b).toUpperCase() || 'U'
  }

  function hashToHue(str) {
    let h = 0
    for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) >>> 0
    return h % 360
  }

  function placeholderGradient(name) {
    const hue = hashToHue(String(name || 'urojo'))
    const a = `hsl(${hue} 70% 55%)`
    const b = `hsl(${(hue + 35) % 360} 70% 48%)`
    return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`
  }

  useEffect(() => {
    let mounted = true
    Promise.all([listProducts(), listCategories()])
      .then(([productsData, categoriesData]) => {
        if (!mounted) return
        setItems(productsData)
        setCategories(categoriesData)
      })
      .catch(() => {
        if (!mounted) return
        setItems([])
        setCategories([])
      })
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    const list = items ?? []
    const q = query.trim().toLowerCase()
    const result = list.filter((p) => {
      if (categoryId !== 'all' && String(p.category) !== String(categoryId)) return false
      if (!q) return true
      const hay = `${p.name ?? ''} ${p.description ?? ''}`.toLowerCase()
      return hay.includes(q)
    })

    const sorted = [...result]
    if (sortBy === 'price_asc') sorted.sort((a, b) => Number(a.price) - Number(b.price))
    if (sortBy === 'price_desc') sorted.sort((a, b) => Number(b.price) - Number(a.price))
    if (sortBy === 'newest') sorted.sort((a, b) => Number(b.id) - Number(a.id))
    if (sortBy === 'availability') {
      sorted.sort((a, b) => {
        const av = (x) => (x.is_available ? 1 : 0)
        if (av(b) !== av(a)) return av(b) - av(a)
        return Number(b.stock_quantity) - Number(a.stock_quantity)
      })
    }

    return sorted
  }, [categoryId, items, query, sortBy])

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Zanzibar Urojo
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Freshly prepared street-style bowls, delivered to your door.
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button component={RouterLink} to="/cart" variant="outlined">
          Cart
        </Button>
      </Box>

      <Card sx={{ mb: 2 }}>
        <Box
          sx={{
            p: 2,
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: '1.6fr 1fr 1fr auto' },
          }}
        >
          <TextField
            label="Search"
            placeholder="Search Urojo, toppings, spicy…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
          />

          <TextField
            select
            label="Category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            fullWidth
          >
            <MenuItem value="all">All categories</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField select label="Sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} fullWidth>
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="availability">Availability</MenuItem>
            <MenuItem value="price_asc">Price: Low to High</MenuItem>
            <MenuItem value="price_desc">Price: High to Low</MenuItem>
          </TextField>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Typography color="text.secondary">
              {items ? `${filtered.length} items` : 'Loading…'}
            </Typography>
          </Box>
        </Box>
      </Card>

      {items && filtered.length === 0 ? (
        <Card>
          <Box sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 900, mb: 0.5 }}>No results</Typography>
            <Typography color="text.secondary">
              Try clearing filters or searching with a different keyword.
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button variant="outlined" onClick={() => setQuery('')}>
                Clear search
              </Button>
              <Button variant="outlined" onClick={() => setCategoryId('all')}>
                All categories
              </Button>
            </Box>
          </Box>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {((items ? filtered : Array.from({ length: 6 })) ?? []).map((p, idx) => (
            <Grid item xs={12} sm={6} md={4} key={p?.id ?? idx}>
              <Card
                sx={{
                  overflow: 'hidden',
                  transition: 'transform 160ms ease, box-shadow 160ms ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0px 10px 28px rgba(0,0,0,0.10)',
                  },
                }}
              >
                <CardActionArea component={RouterLink} to={p ? `/products/${p.id}` : '#'} disabled={!p}>
                  <Box
                    sx={{
                      position: 'relative',
                      height: 320,
                      bgcolor: 'grey.100',
                      backgroundImage:
                        p && imageUrl(p) ? `url(${imageUrl(p)})` : p ? placeholderGradient(p.name) : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transform: 'translateZ(0)',
                      transition: 'transform 240ms ease',
                      '.MuiCard-root:hover &': {
                        transform: 'scale(1.03)',
                      },
                    }}
                  >
                    {!p ? (
                      <Box sx={{ p: 2 }}>
                        <Skeleton variant="rounded" height={200} />
                      </Box>
                    ) : null}

                    {p && !imageUrl(p) ? (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1.25,
                          px: 2,
                          textAlign: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            width: 54,
                            height: 54,
                            borderRadius: 999,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: 'rgba(255,255,255,0.22)',
                            border: '1px solid rgba(255,255,255,0.25)',
                            backdropFilter: 'blur(6px)',
                          }}
                        >
                          <Typography sx={{ color: '#fff', fontWeight: 900, letterSpacing: 1 }}>
                            {nameInitials(p.name)}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 900, color: 'rgba(255,255,255,0.92)' }}>
                          {p.name}
                        </Typography>
                      </Box>
                    ) : null}

                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(180deg, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.60) 100%)',
                      }}
                    />

                    <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1 }}>
                      <Chip
                        size="small"
                        label={p ? `TZS ${p.price}` : '—'}
                        sx={{ bgcolor: 'rgba(255,255,255,0.94)', fontWeight: 900 }}
                      />
                      {p ? (
                        <Chip
                          size="small"
                          variant="outlined"
                          label={p.is_available ? `Stock ${p.stock_quantity}` : 'Unavailable'}
                          sx={{ bgcolor: 'rgba(255,255,255,0.80)' }}
                        />
                      ) : null}
                    </Box>

                    <Box sx={{ position: 'absolute', left: 14, right: 14, bottom: 14 }}>
                      <Typography sx={{ color: '#fff', fontWeight: 900, lineHeight: 1.15, fontSize: 18 }}>
                        {p ? p.name : <Skeleton width="60%" />}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'rgba(255,255,255,0.85)',
                          mt: 0.5,
                          fontSize: 13,
                          display: '-webkit-box',
                          overflow: 'hidden',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          minHeight: 40,
                        }}
                      >
                        {p ? p.description || '—' : <Skeleton />}
                      </Typography>
                    </Box>
                  </Box>
                </CardActionArea>

                <Box sx={{ display: 'flex', gap: 1, p: 2, pt: 1.5, alignItems: 'center' }}>
                  <Button component={RouterLink} to={p ? `/products/${p.id}` : '#'} disabled={!p}>
                    Details
                  </Button>
                  <Box sx={{ flex: 1 }} />
                  <Button variant="contained" disabled={!p || !p.is_available} onClick={() => addToCart(p)}>
                    Add
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
