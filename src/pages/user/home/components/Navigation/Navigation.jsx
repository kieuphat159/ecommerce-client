import "./Navigation.css";
import { Link } from "react-router-dom";

export default function Navigation() {
    return (
        <nav>
            <div className="leftSide">3legant.</div>
            <div className="center">
                <a href="#">Home</a>
                <a href="#">Shop</a>
                <a href="#">Product</a>
                <a href="#">Contact Us</a>
            </div>
            <div className="rightSide">
                <Link to="/seller">search</Link>
                <Link to="/signin">profile</Link>
                <button>cart</button>
            </div>
            
        </nav>
    );
}