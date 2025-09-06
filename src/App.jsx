import SignUpPage from "./pages/auth/sign-up/Page";
import SignInPage from "./pages/auth/sign-in/Page";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/user/home/Page";
import SellerPage from "./pages/seller/SellerPage";

function App() {
    
  return (
    <>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/home" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/api/auth/seller" element={<SellerPage />} />
        </Routes>
      
    </>
    );
}

export default App;