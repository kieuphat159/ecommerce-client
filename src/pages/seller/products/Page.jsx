import { useNavigate } from "react-router-dom";

export default function ProductsPage() {
    const navigate = useNavigate();
    return (
        <div className="ProductsPage">
            <button onClick={() => navigate("/api/auth/seller/products")}>
                Products
            </button>
            <button onClick={() => navigate("/api/auth/seller/create")}>
                Create
            </button>
        </div>
    );
}