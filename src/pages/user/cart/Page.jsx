import Navigation from '../home/components/Navigation/Navigation';'../home/components/Navigation'
import Footer from '../home/components/Footer/Footer';
import CartContainer from './components/cart-container/CartContainer';

export default function CartPage() {
    const userId = localStorage.getItem('userId');
    return (
        <div className="cart">
            <Navigation />
            <CartContainer userId={userId}/>
            <Footer />
        </div>
    );
}