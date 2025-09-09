import Navigation from "./components/Navigation/Navigation";
import Banner from "./components/Banner/Banner";
import Products from "./components/Products/Products";
import Footer from "./components/Footer/Footer";
import "./Page.css";
export default function HomePage() {
    return (
        <div className="HomePage">
            <Navigation />
            <Banner />
            {/*<Products /> */}
            <Footer />
        </div>
    );
}