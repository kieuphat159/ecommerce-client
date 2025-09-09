import Navigation from "../home/components/Navigation/Navigation";
import Products from "./components/Products/Products";

export default function ProductsPage() {
    return (
        <div className="ProductsPage">
            <Navigation />
            <Products />
        </div>
    );
}