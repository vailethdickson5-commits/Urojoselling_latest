import { Alert, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { register as registerApi } from '../services/auth'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function extractError(data) {
    if (!data) return 'Registration failed'
    if (typeof data === 'string') return data
    if (data.detail) return data.detail
    const firstKey = Object.keys(data)[0]
    if (!firstKey) return 'Registration failed'
    const val = data[firstKey]
    if (Array.isArray(val) && val[0]) return `${firstKey}: ${val[0]}`
    return 'Registration failed'
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await registerApi({
        full_name: fullName.trim(),
        email: email.trim(),
        phone_number: phoneNumber.trim(),
        password,
      })
      navigate('/login')
    } catch (err) {
      setError(extractError(err?.response?.data))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <Card sx={{ width: '100%', maxWidth: 520 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
            Create account
          </Typography>

          {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

          <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth />
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField
              label="Phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Creating…' : 'Register'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
