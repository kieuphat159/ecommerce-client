import './Page.css'
import Navigation from '../home/components/Navigation/Navigation'
import Footer from '../home/components/Footer/Footer'

export default function ContactUsPage() {
    return(
        <>
            <Navigation />
            <section className="contact-us">
                <div className='contact-us__text'>
                    <h1 className='contact-us__title'>
                        We believe in sustainable decor. We're passionate about life at home.
                    </h1>
                    <p className='contact-us__description'>
                        Our features timeless furniture, with natural fabrics, curved lines, 
                        plenty of mirrors and classic design, which can be incorporated into any decor project. 
                        The pieces enchant for their sobriety, to last for generations, faithful to the shapes of each period, with a touch of the present
                    </p>
                </div>
                <div className='contact-us__hero'>
                    <img src="/images/banner.webp" alt="living room" />
                    <div className='contact-us__info'>
                        <h2 className='info__title'>
                            About Us
                        </h2>
                        <div className='info__detail'>
                            <p>
                                3legant is a gift & decorations store based in HCMC, 
                                Vietnam. Est since 2019. 
                            </p>
                            <p>
                                Our customer service is always prepared to 
                                support you 24/7
                            </p>
                        </div>
                        
                        <a className='info__link' href="">Shop Now →</a>
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className='contact-section'>
                    <h2 className='contact-section__title'>Contact Us</h2>
                    
                    <div className='contact-section__info-cards'>
                        <div className='info-card'>
                            <img src="/images/store 01.png" alt="address" className='info-card__icon' />
                            <p className='info-card__label'>ADDRESS</p>
                            <p className='info-card__value'>234 Hai Trieu, Ho Chi Minh City,</p>
                            <p className='info-card__value'>Viet Nam</p>
                        </div>
                        <div className='info-card'>
                            <img src="/images/call.png" alt="phone" className='info-card__icon' />
                            <p className='info-card__label'>CONTACT US</p>
                            <p className='info-card__value'>+84 234 567 890</p>
                        </div>
                        <div className='info-card'>
                            <img src="/images/mail.png" alt="email" className='info-card__icon' />
                            <p className='info-card__label'>EMAIL</p>
                            <p className='info-card__value'>hello@3legant.com</p>
                        </div>
                    </div>

                    <div className='contact-section__content'>
                        <form className='contact-form'>
                            <div className='form-group'>
                                <label>FULL NAME</label>
                                <input type="text" placeholder="Your Name" />
                            </div>
                            <div className='form-group'>
                                <label>EMAIL ADDRESS</label>
                                <input type="email" placeholder="Your Email" />
                            </div>
                            <div className='form-group'>
                                <label>MESSAGE</label>
                                <textarea placeholder="Your message" rows="5"></textarea>
                            </div>
                            <button type="submit" className='form-submit'>Send Message</button>
                        </form>

                        <div className='contact-map'>
                            <img src="/images/map.jpg" alt="Location Map" />
                        </div>
                    </div>
                </div>

                <div className='features-section'>
                    <div className='feature-item'>
                        <img src="/images/fast delivery.png" alt="shipping" className='feature-icon' />
                        <div className='feature-content'>
                            <h3 className='feature-title'>Free Shipping</h3>
                            <p className='feature-text'>Order above $200</p>
                        </div>
                    </div>
                    <div className='feature-item'>
                        <img src="/images/money.png" alt="money back" className='feature-icon' />
                        <div className='feature-content'>
                            <h3 className='feature-title'>Money-back</h3>
                            <p className='feature-text'>30 days guarantee</p>
                        </div>
                    </div>
                    <div className='feature-item'>
                        <img src="/images/lock 01.png" alt="secure payments" className='feature-icon' />
                        <div className='feature-content'>
                            <h3 className='feature-title'>Secure Payments</h3>
                            <p className='feature-text'>Secured by Stripe</p>
                        </div>
                    </div>
                    <div className='feature-item'>
                        <img src="/images/call.png" alt="support" className='feature-icon' />
                        <div className='feature-content'>
                            <h3 className='feature-title'>24/7 Support</h3>
                            <p className='feature-text'>Phone and Email support</p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}