import "./Navigation.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import authService from "../../../../../services/authService";

export default function Navigation() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("role");
        if (userId) {
            setUser({ id: userId, role });
        }
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const signOut = () => {
        authService.logout();
        setUser(null);
        navigate("/signin");
    };

    const handleCartClick = () => {
        if (!user) {
            navigate("/signin");
        } else {
            navigate("/api/auth/user/cart");
        }
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
                {user?.role === "seller" && (
                    <Link to="/api/auth/seller" className="navigation__action">
                        <img src="/assets/dashboard.svg" className="navigation__icon" alt="Dashboard" />
                    </Link>
                )}

                {!user && (
                    <Link to="/signin" className="navigation__action">
                        <img src="/assets/profile.svg" className="navigation__icon" alt="Sign in" />
                    </Link>
                )}

                {user && (
                    <>
                        <Link to="/profile" className="navigation__action">
                            <img src="/assets/profile.svg" className="navigation__icon" alt="Profile" />
                        </Link>
                        <button className="navigation__button" onClick={signOut}>Sign out</button>
                    </>
                )}

                <button onClick={handleCartClick} className="navigation__action navigation__button">
                    <img src="/assets/cart.svg" className="navigation__icon" alt="Cart" />
                </button>
            </div>
        </nav>
    );
}
