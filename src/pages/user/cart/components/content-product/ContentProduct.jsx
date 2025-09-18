import { useState } from "react";
import './ContentProduct.css'

export default function ContentProduct({mockProducts}) {
    const [shippingMethod, setShippingMethod] = useState("free");
    const [numberOfProduct, setNumberOfProduct] = useState(1);
    const increase = () => {
        setNumberOfProduct(Math.min(numberOfProduct + 1, currentQuantity));
    };

    const decrease = () => {
        setNumberOfProduct(Math.max(1, numberOfProduct - 1));
    };
    
    return (
        <>
            <div className="content__products">
                <div className="content__products__title">Product</div>
                <hr />
                <div className="content__products__products-section">
                    {mockProducts && mockProducts.map((product, index) => (
                    <div className="products-section__product" key={index}>
                        <img src={product.img} alt={`Image of ${product.name}`} />
                        <div className="products-section__product--detail">
                            <div className="detail__name">{product.name}</div>
                            {product.options.map((option, optIndex) => (
                                <div key={optIndex} className="detail__option">
                                    {Object.entries(option).map(([key, value]) => (
                                    <span key={key}>{key}: {value}</span>
                                    ))}
                                </div>
                            ))}
                            <div className="number-input">
                                <button className="number-input__button number-input__button--decrease" onClick={decrease}>-</button>
                                <span className="number-input__value">{product.quantity}</span>
                                <button className="number-input__button number-input__button--increase" onClick={increase}>+</button>
                            </div>
                        </div>
                        <div className="products-section__product--option">
                            <div className="option__price">{product.price}</div>
                            <div className="option__remove"><img src="./assets/Shape.png"/></div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            <div className="coupon">
                <div className="coupon__title">Have a coupon?</div>
                <div className="coupon__text">Add your code for an instant cart discount</div>
                <div className="coupon__input">
                    <img src="./assets/Vector.png" alt="" />
                    <input type="text" placeholder="Coupon Code" />
                    <div className="coupon__input--apply">Apply</div>
                </div>
            </div>

            <div className="cart-summary">
                <h3 className="cart-summary__title">Cart summary</h3>
                <div className="cart-summary__select">
                    <label className="cart-summary__select--option">
                        <input 
                            type="radio" 
                            name="shipping" 
                            id="free" 
                            value="free"
                            checked={shippingMethod === "free"}
                            onChange={() => setShippingMethod("free")}
                        />
                        <span>Free shipping</span>
                        <span>$0.00</span>
                    </label>

                    <label className="cart-summary__select--option">
                        <input 
                            type="radio" 
                            name="shipping" 
                            id="express" 
                            value="express"
                            checked={shippingMethod === "express"}
                            onChange={() => setShippingMethod("express")}
                        />
                        <span>Express shipping</span>
                        <span>+$15.00</span>
                    </label>

                    <label className="cart-summary__select--option">
                        <input 
                            type="radio" 
                            name="shipping" 
                            id="pick-up" 
                            value="pick-up"
                            checked={shippingMethod === "pick-up"}
                            onChange={() => setShippingMethod("pick-up")}
                        />
                        <span>Pick Up</span>
                        <span>$21.00</span>
                    </label>
                </div>

                <div className="cart-summary__subtotal">
                    <label>Subtotal</label>
                    <label>$1234.00</label>
                </div>
                <hr />
                <div className="cart-summary__total">
                    <label>Total</label>
                    <label>$1345.00</label>
                </div>
                <button className="cart-summary__button">
                    Checkout
                </button>
            </div>
        </>
    );
}