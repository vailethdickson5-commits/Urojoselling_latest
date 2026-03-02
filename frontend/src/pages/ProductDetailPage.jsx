import { Box, Button, Card, CardContent, Chip, Grid, Skeleton, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'

import { useCart } from '../contexts/CartContext'
import { getProduct, listProducts } from '../services/products'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getProduct(id)
      .then((data) => {
        if (mounted) setProduct(data)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [id])

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
    listProducts()
      .then((data) => {
        if (mounted) setAllProducts(data)
      })
      .catch(() => {
        if (mounted) setAllProducts([])
      })
    return () => {
      mounted = false
    }
  }, [])

  const toppings = useMemo(() => {
    if (!product) return []
    const base = ['Bhajia crunch', 'Tamarind drizzle', 'Fresh lime', 'Herb finish', 'Onion crunch']
    const extra = []
    const name = String(product.name || '').toLowerCase()
    const desc = String(product.description || '').toLowerCase()
    const text = `${name} ${desc}`

    if (text.includes('egg')) extra.push('Boiled egg')
    if (text.includes('chicken')) extra.push('Chicken bites')
    if (text.includes('beef')) extra.push('Beef bites')
    if (text.includes('prawn') || text.includes('shrimp')) extra.push('Prawns')
    if (text.includes('tuna')) extra.push('Tuna')
    if (text.includes('sardine')) extra.push('Sardines')
    if (text.includes('avocado')) extra.push('Avocado')
    if (text.includes('corn')) extra.push('Sweet corn')
    if (text.includes('coconut')) extra.push('Coconut note')
    if (text.includes('ginger')) extra.push('Ginger warmth')
    if (text.includes('garlic')) extra.push('Garlic aroma')
    if (text.includes('chili') || text.includes('pilipili') || text.includes('pili pili')) extra.push('Pili pili')

    const uniq = Array.from(new Set([...extra, ...base]))
    return uniq.slice(0, 8)
  }, [product])

  const related = useMemo(() => {
    if (!product) return []
    const sameCategory = allProducts.filter(
      (p) => p && String(p.category) === String(product.category) && String(p.id) !== String(product.id)
    )
    const available = sameCategory.filter((p) => p.is_available)
    const list = (available.length ? available : sameCategory).slice(0, 8)
    return list
  }, [allProducts, product])

  return (
    <Box>
      <Button component={RouterLink} to="/products" sx={{ mb: 2 }}>
        Back
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                height: { xs: 260, md: 420 },
                bgcolor: 'grey.100',
                backgroundImage: !loading
                  ? imageUrl(product)
                    ? `url(${imageUrl(product)})`
                    : placeholderGradient(product?.name)
                  : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
              }}
            >
              {loading ? <Skeleton variant="rectangular" height="100%" /> : null}
              {!loading && !imageUrl(product) ? (
                <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
                  <Box
                    sx={{
                      width: 74,
                      height: 74,
                      borderRadius: 999,
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: 'rgba(255,255,255,0.22)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    <Typography sx={{ color: '#fff', fontWeight: 900, letterSpacing: 1.2, fontSize: 18 }}>
                      {nameInitials(product?.name)}
                    </Typography>
                  </Box>
                </Box>
              ) : null}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                {loading ? <Skeleton width="60%" /> : product?.name}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {loading ? <Skeleton /> : product?.description || '—'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                <Chip label={loading ? '—' : `TZS ${product?.price}`} sx={{ fontWeight: 800 }} />
                {product ? (
                  <Chip
                    variant="outlined"
                    label={product.is_available ? `Stock ${product.stock_quantity}` : 'Unavailable'}
                  />
                ) : null}
                {product?.category_detail ? <Chip variant="outlined" label={product.category_detail.name} /> : null}
              </Box>

              <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  disabled={!product?.is_available}
                  onClick={() => addToCart(product)}
                >
                  Add to cart
                </Button>
                <Button component={RouterLink} to="/cart" variant="outlined">
                  View cart
                </Button>
              </Box>

              <Typography color="text.secondary" sx={{ mt: 2 }}>
                Tip: for the best experience, enjoy immediately while hot.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.75 }}>
                Ingredients / Toppings
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                Every bowl is finished with a balance of tang, spice, and crunch. Popular add-ons are listed below.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {(loading ? Array.from({ length: 7 }) : toppings).map((t, idx) => (
                  <Chip key={t || idx} label={loading ? '—' : t} variant="outlined" sx={{ fontWeight: 700 }} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
            Related bowls
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
            {(loading ? Array.from({ length: 4 }) : related).map((p, idx) => (
              <Card
                key={p?.id ?? idx}
                sx={{
                  minWidth: 240,
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
                      height: 120,
                      bgcolor: 'grey.100',
                      backgroundImage:
                        p && imageUrl(p) ? `url(${imageUrl(p)})` : p ? placeholderGradient(p?.name) : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                    }}
                  >
                    {!p ? <Skeleton variant="rectangular" height="100%" width="100%" /> : null}
                    {p && !imageUrl(p) ? (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
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
                          'linear-gradient(180deg, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.58) 100%)',
                      }}
                    />
                    <Box sx={{ position: 'absolute', left: 10, right: 10, bottom: 10 }}>
                      <Typography
                        sx={{
                          color: '#fff',
                          fontWeight: 900,
                          lineHeight: 1.15,
                          fontSize: 14,
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
                <Box sx={{ p: 1.25, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 900 }}>{p ? `TZS ${p.price}` : <Skeleton width={60} />}</Typography>
                  <Box sx={{ flex: 1 }} />
                  {p ? (
                    <Chip
                      size="small"
                      label={p.is_available ? `Stock ${p.stock_quantity}` : 'Unavailable'}
                      variant="outlined"
                    />
                  ) : null}
                </Box>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
