import Navigation from "../home/components/Navigation/Navigation";
import Products from "./components/Products/Products";
import Footer from "../home/components/Footer/Footer";

export default function ProductsPage() {
    return (
        <div className="ProductsPage">
            <Navigation />
            <Products />
            <Footer />
        </div>
    );
}