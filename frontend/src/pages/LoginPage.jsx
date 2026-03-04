import { Alert, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function extractError(data) {
    if (!data) return 'Login failed'
    if (typeof data === 'string') return data
    if (data.detail) return data.detail
    const firstKey = Object.keys(data)[0]
    if (!firstKey) return 'Login failed'
    const val = data[firstKey]
    if (Array.isArray(val) && val[0]) return `${firstKey}: ${val[0]}`
    return 'Login failed'
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login({ email: email.trim(), password })
      const next = params.get('next')
      if (next) {
        navigate(next)
      } else if (user?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/products')
      }
    } catch (err) {
      setError(extractError(err?.response?.data))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
            Login
          </Typography>

          {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

          <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
