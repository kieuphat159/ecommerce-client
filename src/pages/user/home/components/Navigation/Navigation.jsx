import "./Navigation.css";
import { Link } from "react-router-dom";

export default function Navigation() {
    return (
        <nav>
            <div className="leftSide">3legant.</div>
            <div className="center">
                <a href="/">Home</a>
                <a href="#">Shop</a>
                <a href="/products">Product</a>
                <a href="#">Contact Us</a>
            </div>
            <div className="rightSide">
                <Link to="/api/auth/seller"><img src="/assets/dashboard.svg"></img></Link>
                <Link to="/signin"><img src="/assets/profile.svg"></img></Link>
                <Link to="/"><img src="/assets/cart.svg"></img></Link>
            </div>
            
        </nav>
    );
}