import { useNavigate } from "react-router-dom";

export default function ProductsPage() {
    const navigate = useNavigate();
    return (
        <div className="ProductsPage">
            <button onClick={() => navigate("/seller/products")}>
                Products
            </button>
            
        </div>
    );
}