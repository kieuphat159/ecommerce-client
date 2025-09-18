import Navigation from '../home/components/Navigation/Navigation';'../home/components/Navigation'
import Footer from '../home/components/Footer/Footer';
import CartContainer from './components/cart-container/CartContainer';

export default function CartPage() {
    return (
        <div className="cart">
            <Navigation />
            <CartContainer />
            <Footer />
        </div>
    );
}