import "./Footer.css";

export default function Footer() {
    return (
        <footer className="page-footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3 className="footer-title">3legant.</h3>
                        <h1>|</h1>
                        <p className="footer-tagline">Gift & Decoration Store</p>
                    </div>
                    <div className="footer-nav">
                        <a href="#" className="footer-nav-link">Home</a>
                        <a href="#" className="footer-nav-link">Shop</a>
                        <a href="#" className="footer-nav-link">Product</a>
                        <a href="#" className="footer-nav-link">Blog</a>
                        <a href="#" className="footer-nav-link">Contact Us</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="footer-legal">
                        <span className="copyright">Copyright © 2023 3legant. All rights reserved</span>
                        <a href="#" className="legal-link">Privacy Policy</a>
                        <a href="#" className="legal-link">Terms of Use</a>
                    </div>
                    <div className="footer-social">
                        <a href="#" className="social-icon" aria-label="Instagram">
                            Instagram
                        </a>
                        <a href="#" className="social-icon" aria-label="Facebook">
                            Facebook
                        </a>
                        <a href="#" className="social-icon" aria-label="YouTube">
                            YouTube
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}