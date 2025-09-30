import Hero from '../products/components/Hero/Hero';
import Footer from '../home/components/Footer/Footer';
import Navigation from '../home/components/Navigation/Navigation';
import ShopProducts from './components/shop-products/ShopProducts'

export function ShopPage() {
    return (
            <div className="ProductsPage">
                <Navigation />
                <Hero image={"/images/shop.png"} title={`Shop Page`} description={`Let's design the place you always imagined`} />
                <ShopProducts />
                <Footer />
            </div>
        );
}