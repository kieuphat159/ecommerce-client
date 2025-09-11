import { useNavigate } from "react-router-dom";
import CreateProduct from "./create-product/CreateProduct";
import Products from "./products/components/Products/Products";
import Navigation from "../user/home/components/Navigation/Navigation";
import { Routes, Route } from "react-router-dom";

export default function SellerPage() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/api/auth/seller/products")}>
        Products
      </button>
      <button onClick={() => navigate("/api/auth/seller/create")}>
        Create
      </button>

      <Routes>
        <Route path="products" element={<Products sellerId={userId}/>} />
        <Route path="create" element={<CreateProduct />} />
      </Routes>
    </div>
  );
}
