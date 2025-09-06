import SignUpPage from "./pages/auth/sign-up/Page";
import SignInPage from "./pages/auth/sign-in/Page";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/user/products/Page";

function App() {
    
  return (
    <>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/user/products" element={<ProductsPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      
    </>
    );
}

export default App;