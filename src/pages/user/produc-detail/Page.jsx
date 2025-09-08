import Navigation from "../home/components/Navigation/Navigation";
import Detail from "./components/Detail/Detail";
import Footer from "../home/components/Footer/Footer";
import './Page.css'

function ProductDetailPage() {
    return (
        <div className="productPage">
            <Navigation />
            <Detail />
            <Footer />
        </div>
    );
}

export default ProductDetailPage;