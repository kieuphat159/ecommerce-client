import "./Navigation.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navigation">
            <button className="navigation__hamburger" onClick={toggleMenu}>
                <span className="navigation__hamburger-line"></span>
                <span className="navigation__hamburger-line"></span>
                <span className="navigation__hamburger-line"></span>
            </button>
            <div className="navigation__logo">3legant.</div>
            <div className={`navigation__menu ${isMenuOpen ? 'active' : ''}`}>
                <a href="/" className="navigation__link">Home</a>
                <a href="#" className="navigation__link">Shop</a>
                <a href="/products" className="navigation__link">Product</a>
                <a href="#" className="navigation__link">Contact Us</a>
            </div>
            <div className="navigation__actions">
                <Link to="/api/auth/seller" className="navigation__action">
                    <img src="/assets/dashboard.svg" className="navigation__icon" alt="Dashboard" />
                </Link>
                <Link to="/signin" className="navigation__action">
                    <img src="/assets/profile.svg" className="navigation__icon" alt="Profile" />
                </Link>
                <Link to="/" className="navigation__action">
                    <img src="/assets/cart.svg" className="navigation__icon" alt="Cart" />
                </Link>
            </div>
        </nav>
    );
}