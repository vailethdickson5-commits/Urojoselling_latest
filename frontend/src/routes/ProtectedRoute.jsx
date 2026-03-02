import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ allowRoles }) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (Array.isArray(allowRoles) && allowRoles.length > 0 && !allowRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
