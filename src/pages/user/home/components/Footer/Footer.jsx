import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__content">
                    <div className="footer__brand">
                        <h3 className="footer__title">3legant.</h3>
                        <h1>|</h1>
                        <p className="footer__tagline">Gift & Decoration Store</p>
                    </div>
                    <div className="footer__nav">
                        <a href="#" className="footer__nav-link">Home</a>
                        <a href="#" className="footer__nav-link">Shop</a>
                        <a href="#" className="footer__nav-link">Product</a>
                        <a href="#" className="footer__nav-link">Blog</a>
                        <a href="#" className="footer__nav-link">Contact Us</a>
                    </div>
                </div>
                <div className="footer__bottom">
                    <div className="footer__legal">
                        <span className="footer__copyright">Copyright © 2023 3legant. All rights reserved</span>
                        <a href="#" className="footer__legal-link">Privacy Policy</a>
                        <a href="#" className="footer__legal-link">Terms of Use</a>
                    </div>
                    <div className="footer__social">
                        <a href="#" className="footer__social-icon" aria-label="Instagram">
                            Instagram
                        </a>
                        <a href="#" className="footer__social-icon" aria-label="Facebook">
                            Facebook
                        </a>
                        <a href="#" className="footer__social-icon" aria-label="YouTube">
                            YouTube
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}