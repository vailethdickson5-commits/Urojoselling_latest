import { CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import AdminLayout from './layouts/AdminLayout'
import PublicLayout from './layouts/PublicLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import theme from './theme'

import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MyOrdersPage from './pages/MyOrdersPage'
import NotFoundPage from './pages/NotFoundPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductsPage from './pages/ProductsPage'
import RegisterPage from './pages/RegisterPage'
import TrackOrderPage from './pages/TrackOrderPage'

import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminInventoryPage from './pages/admin/AdminInventoryPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminOverviewPage from './pages/admin/AdminOverviewPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminReportsPage from './pages/admin/AdminReportsPage'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute allowRoles={['customer']} />}>
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="me/orders" element={<MyOrdersPage />} />
                  <Route path="me/orders/:id" element={<TrackOrderPage />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute allowRoles={['admin']} />}>
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<AdminOverviewPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="inventory" element={<AdminInventoryPage />} />
                  <Route path="reports" element={<AdminReportsPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
