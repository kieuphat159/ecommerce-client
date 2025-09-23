import { useNavigate } from "react-router-dom";
import CreateProduct from "./create-product/CreateProduct";
import Products from "./products/components/Products/Products";
import { Routes, Route } from "react-router-dom";
import ProductsPage from "./products/Page";
import UpdateProduct from "./update-product/UpdateProduct";
import Dashboard from "./dashboard/Dashboard";

export default function SellerPage() {
  const userId = localStorage.getItem("userId");

  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard sellerId={userId}/>} />
        <Route path="/products" element={<Products sellerId={userId}/>} />
        <Route path="/create" element={<CreateProduct sellerId={userId}/>} />
        <Route path="/products/:id" element={<UpdateProduct sellerId={userId}/>} />
      </Routes>
    </div>
  );
}
