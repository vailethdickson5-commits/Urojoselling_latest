import { Box, Button, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { listProducts } from '../services/products'

export default function HomePage() {
  const [items, setItems] = useState(null)

  useEffect(() => {
    let mounted = true
    listProducts()
      .then((data) => {
        if (mounted) setItems(data)
      })
      .catch(() => {
        if (mounted) setItems([])
      })
    return () => {
      mounted = false
    }
  }, [])

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

  const popular = useMemo(() => {
    const list = items ?? []
    const available = list.filter((p) => p?.is_available)
    const sorted = [...(available.length ? available : list)]
    sorted.sort((a, b) => Number(b.stock_quantity) - Number(a.stock_quantity))
    return sorted.slice(0, 8)
  }, [items])

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Zanzibar Urojo — Fresh, Fast, Delivered
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Explore curated Urojo bowls inspired by Stone Town street stalls. Order in seconds and track every step.
          </Typography>
          <Button component={RouterLink} to="/products" variant="contained">
            Browse menu
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Popular right now
            </Typography>
            <Typography color="text.secondary">Best picks from today’s menu</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
            {((items ? popular : Array.from({ length: 6 })) ?? []).map((p, idx) => (
              <Card
                key={p?.id ?? idx}
                sx={{
                  minWidth: 260,
                  overflow: 'hidden',
                  flex: '0 0 auto',
                  transition: 'transform 160ms ease, box-shadow 160ms ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0px 10px 24px rgba(0,0,0,0.10)',
                  },
                }}
              >
                <Button
                  component={RouterLink}
                  to={p ? `/products/${p.id}` : '#'}
                  disabled={!p}
                  sx={{ p: 0, textTransform: 'none', width: '100%', justifyContent: 'flex-start' }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: 140,
                      bgcolor: 'grey.100',
                      backgroundImage:
                        p && imageUrl(p) ? `url(${imageUrl(p)})` : p ? placeholderGradient(p.name) : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                    }}
                  >
                    {!p ? <Skeleton variant="rectangular" height="100%" width="100%" /> : null}
                    {p && !imageUrl(p) ? (
                      <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
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
                      </Box>
                    ) : null}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(180deg, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.60) 100%)',
                      }}
                    />
                    <Box sx={{ position: 'absolute', left: 12, right: 12, bottom: 12 }}>
                      <Typography
                        sx={{
                          color: '#fff',
                          fontWeight: 900,
                          lineHeight: 1.15,
                          fontSize: 15,
                          display: '-webkit-box',
                          overflow: 'hidden',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                        }}
                      >
                        {p ? p.name : '—'}
                      </Typography>
                    </Box>
                  </Box>
                </Button>

                <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 900 }}>{p ? `TZS ${p.price}` : <Skeleton width={70} />}</Typography>
                  <Box sx={{ flex: 1 }} />
                  <Button size="small" variant="outlined" disabled={!p} component={RouterLink} to={p ? `/products/${p.id}` : '#'}>
                    View
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Curated menu
              </Typography>
              <Typography color="text.secondary">Categories, prices, and availability in one glance.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Delivery-ready
              </Typography>
              <Typography color="text.secondary">Save time with a simple checkout flow and clear totals.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Live order updates
              </Typography>
              <Typography color="text.secondary">From Pending to Delivered with status and payment updates.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
            What is Urojo?
          </Typography>
          <Typography color="text.secondary">
            A legendary Zanzibar soup-bowl experience: tangy, spicy, and packed with crunchy toppings. Customize with
            your favorite add-ons and enjoy it hot.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
