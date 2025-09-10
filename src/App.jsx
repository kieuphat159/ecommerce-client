import SignUpPage from "./pages/auth/sign-up/Page";
import SignInPage from "./pages/auth/sign-in/Page";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/user/home/Page";
import ProductDetailPage from "./pages/user/produc-detail/Page"
import SellerPage from "./pages/seller/SellerPage";
import CreateProduct from  "./pages/seller/create-product/CreateProduct";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductsPage from "./pages/user/products-section/Page";

function App() {
    
  return (
    <>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/home" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/api/auth/seller" element={
            <ProtectedRoute requiredRole="seller">
              <CreateProduct />
            </ProtectedRoute>
          }></Route>
          <Route path="/product/:id" element={<ProductDetailPage/>} />
        </Routes>
    </>
    );
}

export default App;