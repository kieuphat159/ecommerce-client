import SignUpPage from "./pages/auth/sign-up/Page";
import SignInPage from "./pages/auth/sign-in/Page";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/user/home/Page";
import ProductDetailPage from "./pages/user/produc-detail/Page"
import SellerPage from "./pages/seller/Page";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductsPage from "./pages/user/products/Page";
import CartPage from "./pages/user/cart/Page";
import MyAccountPage from "./pages/user/my-account/Page";
import { ShopPage } from "./pages/user/shop/Page";
import ContactUsPage from "./pages/user/contact-us/Page";

function App() {
    
  return (
    <>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/profile/:userId" element={<MyAccountPage/>} />
          <Route path="/user/home" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage/>} />
          {/* just a test */}

          <Route path="/api/auth/user/*" element={
            <ProtectedRoute requiredRole='customer'>
              <CartPage />
            </ProtectedRoute>
          }>
          </Route>

          <Route path="/seller/*" element={
            <ProtectedRoute requiredRole="seller">
              <SellerPage />
            </ProtectedRoute>
          }></Route>
          
          <Route path="/api/auth/seller/*" element={
            <ProtectedRoute requiredRole="seller">
              
            </ProtectedRoute>
          }></Route>
          
        </Routes>
    </>
    );
}

export default App;