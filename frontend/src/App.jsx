import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout/Layout';



//pages
import Home from './pages/Home';
import ProductList from './pages/Products/ProductList'
import ProductDetail from './pages/Products/ProductDetails';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/User/Profile';
import Orders from './pages/User/Orders';
import OrderDetail from './pages/User/OrderDetails';
import Addresses from './pages/User/Addresses';
import VendorDashoard from './pages/Vendor/Dashboard';
// import VendorProducts from './pages/Vendor/Products';
// import VendorOrders from './pages/Vendor/Orders';
import Categories from './pages/Categories/Categories';
import SearchResults from './pages/Search/SearchResults';
import NotFound from './pages/Errors/NotFound';

// protected routes
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Routes>
            {/* public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:slug" element={<ProductList />} />
            <Route path='/search' element={<SearchResults />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />

            {/* protected User Routes */ }
            <Route path='/cart' element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path='/checkout' element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path='/profile' element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path='/orders' element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path='/orders/:orderId' element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            } />
            <Route path='/addresses' element={
              <ProtectedRoute>
                <Addresses />
              </ProtectedRoute>
            } />

            {/* protected Vendor Routes */}
            <Route path='/vendor/dashboard' element={
              <ProtectedRoute requireVendor>
                <VendorDashoard />
              </ProtectedRoute>
            } />
            {/* <Route path='/vendor/products' element={
              <ProtectedRoute requireVendor>
                <VendorProducts />
              </ProtectedRoute>
            } /> */}
            {/* <Route path='/vendor/orders' element={
              <ProtectedRoute requireVendor>
                <VendorOrders />
              </ProtectedRoute>
            } /> */}

            {/* Error routes */}
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Layout>
      </CartProvider>
    </AuthProvider>
  )
}
export default App
