import { useNavigate } from "react-router-dom";
import CreateProduct from "./create-product/CreateProduct";
import Products from "./products/components/Products/Products";
import { Routes, Route } from "react-router-dom";
import ProductsPage from "./products/Page";

export default function SellerPage() {
  const userId = localStorage.getItem("userId");

  return (
    <div>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/products" element={<Products sellerId={userId}/>} />
        <Route path="/create" element={<CreateProduct />} />
      </Routes>
    </div>
  );
}
