import Navigation from "../home/components/Navigation/Navigation";
import Products from "./components/Products/Products";
import Footer from "../home/components/Footer/Footer";
import Hero from "./components/Hero/Hero";

export default function ProductsPage() {
    return (
        <div className="ProductsPage">
            <Navigation />
            <Hero image={"/images/products-hero.jpg"} title={`Products Page`} description={`Let’s design the place you always imagined`} />
            <Products />
            <Footer />
        </div>
    );
}