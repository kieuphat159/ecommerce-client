import "./Navigation.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../../../../hooks/useAuth";

export default function Navigation() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [isProductOpen, setIsProductOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleShop = () => setIsShopOpen(!isShopOpen);
    const toggleProduct = () => setIsProductOpen(!isProductOpen);

    const signOut = () => {
        logout();
        navigate("/signin");
    };

    const handleCartClick = () => {
        if (!isAuthenticated) {
            navigate("/signin");
        } else {
            navigate("/api/auth/user/cart");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
    };

    return (
        <nav className="navigation">
            <button className={`navigation__hamburger ${isMenuOpen ? 'close' : ''}`} onClick={toggleMenu}>
                <span className="navigation__hamburger-line"></span>
                <span className="navigation__hamburger-line"></span>
                <span className="navigation__hamburger-line"></span>
            </button>
            
            <div className="navigation__logo">3legant.</div>
            
            <div className="navigation__desktop-menu">
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

                {!isAuthenticated && (
                    <Link to="/signin" className="navigation__action">
                        <img src="/assets/profile.png" className="navigation__icon" alt="Sign in" />
                    </Link>
                )}

                {isAuthenticated && (
                    <>
                        <Link to="/profile" className="navigation__action">
                            <img src="/assets/profile.png" className="navigation__icon" alt="Profile" />
                        </Link>
                        <button className="navigation__button" onClick={signOut}>Sign out</button>
                    </>
                )}

                <button onClick={handleCartClick} className="navigation__action navigation__button">
                    <img src="/assets/cart.png" className="navigation__icon" alt="Cart" />
                </button>
            </div>

            {isMenuOpen && <div className="navigation__overlay" onClick={toggleMenu}></div>}

            <div className={`navigation__mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                <div className="navigation__mobile-header">
                    <div className="navigation__mobile-logo">3legant.</div>
                    <button className="navigation__close" onClick={toggleMenu}>
                        <span className="navigation__close-icon">×</span>
                    </button>
                </div>

                <form className="navigation__search" onSubmit={handleSearch}>
                    <div className="navigation__search-container">
                        <img src="/assets/search.png" className="navigation__search-icon" alt="Search" />
                        <input 
                            type="text" 
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="navigation__search-input"
                        />
                    </div>
                </form>

                <div className="navigation__mobile-links">
                    <Link to="/" className="navigation__mobile-link" onClick={toggleMenu}>
                        Home
                    </Link>
                    
                    <div className="navigation__dropdown">
                        <button 
                            className="navigation__dropdown-button"
                            onClick={toggleShop}
                        >
                            Shop
                            <span className={`navigation__dropdown-arrow ${isShopOpen ? 'open' : ''}`}>▼</span>
                        </button>
                        {isShopOpen && (
                            <div className="navigation__dropdown-content">
                                <Link to="/shop/furniture" className="navigation__dropdown-link" onClick={toggleMenu}>
                                    Furniture
                                </Link>
                                <Link to="/shop/decor" className="navigation__dropdown-link" onClick={toggleMenu}>
                                    Decor
                                </Link>
                                <Link to="/shop/lighting" className="navigation__dropdown-link" onClick={toggleMenu}>
                                    Lighting
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="navigation__dropdown">
                        <button 
                            className="navigation__dropdown-button"
                            onClick={toggleProduct}
                        >
                            Product
                            <span className={`navigation__dropdown-arrow ${isProductOpen ? 'open' : ''}`}>▼</span>
                        </button>
                        {isProductOpen && (
                            <div className="navigation__dropdown-content">
                                <Link to="/products/" className="navigation__dropdown-link" onClick={toggleMenu}>
                                    New Arrivals
                                </Link>
                                <Link to="/products/" className="navigation__dropdown-link" onClick={toggleMenu}>
                                    Sale Items
                                </Link>
                                <Link to="/products/" className="navigation__dropdown-link" onClick={toggleMenu}>
                                    Featured
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link to="/contact" className="navigation__mobile-link" onClick={toggleMenu}>
                        Contact Us
                    </Link>
                </div>

                <div className="navigation__mobile-bottom">
                    <div className="navigation__mobile-actions">
                        <button onClick={handleCartClick} className="navigation__mobile-action">
                            <img src="/assets/cart.png" className="navigation__mobile-icon" alt="Cart" />
                            <span>Cart</span>
                            <span className="navigation__badge">2</span>
                        </button>
                        
                        <Link to="/wishlist" className="navigation__mobile-action" onClick={toggleMenu}>
                            <img src="/assets/heart.png" className="navigation__mobile-icon" alt="Wishlist" />
                            <span>Wishlist</span>
                            <span className="navigation__badge">2</span>
                        </Link>
                    </div>

                    {!isAuthenticated ? (
                        <Link to="/signin" className="navigation__signin-button" onClick={toggleMenu}>
                            Sign In
                        </Link>
                    ) : (
                        <button className="navigation__signin-button" onClick={signOut}>
                            Sign Out
                        </button>
                    )}

                    <div className="navigation__social">
                        <a href="#" className="navigation__social-link">
                            <img src="/assets/instagram.png" className="navigation__social-icon" alt="Instagram" />
                        </a>
                        <a href="#" className="navigation__social-link">
                            <img src="/assets/facebook.png" className="navigation__social-icon" alt="Facebook" />
                        </a>
                        <a href="#" className="navigation__social-link">
                            <img src="/assets/youtube.png" className="navigation__social-icon" alt="YouTube" />
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}