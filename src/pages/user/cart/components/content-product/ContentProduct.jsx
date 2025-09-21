import { useState } from "react";
import './ContentProduct.css'

export default function ContentProduct({ 
    mockProducts, 
    userId, 
    onRemove, 
    shippingMethod, 
    setShippingMethod, 
    quantities, 
    setQuantities,
    updateQuantity,
    setActive, 
    setHeaderTile
    }) {

    const increase = (index, stock) => {
        const currentQty = quantities[index];
        if (currentQty < stock) {
            updateQuantity(index, 1); 
        }
    };

    const decrease = (index) => {
        const currentQty = quantities[index];
        if (currentQty > 1) {
            updateQuantity(index, -1); 
        }
    };

    // Tính toán subtotal và total
    const calculateSubtotal = () => {
        return mockProducts.reduce((total, product, index) => {
            const price = parseFloat(product.price.replace('$', ''));
            return total + (price * (quantities[index] || 0));
        }, 0);
    };

    const getShippingCost = () => {
        switch(shippingMethod) {
            case 'express': return 15.00;
            case 'pick-up': return 21.00;
            default: return 0.00;
        }
    };

    const subtotal = calculateSubtotal();
    const shippingCost = getShippingCost();
    const total = subtotal + shippingCost;

    
    return (
        <>
            <div className="content__products">
                <div className="content__products__title">Product</div>
                <hr />
                <div className="content__products__products-section">
                    {mockProducts && mockProducts.map((product, index) => (
                    <div className="products-section__product" key={index}>
                        <div className="products-section__product__img">
                            <img src={product.img} alt={`Image of ${product.name}`} />
                        </div>
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
                                <button 
                                    className="number-input__button number-input__button--decrease" 
                                    onClick={() => decrease(index)}
                                    disabled={!quantities[index] || quantities[index] <= 1}
                                >
                                    -
                                </button>
                                <span className="number-input__value">{quantities[index] || 0}</span>
                                <button 
                                    className="number-input__button number-input__button--increase" 
                                    onClick={() => increase(index, product.stock_quantity)}
                                    disabled={!quantities[index] || quantities[index] >= product.stock_quantity}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="products-section__product--option">
                            <div className="option__price">
                                ${(parseFloat(product.price.replace('$', '')) * (quantities[index] || 0)).toFixed(2)}
                            </div>
                            <div className="option__remove"
                            onClick={() => onRemove(product.cart_item_id)}
                            ><img src="/assets/Shape.png"/></div>
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
                    <label>${subtotal.toFixed(2)}</label>
                </div>
                <hr />
                <div className="cart-summary__total">
                    <label>Total</label>
                    <label>${total.toFixed(2)}</label>
                </div>
                <button 
                    className="cart-summary__button"
                    onClick={() => {
                        setHeaderTile("Check Out");
                        setActive(2);
                }}>
                    Checkout
                </button>
            </div>
        </>
    );
}